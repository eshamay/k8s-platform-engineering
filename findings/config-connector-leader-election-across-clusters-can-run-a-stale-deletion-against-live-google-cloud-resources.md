---
title: Config Connector leader election across clusters can run a stale deletion against live Google Cloud resources
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-g1-other-tool-pitfalls
    hash: a942f0ae1b1b
    ingested: 2026-11-26
aliases: []
tags: [config-connector, leader-election, multi-cluster, deletion, gitops, pitfall]
---

# Config Connector leader election across clusters can run a stale deletion against live Google Cloud resources

## Observation

Config Connector issue 16444 (2026-11-25, reporter acpana) describes a multi-cluster setup with leader election. Deleting objects on a standby cluster that previously led leaves them in Terminating, because the standby does not process them. When that cluster becomes leader again, it executes the stale deletion against GCP. The issue states that the GitOps sequence of delete, re-create, and failover ends in "silently deleting live resources", with no error raised. The issue was open on 2026-11-26. [[sources/research-gap-g1-other-tool-pitfalls]] URL: https://github.com/GoogleCloudPlatform/k8s-config-connector/issues/16444

## Mechanism

The Kubernetes object stays in Terminating with its finalizer until a controller acts on it. If the only controller that will act is paused by leader election, the pending delete is a stored intention that fires later, possibly after the same GCP resource was re-created by another cluster under the same name. The default KCC behavior is to delete the cloud resource when the object is deleted, so the stale delete reaches real infrastructure. See [[concepts/finalizers]] and [[entities/config-connector]].

## Evidence limits

This is one reporter's account of a scenario, filed the day before the dossier read it, with no maintainer response. The version at which it applies was not stated in the dossier beyond KCC v1.162.0 being the latest release (2026-11-23). The mitigation implied by the existing wiki pages is `deletion-policy: abandon` before deleting on a standby, but the sibling issue [[findings/config-connector-direct-controller-resources-stick-in-terminating-when-a-parent-is-deleted-first-and-abandon-does-not-release-them]] says abandon does not always release objects.

## Related

[[examples/config-connector-issue-16444-a-gitops-delete-recreate-failover-sequence-deleted-live-gcp-resources-on-a-former-leader-cluster]], [[findings/destructive-deletion-of-external-resources]], [[decisions/single-replica-versus-leader-election]]

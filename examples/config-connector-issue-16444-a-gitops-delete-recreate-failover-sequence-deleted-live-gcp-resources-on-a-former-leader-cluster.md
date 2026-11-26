---
title: Config Connector issue 16444 a GitOps delete, re-create, failover sequence deleted live GCP resources on a former leader cluster
type: example
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-g1-other-tool-pitfalls
    hash: a942f0ae1b1b
    ingested: 2026-11-26
aliases: [Config Connector issue 16444]
tags: [config-connector, leader-election, multi-cluster, gitops, deletion]
---

# Config Connector issue 16444 a GitOps delete, re-create, failover sequence deleted live GCP resources on a former leader cluster

## Scenario

On 2026-11-25 acpana opened issue 16444 on the Config Connector repository. The setup is multiple clusters running Config Connector with leader election, with GitOps delivering the objects. [[sources/research-gap-g1-other-tool-pitfalls]] URL: https://github.com/GoogleCloudPlatform/k8s-config-connector/issues/16444

## The sequence

1. Objects are deleted on a standby cluster that previously led, and they stay Terminating because that controller is not leading.
2. The same resources are re-created elsewhere.
3. Failover returns leadership to the first cluster, which runs the stale deletion against GCP and deletes the live resources.

The issue's phrase is "silently deleting live resources", with no error reported.

## Status and limits

An open report one day old when read, filed by one reporter and not reproduced by the dossier, with no maintainer response. See [[findings/config-connector-leader-election-across-clusters-can-run-a-stale-deletion-against-live-google-cloud-resources]].

## Related

[[entities/config-connector]], [[findings/destructive-deletion-of-external-resources]]

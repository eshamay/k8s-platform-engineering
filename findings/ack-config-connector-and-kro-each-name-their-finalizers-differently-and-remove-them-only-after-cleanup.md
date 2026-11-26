---
title: "ACK, Config Connector, and kro each name their finalizers differently and remove them only after cleanup"
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-m1-finalizers
    hash: 014549e333b6
    ingested: 2026-11-26
aliases: []
tags: [finalizers, ack, config-connector, kro, deletion, naming]
---

# ACK, Config Connector, and kro each name their finalizers differently and remove them only after cleanup

## Observation

Source on each project's default branch, read on 2026-11-26, shows three different naming schemes. None of the three projects' documentation pages explain this, so the names come from code. [[sources/research-gap-m1-finalizers]]

| Tool | Finalizer name | When it is removed |
|---|---|---|
| [[entities/ack]] | `finalizers.<apiGroup>/<Kind>`, rendered per generated controller | After the AWS resource is cleaned up. Asynchronous deletes return a requeue so the finalizer stays until the deletion completes. |
| [[entities/config-connector]] | `cnrm.cloud.google.com/finalizer`, plus `cnrm.cloud.google.com/deletion-defender` | The controller finalizer is removed in the lifecycle handler's deleted path after the Deleted condition and status are recorded. |
| [[entities/kro]] | `kro.run/finalizer` on instances, ResourceGraphDefinitions, and GraphRevisions, and `kro.run/graph-finalizer` on Graph objects | Only when no deletion candidates remain, using a merge patch with retry on conflict. |

For ACK, the code generator template defines the string, `MarkManaged` adds it, and `MarkUnmanaged` removes it. The runtime reconciler adds it when a resource is first reconciled, and on delete it removes the AWS resource first and only then marks the resource unmanaged, with a comment that this allows the API server to delete the custom resource. The literal string for a specific service controller was not read, only the template form. [[sources/research-gap-m1-finalizers]]

For kro, the deletion path rebuilds the inventory from ApplySet metadata, releases resources whose deletion policy is orphan when the `DeletionPolicy` feature gate is on, deletes the highest remaining apply-order wave, and requeues. A code comment says it uses a merge patch and not server-side apply for finalizer removal "to avoid field manager ownership blocking finalizer removal". [[sources/research-gap-m1-finalizers]]

## Why it matters

The names are what an operator greps for on a stuck object, and the removal points show what a stuck finalizer is waiting on. In all three tools the finalizer outlives the cloud or child cleanup, so a stuck object means cleanup has not completed or the controller is not running. See [[findings/finalizers-strand-objects-in-terminating-when-the-controller-is-missing-or-failing]] and [[findings/config-connector-direct-controller-resources-stick-in-terminating-when-a-parent-is-deleted-first-and-abandon-does-not-release-them]].

## Evidence limits

Config Connector's second finalizer is covered in [[findings/config-connector-has-a-second-deletion-defender-finalizer-and-removes-both-finalizers-with-an-abandon-setting-when-its-crd-is-uninstalled]]. The Config Connector direct controllers under `pkg/controller/direct` were not read individually.

## Related

[[concepts/finalizers]], [[comparisons/finalizer-gated-teardown-across-argo-cd-flux-kro-and-cluster-api]], [[examples/kro-deletes-instance-resources-in-reverse-dependency-waves]]

---
title: "A Flux WaitForTermination deletion policy gives up at spec.timeout and lets the Kustomization be deleted while a provider resource may still be finalizing"
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-o4-config-connector-ack
    hash: c0d708f1d445
    ingested: 2026-11-26
aliases: []
tags: [flux, deletion-policy, waitfortermination, finalizer, provider-managed, timeout]
---

# A Flux WaitForTermination deletion policy gives up at spec.timeout and lets the Kustomization be deleted while a provider resource may still be finalizing

## Observation

The kustomize-controller reference (`main`, read 2026-11-26, latest release v1.10.2 on 2026-11-20) says garbage collection "is also performed when a Kustomization object is deleted", and `deletionPolicy` accepts `MirrorPrune` (default, deleting managed resources if `prune` is true and orphaning them if false), `Delete`, `WaitForTermination`, and `Orphan`. For `WaitForTermination` the controller waits for the deleted objects to terminate, bounded by `.spec.timeout`; after the timeout it will "log an error and will allow the Kustomization to be deleted". [[sources/research-gap-o4-config-connector-ack]]

The policy list itself is in [[examples/flux-kustomization-deletion-policy-chooses-between-mirror-prune-delete-wait-and-orphan]]. The timeout behavior is the new detail.

## Why it matters for provider-managed resources

Objects owned by Config Connector or ACK carry finalizers, and the controller deletes the cloud resource before releasing the object, see [[examples/crossplane-ack-and-config-connector-delete-the-cloud-resource-before-the-kubernetes-object]]. If that cloud delete takes longer than `.spec.timeout`, the Kustomization disappears while the cloud resource is still being deleted, so Flux no longer shows the failure as its own status. This is an inference from the documented timeout and the documented provider finalizer order, and the dossier did not observe it happening.

Other documented Flux limits from the same page that matter for provider objects: `ssa: Merge` cannot preserve changes to atomic list fields ("any changes to these fields will be reverted"), `force` on a StatefulSet "may result in potential data loss", and drift detection runs a server-side apply dry-run, so null or empty fields can cause repeated "configured" events.

## Related

[[entities/flux]], [[comparisons/deletion-policies-across-gitops-and-provider-tools]], [[findings/unintended-deletion-through-prune]]

---
title: "Flux Kustomization uses finalizers.fluxcd.io and removes it even when WaitForTermination times out"
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-m1-finalizers
    hash: 014549e333b6
    ingested: 2026-11-26
aliases: []
tags: [flux, finalizers, deletion, deletion-policy, kustomize-controller]
---

# Flux Kustomization uses finalizers.fluxcd.io and removes it even when WaitForTermination times out

## Observation

The kustomize-controller API types define the Kustomization finalizer as `finalizers.fluxcd.io`. The reconciler adds it before any other work, and a code comment explains that this avoids a race, because a finalizer can only be added while no deletionTimestamp is set. [[sources/research-gap-m1-finalizers]]

On deletion, the controller prunes the inventory only if its decision function says so. A suspended Kustomization or one with an empty inventory never deletes anything. For `MirrorPrune`, the default, the answer follows `spec.prune`. For `Delete` and `WaitForTermination` the answer is always yes, and for `Orphan` it is always no. [[sources/research-gap-m1-finalizers]]

## WaitForTermination does not hold the Kustomization indefinitely

With `WaitForTermination`, the controller waits for the deleted objects to terminate, polling every 2 seconds up to the Kustomization's own timeout, which is `.spec.timeout`. If the wait fails, the controller logs an error and emits an event, and the finalizer is still removed. If the impersonated service account no longer exists, the controller logs the stale objects and also continues to remove the finalizer. The wait covers the children's own finalizers through the garbage collector, but a timeout does not block the Kustomization from being deleted. [[sources/research-gap-m1-finalizers]]

This corrects a reading in earlier pages that Flux's own finalizer waits on every finalizer its children carry without limit. The wait is bounded by the timeout, and children that are still terminating afterward are left to their own finalizers.

## Evidence limits

Only the v1 API type and the controller on the main branch were read, on 2026-11-26. How the older beta API versions behaved was not read. Flux deletes by inventory entries recorded in status and does not use owner references in the code that was read. [[sources/research-gap-m1-finalizers]]

## Related

[[entities/flux]], [[examples/flux-kustomization-deletion-policy-chooses-between-mirror-prune-delete-wait-and-orphan]], [[comparisons/finalizer-gated-teardown-across-argo-cd-flux-kro-and-cluster-api]], [[concepts/finalizers]]

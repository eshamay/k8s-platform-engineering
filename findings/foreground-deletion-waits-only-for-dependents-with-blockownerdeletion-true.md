---
title: "Foreground deletion waits only for dependents with blockOwnerDeletion true"
type: finding
status: active
created: 2026-11-25
updated: 2026-11-26
sources:
  - id: research-gap-m2-ownership-gc
    hash: 62aafaded9c0
    ingested: 2026-11-26
  - id: research-finalizers
    hash: ca11dffc241b
    ingested: 2026-11-25
  - id: research-owner-references-and-garbage-collection
    hash: bd4cc1219f2d
    ingested: 2026-11-25
aliases: []
tags: [pitfall, garbage-collection, finalizers, owner-references]
---

# Foreground deletion waits only for dependents with blockOwnerDeletion true

## Observation

The Kubernetes garbage collection page defines three propagation modes. In background mode, the default, the API server deletes the owner immediately and the garbage collector removes dependents later. In foreground mode the owner gets `deletionTimestamp` and the `foregroundDeletion` finalizer, and the finalizer is removed only after dependents with `blockOwnerDeletion=true` are gone. In orphan mode the `orphan` finalizer leaves the dependents behind. [[sources/research-finalizers]]

## Consequence

A parent can be stuck waiting on children, and a dependent without `blockOwnerDeletion=true` does not hold the parent at all. Someone who expects foreground deletion to guarantee that every child has left will be wrong for those dependents. Owner references also cannot cross namespaces. See [[concepts/owner-references-and-garbage-collection]].

## Related

[[concepts/finalizers]], [[comparisons/finalizer-gated-teardown-across-argo-cd-flux-kro-and-cluster-api]], [[findings/finalizers-strand-objects-in-terminating-when-the-controller-is-missing-or-failing]]

## Additional evidence

The owner-reference dossier confirms the same rule and adds that setting `blockOwnerDeletion` is guarded by an admission check on delete permission, with an unverified claim of silent dropping. [[sources/research-owner-references-and-garbage-collection]] Correction 2026-11-26: the plugin source requires `update` on the owner's `finalizers` subresource and rejects the write with Forbidden, and the plugin is off by default upstream. [[sources/research-gap-m2-ownership-gc]] See [[findings/blockownerdeletion-needs-permission-on-the-owner-and-the-failure-mode-is-disputed]] and [[comparisons/background-foreground-and-orphan-propagation-modes]].

---
title: Owner References and Garbage Collection
type: concept
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: krm-platform-vocabulary
    hash: 731a6941f9db
    ingested: 2026-11-25
  - id: research-finalizers
    hash: ca11dffc241b
    ingested: 2026-11-25
aliases: [ownerReferences]
tags: [controllers]
---

# Owner References and Garbage Collection

## Definition

Linking child KRM objects to a parent through `metadata.ownerReferences`, so that deleting the parent cascades deletion to all generated children. [[sources/krm-platform-vocabulary]]

## Why it matters

Ownership is how a [[concepts/composite-resource]] cleans up its [[concepts/managed-resource|managed resources]], and how many controllers track what they created. It interacts with [[concepts/finalizers]]: garbage collection removes the Kubernetes objects, while finalizers ensure external cleanup happens first.

## Related

[[concepts/reconciliation-loop]], [[concepts/composition]], [[entities/kro]]

## To research

Foreground versus background deletion, cross-namespace ownership limits, and orphan policies.

## Propagation modes and finalizers

The Kubernetes garbage collection page defines three propagation modes. Background, the default, deletes the owner immediately and lets the garbage collector remove dependents later. Foreground sets `deletionTimestamp` and the `foregroundDeletion` finalizer on the owner and removes it only after dependents with `blockOwnerDeletion=true` are gone. Orphan uses the `orphan` finalizer to leave dependents behind. Owner references cannot cross namespaces, and `kubectl delete --cascade` selects the mode. [[sources/research-finalizers]] See [[concepts/finalizers]] and [[findings/foreground-deletion-waits-only-for-dependents-with-blockownerdeletion-true]].

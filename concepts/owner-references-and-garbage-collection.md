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

---
title: A level-based loop deletes what it no longer sees in desired state
type: finding
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-reconciliation-loop
    hash: df7d66206baf
    ingested: 2026-11-25
aliases: [Unsafe deletes in reconciliation]
tags: [prune, deletion, gitops, reconciliation]
---

# A level-based loop deletes what it no longer sees in desired state

## Observation

A reconciler that compares full desired state with observed state treats anything observed but not desired as surplus. When it also has permission to prune, an accidental omission from the source becomes a deletion. The dossier notes that each major tool adds a guard for this reason. [sources/research-reconciliation-loop](../sources/research-reconciliation-loop.md)

## Guards by tool

Argo CD has prune off by default in automated sync. Flux supports per-object prune opt-out annotations. Crossplane offers an `Orphan` deletion policy that leaves the external resource in place when the object is removed. The dossier presents these as consequences of the level-based design, not as unrelated features. [sources/research-reconciliation-loop](../sources/research-reconciliation-loop.md)

## Why it matters

The same property that makes the loop self-healing makes it unforgiving about an incomplete source of truth. Teams should decide deliberately which objects may be pruned. See [findings/unintended-deletion-through-prune](unintended-deletion-through-prune.md), [comparisons/deletion-policies-across-gitops-and-provider-tools](../comparisons/deletion-policies-across-gitops-and-provider-tools.md), and [findings/destructive-deletion-of-external-resources](destructive-deletion-of-external-resources.md).

## Related

[concepts/reconciliation-loop](../concepts/reconciliation-loop.md), [entities/argo-cd](../entities/argo-cd.md), [entities/flux](../entities/flux.md), [entities/crossplane](../entities/crossplane.md)

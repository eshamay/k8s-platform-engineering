---
title: "Background, foreground, and orphan propagation modes"
type: comparison
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-owner-references-and-garbage-collection
    hash: bd4cc1219f2d
    ingested: 2026-11-25
aliases: []
tags: [propagation-policy, cascade, deletion, owner-references]
---

# Background, foreground, and orphan propagation modes

The mode is chosen by `propagationPolicy` on the delete call or by `kubectl delete --cascade=background|foreground|orphan`. [[sources/research-owner-references-and-garbage-collection]]

| Mode | What happens to the owner | What happens to dependents | Main hazard |
|---|---|---|---|
| Background (default) | Deleted immediately by the API server | The garbage collector removes them afterward, in no guaranteed order | No ordering between dependents |
| Foreground | Gets `deletionTimestamp` and the `foregroundDeletion` finalizer and stays visible | Dependents with `blockOwnerDeletion=true` must be gone before the owner is removed | Owner can hang if a blocking dependent cannot be deleted |
| Orphan | The `orphan` finalizer strips owner references from dependents, then the owner goes | Survive with empty `ownerReferences` | Unmanaged objects need manual cleanup |

## Reading the table

Background suits most deletes because it returns quickly. Foreground is the only mode with a wait, and it only waits for dependents that set `blockOwnerDeletion=true`. Orphan is the choice for migrations. The dossier warns that two summaries, the finalizers blog and the design proposal, label these modes differently from the current documentation, which names background as the default. Client libraries may also default differently from kubectl. See [[findings/background-deletion-gives-no-teardown-ordering-between-dependents]], [[findings/foreground-deletion-waits-only-for-dependents-with-blockownerdeletion-true]], [[findings/orphaned-dependents-keep-running-with-empty-owner-references-until-someone-deletes-them]], and [[findings/api-client-default-propagation-policy-can-differ-from-kubectl-and-orphan-dependents]].

## Related

[[concepts/owner-references-and-garbage-collection]], [[examples/kubectl-cascade-modes-compared-in-a-hands-on-lab]], [[comparisons/deletion-policies-across-gitops-and-provider-tools]]

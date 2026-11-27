---
title: "Background, foreground, and orphan propagation modes"
type: comparison
status: active
created: 2026-11-25
updated: 2026-11-26
sources:
  - id: kubernetes-finalizers-blog
    hash: 31da0061e2fb
    ingested: 2026-11-26
  - id: research-gap-m2-ownership-gc
    hash: 62aafaded9c0
    ingested: 2026-11-26
  - id: research-owner-references-and-garbage-collection
    hash: bd4cc1219f2d
    ingested: 2026-11-25
aliases: []
tags: [propagation-policy, cascade, deletion, owner-references]
---

# Background, foreground, and orphan propagation modes

The mode is chosen by `propagationPolicy` on the delete call or by `kubectl delete --cascade=background|foreground|orphan`. [sources/research-owner-references-and-garbage-collection](../sources/research-owner-references-and-garbage-collection.md)

| Mode | What happens to the owner | What happens to dependents | Main hazard |
|---|---|---|---|
| Background (default) | Deleted immediately by the API server | The garbage collector removes them afterward, in no guaranteed order | No ordering between dependents |
| Foreground | Gets `deletionTimestamp` and the `foregroundDeletion` finalizer and stays visible | Dependents with `blockOwnerDeletion=true` must be gone before the owner is removed | Owner can hang if a blocking dependent cannot be deleted |
| Orphan | The `orphan` finalizer strips owner references from dependents, then the owner goes | Survive with empty `ownerReferences` | Unmanaged objects need manual cleanup |

## Reading the table

Background suits most deletes because it returns quickly. Foreground is the only mode with a wait, and it only waits for dependents that set `blockOwnerDeletion=true`. Orphan is the choice for migrations. The dossier warns that two summaries, the finalizers blog and the design proposal, label these modes differently from the current documentation, which names background as the default. Client libraries may also default differently from kubectl. See [findings/background-deletion-gives-no-teardown-ordering-between-dependents](../findings/background-deletion-gives-no-teardown-ordering-between-dependents.md), [findings/foreground-deletion-waits-only-for-dependents-with-blockownerdeletion-true](../findings/foreground-deletion-waits-only-for-dependents-with-blockownerdeletion-true.md), [findings/orphaned-dependents-keep-running-with-empty-owner-references-until-someone-deletes-them](../findings/orphaned-dependents-keep-running-with-empty-owner-references-until-someone-deletes-them.md), and [findings/api-client-default-propagation-policy-can-differ-from-kubectl-and-orphan-dependents](../findings/api-client-default-propagation-policy-can-differ-from-kubectl-and-orphan-dependents.md).

## Related

[concepts/owner-references-and-garbage-collection](../concepts/owner-references-and-garbage-collection.md), [examples/kubectl-cascade-modes-compared-in-a-hands-on-lab](../examples/kubectl-cascade-modes-compared-in-a-hands-on-lab.md), [comparisons/deletion-policies-across-gitops-and-provider-tools](deletion-policies-across-gitops-and-provider-tools.md)

## Tool defaults and the old design archive

Argo CD prunes with foreground deletion by default and accepts `PrunePropagationPolicy` values of background, foreground, and orphan. Namespace deletion uses background propagation, according to KEP-5080. The archived garbage collection design says `OrphanDependents` defaulted to true because pre-1.2 controllers expected orphaning, which is outdated against current documentation. [sources/research-gap-m2-ownership-gc](../sources/research-gap-m2-ownership-gc.md) See [findings/argo-cd-tracks-resources-by-annotation-by-default-and-label-mode-truncates-and-collides-with-other-tools](../findings/argo-cd-tracks-resources-by-annotation-by-default-and-label-mode-truncates-and-collides-with-other-tools.md) and [findings/no-kep-covers-cross-namespace-ownership-or-garbage-collector-performance-and-the-nearest-proposals-are-5080-and-2336](../findings/no-kep-covers-cross-namespace-ownership-or-garbage-collector-performance-and-the-nearest-proposals-are-5080-and-2336.md).

## Check against the finalizers blog

Correction note: the paragraph above says two summaries, the finalizers blog and the design proposal, labeled the modes differently from current documentation. The blog is now read in full, and its labels agree with the documentation: Foreground deletes children first, Background deletes the parent first, and Orphan ignores owner references, with background as the kubectl default from v1.20. The mismatch came from the earlier summary and not from the post. The design proposal was not re-read in this pass. The post's statement that kubectl cannot set the policy is dated, see [findings/the-2021-kubernetes-finalizers-blog-says-kubectl-cannot-set-the-propagation-policy-while-its-own-example-uses-cascade-orphan](../findings/the-2021-kubernetes-finalizers-blog-says-kubectl-cannot-set-the-propagation-policy-while-its-own-example-uses-cascade-orphan.md). [sources/kubernetes-finalizers-blog](../sources/kubernetes-finalizers-blog.md)

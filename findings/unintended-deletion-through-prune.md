---
title: Unintended deletion through prune
type: finding
status: active
created: 2026-11-25
updated: 2026-11-26
sources:
  - id: research-declarative-vs-imperative
    hash: 570767ba4094
    ingested: 2026-11-25
  - id: research-gitops-pull-based-delivery
    hash: 335ba8f50b2b
    ingested: 2026-11-25
  - id: research-finalizers
    hash: ca11dffc241b
    ingested: 2026-11-25
  - id: research-gap-g1-gitops-drift-incidents
    hash: 0a1a75f3cab5
    ingested: 2026-11-26
  - id: research-gap-g1-other-tool-pitfalls
    hash: a942f0ae1b1b
    ingested: 2026-11-26
aliases: []
tags: [pitfall, prune, deletion, gitops]
---

# Unintended deletion through prune

## Observation

Pruning removes objects that are no longer in the desired configuration, and the boundary of "the desired configuration" is easy to misjudge. The kubectl declarative tutorial warns that `kubectl apply --prune` can delete objects that were created outside the config workflow, and it recommends explicit `kubectl delete -f` instead. [[sources/research-declarative-vs-imperative]]

## How tools respond

[[entities/argo-cd]] defaults to no prune and no self-heal, and adds an allow-empty protection so an empty source does not prune everything. [[entities/flux]] prunes when `prune` is enabled, offers a per-object disable annotation, and has a deletion policy with MirrorPrune, Delete, WaitForTermination, and Orphan. See [[comparisons/flux-versus-argo-cd-drift-and-prune-defaults]].

## Mitigations

Run `kubectl diff` before applying, keep prune off until the source of truth is trusted, annotate objects that must never be pruned, and choose an orphan or retain policy for critical resources.

## Caveat

The dossier found no incident write-ups of an accidental prune, so the severity is inferred from documentation warnings. See [[open-knowledge-gaps]].

## Related

[[findings/destructive-deletion-of-external-resources]], [[entities/kubectl]]

## GitOps agent defaults

Argo CD's automated sync does not delete resources that are removed from Git unless prune is enabled, as a stated safety mechanism, and allow-empty is a separate guard against pruning an application to zero resources. The Flux Kustomize controller garbage-collects objects removed from the source when pruning is enabled. The dossier covers no per-resource deletion policy for cloud resources. [[sources/research-gitops-pull-based-delivery]] See [[concepts/gitops-pull-based-delivery]].

## Deletion of the GitOps object itself

The finalizers dossier shows that the GitOps object can cascade as well. Argo CD's resources finalizer deletes an Application's workloads when the Application is removed, and Flux's `deletionPolicy` and `prune: disabled` annotation serve the same purpose. [[sources/research-finalizers]] See [[comparisons/finalizer-gated-teardown-across-argo-cd-flux-kro-and-cluster-api]] and [[concepts/finalizers]].

## Update from the GitOps incidents dossier

Correction, 2026-11-26: the Caveat above said no incident write-ups of an accidental prune were found. The 2026-11-26 dossier found reporter accounts, though no named-organization postmortem. Argo CD issue 15441 (2023) reports a namespace deleted and recreated when its explicit manifest was removed under `CreateNamespace=true`, ACK issue 2911 (2026) reports an Argo CD prune leaving a WebACL CR stuck on its finalizer, and issues 6046 and 20440 report cascades from deleting or recreating the parent. See [[findings/deleting-or-recreating-an-argo-cd-parent-can-cascade-to-everything-it-managed]], [[findings/pruning-a-custom-resource-whose-controller-does-not-map-a-not-found-error-leaves-it-terminating-on-its-finalizer]], and [[sources/research-gap-g1-gitops-drift-incidents]].

## ACK prune reports from the other-tool pitfalls dossier

ACK issues 3153 and 3154 (2026-11-09, open) say pruning an ACK CR from git deletes the AWS resource and cannot be undone, and that the namespace retain annotation is ignored in single `--watch-namespace` installs. See [[findings/pruning-an-ack-custom-resource-deletes-the-aws-resource-and-the-namespace-retain-annotation-is-ignored-in-single-namespace-installs]]. [[sources/research-gap-g1-other-tool-pitfalls]]

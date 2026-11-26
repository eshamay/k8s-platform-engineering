---
title: "Finalizer-gated teardown across Argo CD, Flux, kro, and Cluster API"
type: comparison
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-finalizers
    hash: ca11dffc241b
    ingested: 2026-11-25
aliases: []
tags: [finalizers, deletion, argo-cd, flux, kro, cluster-api]
---

# Finalizer-gated teardown across Argo CD, Flux, kro, and Cluster API

The four tools each decide what happens to children when a parent object is deleted, and each uses a finalizer or a finalizer-like gate to hold the parent until the decision is carried out. [[sources/research-finalizers]]

| Tool | What gates deletion | Default behavior | Opt-out or control |
|---|---|---|---|
| [[entities/argo-cd]] | `resources-finalizer.argocd.argoproj.io` on an Application | Deleting the Application deletes its deployed resources | `syncPolicy.preserveResourcesOnDeletion` stops the finalizer being added for ApplicationSet-generated Applications |
| [[entities/flux]] | Kustomization garbage collection at deletion | MirrorPrune follows the `prune` setting | `deletionPolicy` of Delete, WaitForTermination, or Orphan, and the per-object `prune: disabled` annotation |
| [[entities/kro]] | Instance finalizer held until all managed resources are gone | Reverse-dependency waves from an ApplySet inventory | The documented fix for a stuck instance is to clear finalizers on children in the active wave |
| [[entities/cluster-api]] | `deletionTimestamp` on a Machine plus annotation hooks | Drain, detach volumes, pre-terminate hooks, delete infrastructure, then the node | `exclude-node-draining` and `nodeDrainTimeout` |

## Reading the comparison

Argo CD and Flux choose between cascading and orphaning, so the control is a policy flag. kro and Cluster API choose an order, so the control is about what blocks progress. WaitForTermination in Flux links the two, because it makes Flux wait for the finalizers of its children. The Kubernetes foreground mode only waits for dependents with `blockOwnerDeletion=true`. See [[findings/foreground-deletion-waits-only-for-dependents-with-blockownerdeletion-true]].

The provider tools, Crossplane, ACK, and Config Connector, are compared on the separate axis of deleting or retaining the external resource in [[comparisons/deletion-policies-across-gitops-and-provider-tools]]. The dossier did not confirm Flux's own finalizer name or Argo CD's foreground and background variants.

## Related

[[concepts/finalizers]], [[examples/argo-cd-resources-finalizer-cascades-an-application-delete-to-its-workloads]], [[examples/kro-deletes-instance-resources-in-reverse-dependency-waves]]

---
title: "Finalizer-gated teardown across Argo CD, Flux, kro, and Cluster API"
type: comparison
status: active
created: 2026-11-25
updated: 2026-11-26
sources:
  - id: research-gap-m1-finalizers
    hash: 014549e333b6
    ingested: 2026-11-26
  - id: research-finalizers
    hash: ca11dffc241b
    ingested: 2026-11-25
aliases: []
tags: [finalizers, deletion, argo-cd, flux, kro, cluster-api]
---

# Finalizer-gated teardown across Argo CD, Flux, kro, and Cluster API

The four tools each decide what happens to children when a parent object is deleted, and each uses a finalizer or a finalizer-like gate to hold the parent until the decision is carried out. [sources/research-finalizers](../sources/research-finalizers.md)

| Tool | What gates deletion | Default behavior | Opt-out or control |
|---|---|---|---|
| [entities/argo-cd](../entities/argo-cd.md) | `resources-finalizer.argocd.argoproj.io` on an Application, with `/foreground` and `/background` spellings | Deleting the Application deletes its deployed resources | `syncPolicy.preserveResourcesOnDeletion` stops the finalizer being added for ApplicationSet-generated Applications |
| [entities/flux](../entities/flux.md) | `finalizers.fluxcd.io` on a Kustomization, with garbage collection at deletion | MirrorPrune follows the `prune` setting | `deletionPolicy` of Delete, WaitForTermination, or Orphan, and the per-object `prune: disabled` annotation |
| [entities/kro](../entities/kro.md) | `kro.run/finalizer` held until all managed resources are gone | Reverse-dependency waves from an ApplySet inventory | The documented fix for a stuck instance is to clear finalizers on children in the active wave |
| [entities/cluster-api](../entities/cluster-api.md) | `deletionTimestamp` on a Machine plus annotation hooks, not finalizers | Drain, detach volumes, pre-terminate hooks, delete infrastructure, then the node | `exclude-node-draining` and `nodeDrainTimeout` |

## Reading the comparison

Argo CD and Flux choose between cascading and orphaning, so the control is a policy flag. kro and Cluster API choose an order, so the control is about what blocks progress. WaitForTermination in Flux links the two, because it makes Flux wait for the children to terminate, bounded by the Kustomization timeout. After a timeout Flux logs an error and removes its finalizer anyway (correction recorded 2026-11-26). The Kubernetes foreground mode only waits for dependents with `blockOwnerDeletion=true`. See [findings/foreground-deletion-waits-only-for-dependents-with-blockownerdeletion-true](../findings/foreground-deletion-waits-only-for-dependents-with-blockownerdeletion-true.md).

The provider tools, Crossplane, ACK, and Config Connector, are compared on the separate axis of deleting or retaining the external resource in [comparisons/deletion-policies-across-gitops-and-provider-tools](deletion-policies-across-gitops-and-provider-tools.md). The finalizer names are now confirmed from source: Argo CD has three cascade spellings, Flux uses `finalizers.fluxcd.io`, ACK uses `finalizers.<apiGroup>/<Kind>`, Config Connector uses `cnrm.cloud.google.com/finalizer` and `cnrm.cloud.google.com/deletion-defender`, and kro uses `kro.run/finalizer`. Cluster API chose annotation hooks and not finalizers. See [findings/argo-cd-applications-use-three-cascade-finalizer-names-and-a-non-cascading-delete-removes-the-finalizer](../findings/argo-cd-applications-use-three-cascade-finalizer-names-and-a-non-cascading-delete-removes-the-finalizer.md), [findings/flux-kustomization-uses-finalizers-fluxcd-io-and-removes-it-even-when-waitfortermination-times-out](../findings/flux-kustomization-uses-finalizers-fluxcd-io-and-removes-it-even-when-waitfortermination-times-out.md), [findings/ack-config-connector-and-kro-each-name-their-finalizers-differently-and-remove-them-only-after-cleanup](../findings/ack-config-connector-and-kro-each-name-their-finalizers-differently-and-remove-them-only-after-cleanup.md), and [findings/cluster-api-chose-annotation-hooks-over-finalizers-for-machine-deletion-because-a-misbehaving-controller-could-remove-finalizers](../findings/cluster-api-chose-annotation-hooks-over-finalizers-for-machine-deletion-because-a-misbehaving-controller-could-remove-finalizers.md). [sources/research-gap-m1-finalizers](../sources/research-gap-m1-finalizers.md)

## Related

[concepts/finalizers](../concepts/finalizers.md), [examples/argo-cd-resources-finalizer-cascades-an-application-delete-to-its-workloads](../examples/argo-cd-resources-finalizer-cascades-an-application-delete-to-its-workloads.md), [examples/kro-deletes-instance-resources-in-reverse-dependency-waves](../examples/kro-deletes-instance-resources-in-reverse-dependency-waves.md)

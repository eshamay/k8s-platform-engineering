---
title: "How tools garbage collect: owner references, inventory, and finalizers"
type: comparison
status: active
created: 2026-11-25
updated: 2026-11-26
sources:
  - id: research-gap-m2-ownership-gc
    hash: 62aafaded9c0
    ingested: 2026-11-26
  - id: research-owner-references-and-garbage-collection
    hash: bd4cc1219f2d
    ingested: 2026-11-25
aliases: []
tags: [garbage-collection, cluster-api, crossplane, flux, argo-cd, config-connector]
---

# How tools garbage collect: owner references, inventory, and finalizers

| Tool | Cleanup mechanism | Deletion knobs | Not covered |
|---|---|---|---|
| Built-in controllers | Owner references and the garbage collector | `propagationPolicy`, `--cascade` | none |
| [entities/cluster-api](../entities/cluster-api.md) | Owner chain Cluster, MachineDeployment, MachineSet, Machine; MachineSet adopts Machines with no controller reference | Hooks and drain settings at Machine level | Orphan propagation not found in non-test source |
| [entities/crossplane](../entities/crossplane.md) | Owner references from composed resources to the composite | Composite deletion policy: Background, Foreground, Pipeline | How `managementPolicies` interact with the cascade, namespace deletion with the provider down |
| [entities/flux](../entities/flux.md) | Inventory in `.status.inventory` with `prune` | `prune: disabled` annotation, `deletionPolicy` | Use of owner references unconfirmed |
| [entities/argo-cd](../entities/argo-cd.md) | Tracking plus `resources-finalizer.argocd.argoproj.io` on the Application | Foreground default for prune and Application delete; `PrunePropagationPolicy` background, foreground, orphan; non-cascading delete; tracking by annotation (default), annotation+label, or label | Interaction of tracking methods with owner-reference child discovery |
| [entities/config-connector](../entities/config-connector.md) | Finalizer-style controller deleting the cloud resource | `cnrm.cloud.google.com/deletion-policy: abandon` | Namespace deletion, ordering |
| [entities/kro](../entities/kro.md) | No owner references on instance children; kro labels and an ApplySet inventory; deletion in reverse dependency waves; RGD owner reference on the generated CRD and GraphRevisions | Alpha `kro.run/deletion-policy: Orphaned` (gate off by default) | KREP-004 and KREP-014 not read |
| [entities/ack](../entities/ack.md) | Not covered by this dossier | Not covered | Deletion policy |

[sources/research-owner-references-and-garbage-collection](../sources/research-owner-references-and-garbage-collection.md) [sources/research-gap-m2-ownership-gc](../sources/research-gap-m2-ownership-gc.md)

Correction 2026-11-26: the kro and Argo CD cells above replace "not covered" entries with source-read claims, see [findings/kro-sets-no-owner-references-on-instance-children-and-tracks-them-with-labels-and-an-applyset-inventory](../findings/kro-sets-no-owner-references-on-instance-children-and-tracks-them-with-labels-and-an-applyset-inventory.md) and [findings/argo-cd-tracks-resources-by-annotation-by-default-and-label-mode-truncates-and-collides-with-other-tools](../findings/argo-cd-tracks-resources-by-annotation-by-default-and-label-mode-truncates-and-collides-with-other-tools.md).

## Reading the table

The split follows what each tool must clean up. Ownership works when parent and child are Kubernetes objects in the right scope, which is why Cluster API and Crossplane use it between their own resources. A GitOps agent applies objects that it did not create through a parent object, so it needs an inventory or tracking marks and a finalizer on its own top-level object. Provider controllers reach into a cloud, which owner references cannot, so they pair a finalizer with a policy to retain or abandon. See [examples/gitops-tools-garbage-collect-through-inventory-and-finalizers-not-owner-references](../examples/gitops-tools-garbage-collect-through-inventory-and-finalizers-not-owner-references.md), [examples/cluster-api-owner-reference-chain-drives-cluster-deletion-and-clusterctl-move](../examples/cluster-api-owner-reference-chain-drives-cluster-deletion-and-clusterctl-move.md), and [examples/crossplane-foreground-and-pipeline-deletion-policies-order-composed-resource-teardown](../examples/crossplane-foreground-and-pipeline-deletion-policies-order-composed-resource-teardown.md).

## Related

[comparisons/finalizer-gated-teardown-across-argo-cd-flux-kro-and-cluster-api](finalizer-gated-teardown-across-argo-cd-flux-kro-and-cluster-api.md), [comparisons/deletion-policies-across-gitops-and-provider-tools](deletion-policies-across-gitops-and-provider-tools.md), [concepts/owner-references-and-garbage-collection](../concepts/owner-references-and-garbage-collection.md)

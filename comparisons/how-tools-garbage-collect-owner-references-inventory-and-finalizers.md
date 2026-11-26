---
title: "How tools garbage collect: owner references, inventory, and finalizers"
type: comparison
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
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
| [[entities/cluster-api]] | Owner chain Cluster, MachineDeployment, MachineSet, Machine | Hooks and drain settings at Machine level | Issue 1514 not read |
| [[entities/crossplane]] | Owner references from composed resources to the composite | Composite deletion policy: Background, Foreground, Pipeline | v2 namespaced composites, `managementPolicies` |
| [[entities/flux]] | Inventory in `.status.inventory` with `prune` | `prune: disabled` annotation, `deletionPolicy` | Use of owner references unconfirmed |
| [[entities/argo-cd]] | Tracking plus `resources-finalizer.argocd.argoproj.io` on the Application | Foreground default, background, non-cascading | `PrunePropagationPolicy`, tracking methods |
| [[entities/config-connector]] | Finalizer-style controller deleting the cloud resource | `cnrm.cloud.google.com/deletion-policy: abandon` | Namespace deletion, ordering |
| [[entities/kro]] | Not covered by this dossier | Not covered | Ownership and labels on children |
| [[entities/ack]] | Not covered by this dossier | Not covered | Deletion policy |

[[sources/research-owner-references-and-garbage-collection]]

## Reading the table

The split follows what each tool must clean up. Ownership works when parent and child are Kubernetes objects in the right scope, which is why Cluster API and Crossplane use it between their own resources. A GitOps agent applies objects that it did not create through a parent object, so it needs an inventory or tracking marks and a finalizer on its own top-level object. Provider controllers reach into a cloud, which owner references cannot, so they pair a finalizer with a policy to retain or abandon. See [[examples/gitops-tools-garbage-collect-through-inventory-and-finalizers-not-owner-references]], [[examples/cluster-api-owner-reference-chain-drives-cluster-deletion-and-clusterctl-move]], and [[examples/crossplane-foreground-and-pipeline-deletion-policies-order-composed-resource-teardown]].

## Related

[[comparisons/finalizer-gated-teardown-across-argo-cd-flux-kro-and-cluster-api]], [[comparisons/deletion-policies-across-gitops-and-provider-tools]], [[concepts/owner-references-and-garbage-collection]]

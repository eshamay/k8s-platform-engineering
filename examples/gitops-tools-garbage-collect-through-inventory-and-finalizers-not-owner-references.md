---
title: "GitOps tools garbage collect through inventory and finalizers, not owner references"
type: example
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-owner-references-and-garbage-collection
    hash: bd4cc1219f2d
    ingested: 2026-11-25
aliases: []
tags: [flux, argo-cd, config-connector, prune, inventory, deletion]
---

# GitOps tools garbage collect through inventory and finalizers, not owner references

## Scenario

A team removes a manifest from Git, or deletes a GitOps object, and wants to predict which cluster objects disappear. Kubernetes garbage collection will not answer the question, because Flux and Argo CD apply objects that they do not own through owner references. The dossier reads their deletion pages to show the separate mechanisms. [sources/research-owner-references-and-garbage-collection](../sources/research-owner-references-and-garbage-collection.md)

## How it works

Flux's Kustomization has `.spec.prune`. With it set to true, objects applied earlier but missing from the current source revision are removed, using the inventory recorded in `.status.inventory`. An object can be exempted with the annotation `kustomize.toolkit.fluxcd.io/prune: disabled`. `.spec.deletionPolicy` (`MirrorPrune` by default, `Delete`, `WaitForTermination`, `Orphan`) decides what happens to managed objects when the Kustomization itself is deleted. The dossier read about 100,000 of 121,000 characters, so it could not say whether Flux ever sets owner references.

Argo CD cascades an Application delete to its managed resources only if the Application carries the `resources-finalizer.argocd.argoproj.io` finalizer. Cascade uses foreground propagation by default, and background and non-cascading deletes are selectable. The `PrunePropagationPolicy` sync option and the tracking methods were not read.

Config Connector keeps real cloud resources on the other side of the seam. Deleting the Kubernetes object deletes the Google Cloud resource by default, and the annotation `cnrm.cloud.google.com/deletion-policy: abandon` keeps it. The controller does this through finalizer-style handling and not through owner references.

## Why the example matters

Flux's `Orphan` policy and Argo CD's non-cascading delete are the GitOps equivalents of `--cascade=orphan`. The three tools show that each layer needs its own policy. See [comparisons/how-tools-garbage-collect-owner-references-inventory-and-finalizers](../comparisons/how-tools-garbage-collect-owner-references-inventory-and-finalizers.md) and [examples/flux-kustomization-deletion-policy-chooses-between-mirror-prune-delete-wait-and-orphan](flux-kustomization-deletion-policy-chooses-between-mirror-prune-delete-wait-and-orphan.md).

## Related

[entities/flux](../entities/flux.md), [entities/argo-cd](../entities/argo-cd.md), [entities/config-connector](../entities/config-connector.md), [findings/unintended-deletion-through-prune](../findings/unintended-deletion-through-prune.md), [concepts/owner-references-and-garbage-collection](../concepts/owner-references-and-garbage-collection.md)

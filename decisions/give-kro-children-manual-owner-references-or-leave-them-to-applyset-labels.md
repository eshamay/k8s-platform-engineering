---
title: "Give kro children manual owner references or leave them to ApplySet labels"
type: decision
status: draft
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-m2-ownership-gc
    hash: 62aafaded9c0
    ingested: 2026-11-26
aliases: []
tags: [decision, kro, owner-references, applyset, argo-cd, evidence-only]
---

# Give kro children manual owner references or leave them to ApplySet labels

## Status

Open and evidence-only. The dossier read documentation and source for kro v0.10.0 and found no production report that compares the two options, so this page lists what is documented and recommends nothing. [sources/research-gap-m2-ownership-gc](../sources/research-gap-m2-ownership-gc.md)

## Context

kro sets no owner references on instance children and tracks them with labels and an ApplySet inventory. A GitOps tool that decides what it owns from ownership metadata, such as Argo CD, cannot follow kro's children by default. An RGD author must decide whether to add owner references and tracking annotations to the templates. See [findings/kro-sets-no-owner-references-on-instance-children-and-tracks-them-with-labels-and-an-applyset-inventory](../findings/kro-sets-no-owner-references-on-instance-children-and-tracks-them-with-labels-and-an-applyset-inventory.md).

## Options

- **Leave children to kro's labels and ApplySet.** kro deletes in reverse dependency waves, finds children from the persisted inventory, and works for cluster-scoped children of namespaced instances. Argo CD does not see the children as part of the Application.
- **Add owner references and the tracking-id annotation by hand.** The FAQ example uses `controller: false` and `blockOwnerDeletion: true` and copies `argocd.argoproj.io/tracking-id` from the instance, so Argo CD can attribute the children. The docs warn that resources "may be garbage collected out of order", that cross-namespace or cluster-scoped children fail validation, and that timing can conflict with kro's reconciliation.
- **Use annotation+label or label tracking in Argo CD instead.** The kro FAQ sample assumes the default annotation method and must be adapted for the other two. See [decisions/choose-an-argo-cd-resource-tracking-method-annotation-annotation-plus-label-or-label](choose-an-argo-cd-resource-tracking-method-annotation-annotation-plus-label-or-label.md).

## Evidence

Manual references reintroduce the unordered garbage collection that kro avoids, and a later `Orphaned` release does not remove them, see [findings/kro-deletion-policy-orphaned-releases-a-resource-by-stripping-kro-labels-but-leaves-template-owner-references-in-place](../findings/kro-deletion-policy-orphaned-releases-a-resource-by-stripping-kro-labels-but-leaves-template-owner-references-in-place.md). The docs describe the FAQ pattern as supported. No measurement of out-of-order deletion in practice was found. [sources/research-gap-m2-ownership-gc](../sources/research-gap-m2-ownership-gc.md)

## Related

[examples/kro-resources-need-owner-references-and-tracking-ids-to-be-tracked-by-argo-cd](../examples/kro-resources-need-owner-references-and-tracking-ids-to-be-tracked-by-argo-cd.md), [entities/kro](../entities/kro.md), [entities/argo-cd](../entities/argo-cd.md)

---
title: kro resources need owner references and tracking IDs to be tracked by Argo CD
type: example
status: active
created: 2026-11-25
updated: 2026-11-26
sources:
  - id: research-gap-m2-ownership-gc
    hash: 62aafaded9c0
    ingested: 2026-11-26
  - id: research-composite-resource
    hash: 8640896d06b9
    ingested: 2026-11-25
  - id: research-gap-o2-flux-internals
    hash: 866650ffd3aa
    ingested: 2026-11-26
aliases: []
tags: [kro, argo-cd, gitops, tracking, owner-references]
---

# kro resources need owner references and tracking IDs to be tracked by Argo CD

## Scenario

A team commits a kro instance to Git and lets Argo CD apply it. Argo CD sees only the top-level instance, while kro creates the children, so Argo CD cannot show or track the children unless they carry the right markers. [sources/research-composite-resource](../sources/research-composite-resource.md)

## How it works

The kro FAQ gives a recipe: add an `ownerReference` and an `argocd.argoproj.io/tracking-id` annotation to every templated resource, with a warning about owner reference limits. The v0.10.0 FAQ example sets `controller: false` and `blockOwnerDeletion: true` and copies the tracking annotation from the instance. The instances page warns that resources "may be garbage collected out of order", that cross-namespace or cluster-scoped children fail validation, and that timing can conflict with kro's reconciliation, and the sample assumes the default annotation tracking method. [sources/research-gap-m2-ownership-gc](../sources/research-gap-m2-ownership-gc.md) See [decisions/give-kro-children-manual-owner-references-or-leave-them-to-applyset-labels](../decisions/give-kro-children-manual-owner-references-or-leave-them-to-applyset-labels.md). With those markers Argo CD attributes the children to the Application. The same FAQ shows a Helm-style checksum trick that restarts a Deployment when a ConfigMap changes. URL: https://kro.run/docs/faq. The dossier found no Flux-specific guidance.

## Why the example matters

It shows the seam between two reconcile loops. The GitOps agent sees one object, the composition layer fans it out, and the markers are what let the outer tool follow the inner one. Crossplane has a parallel recipe, see [examples/crossplane-resources-hosted-by-argo-cd](crossplane-resources-hosted-by-argo-cd.md), and a related pitfall on deletion is in [findings/argo-cd-foreground-deletion-makes-crossplane-ignore-the-composite-deletion-policy](../findings/argo-cd-foreground-deletion-makes-crossplane-ignore-the-composite-deletion-policy.md). See [findings/two-reconcile-loops-hide-status-and-drift-at-two-layers](../findings/two-reconcile-loops-hide-status-and-drift-at-two-layers.md), [entities/argo-cd](../entities/argo-cd.md), and [entities/kro](../entities/kro.md).

## Flux comparison from the o2 dossier

The earlier note that no Flux-specific guidance was found still holds, and the o2 dossier adds Flux's side of the picture. Flux tracks what it applied through an inventory and has no documented ownerReference recipe for composites, which is an inference and not a documented fact. Health comes from kstatus or CEL. See [findings/flux-tracks-composite-resources-through-its-inventory-and-kstatus-or-cel-health-checks-and-documents-no-owner-reference-recipe-or-kro-guidance](../findings/flux-tracks-composite-resources-through-its-inventory-and-kstatus-or-cel-health-checks-and-documents-no-owner-reference-recipe-or-kro-guidance.md) and [examples/kro-issue-1290-external-controllers-fight-kro-over-fields-and-kro-resets-their-changes](kro-issue-1290-external-controllers-fight-kro-over-fields-and-kro-resets-their-changes.md). [sources/research-gap-o2-flux-internals](../sources/research-gap-o2-flux-internals.md)

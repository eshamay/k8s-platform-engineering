---
title: Flux splits GitOps into single-purpose controllers
type: example
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-operator-pattern
    hash: eab72eca2e1b
    ingested: 2026-11-25
aliases: []
tags: [use-case, flux, gitops, controllers]
---

# Flux splits GitOps into single-purpose controllers

## Scenario

Delivering cluster state from Git involves fetching sources, rendering manifests, installing Helm releases, sending notifications, and updating images. Flux assigns each concern to its own controller instead of building one large operator. [sources/research-operator-pattern](../sources/research-operator-pattern.md)

## How it works

The Flux documentation describes Flux as built from the GitOps Toolkit, "a set of specialized tools and Flux Controllers, composable APIs, reusable Go packages." The controllers are source, kustomize, helm, notification, and image automation, and each reconciles its own CRDs against Git or other sources. The dossier cites this as a clear example of one controller per concern and of GitOps built out of operators. URL: https://fluxcd.io/flux/components/.

## Related

[entities/flux](../entities/flux.md), [comparisons/how-flux-ack-and-cluster-api-split-controllers](../comparisons/how-flux-ack-and-cluster-api-split-controllers.md), [decisions/one-controller-per-kind-or-one-multi-kind-controller](../decisions/one-controller-per-kind-or-one-multi-kind-controller.md), [examples/git-driven-cluster-reconciliation-with-flux-and-argo-cd](git-driven-cluster-reconciliation-with-flux-and-argo-cd.md)

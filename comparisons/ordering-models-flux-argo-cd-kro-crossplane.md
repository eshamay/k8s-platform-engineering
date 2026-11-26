---
title: "Ordering models: Flux, Argo CD, kro, and Crossplane"
type: comparison
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-universal-control-plane
    hash: 037575049a4c
    ingested: 2026-11-25
aliases: []
tags: [ordering, dependencies, gitops, composition]
---

# Ordering models: Flux, Argo CD, kro, and Crossplane

| Tool | How ordering is expressed | Gate |
|---|---|---|
| [[entities/flux]] | `dependsOn` between Kustomization objects | Dependencies must be Ready; `healthChecks` and `wait` gate readiness |
| [[entities/argo-cd]] | Phase (PreSync, Sync, PostSync), then wave number, then kind and name | The next wave starts only when the current wave is healthy; a failure stops the sync |
| [[entities/kro]] | Derived from references between resources in the graph | Mechanics not visible in the fetched page |
| [[entities/crossplane]] | Functions see observed state each loop and can withhold dependents | Re-observation on each reconcile |

## Reading the comparison

Flux and Argo CD order objects that a pipeline or Git delivers, while kro and Crossplane order resources inside one abstraction. Flux orders between objects and Argo CD orders within a sync, so the same stack of CRDs, controllers, and custom resources is modeled differently in each. The kro row is incomplete, and it overlaps the seeded gap on Crossplane versus kro in [[open-knowledge-gaps]]. See [[findings/ordering-and-dependency-failures]] and [[sources/research-universal-control-plane]].

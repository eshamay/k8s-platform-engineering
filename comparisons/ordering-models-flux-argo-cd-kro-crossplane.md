---
title: "Ordering models: Flux, Argo CD, kro, and Crossplane"
type: comparison
status: draft
created: 2026-11-25
updated: 2026-11-26
sources:
  - id: research-universal-control-plane
    hash: 037575049a4c
    ingested: 2026-11-25
  - id: research-gap-g3-kro
    hash: e8d7c5923d98
    ingested: 2026-11-26
aliases: []
tags: [ordering, dependencies, gitops, composition]
---

# Ordering models: Flux, Argo CD, kro, and Crossplane

| Tool | How ordering is expressed | Gate |
|---|---|---|
| [[entities/flux]] | `dependsOn` between Kustomization objects | Dependencies must be Ready; `healthChecks` and `wait` gate readiness |
| [[entities/argo-cd]] | Phase (PreSync, Sync, PostSync), then wave number, then kind and name | The next wave starts only when the current wave is healthy; a failure stops the sync |
| [[entities/kro]] | Derived from references between resources in the graph: every CEL reference is an edge, creation is topological, deletion is reversed, cycles are rejected, and the order is published in `status.topologicalOrder` | Resources that reference only `schema` are created in parallel. In an RGD, dependents wait for the upstream `readyWhen`, and `includeWhen` can skip a resource and its dependents |
| [[entities/crossplane]] | Functions see observed state each loop and can withhold dependents | Re-observation on each reconcile |

## Reading the comparison

Flux and Argo CD order objects that a pipeline or Git delivers, while kro and Crossplane order resources inside one abstraction. Flux orders between objects and Argo CD orders within a sync, so the same stack of CRDs, controllers, and custom resources is modeled differently in each. The kro row is filled from the v0.10.0 documentation (correction note: it was previously marked incomplete), see [[sources/research-gap-g3-kro]] and [[entities/kro]]. In a Graph the nodes apply as soon as referenced fields exist, so ordering there comes from field availability and not from upstream `readyWhen`. See [[findings/ordering-and-dependency-failures]] and [[sources/research-universal-control-plane]].

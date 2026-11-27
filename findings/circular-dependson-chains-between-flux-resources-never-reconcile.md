---
title: Circular dependsOn chains between Flux resources never reconcile
type: finding
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-flux-deep-dive
    hash: e640ec8046bc
    ingested: 2026-11-25
aliases: []
tags: [pitfall, flux, ordering, dependson, helm]
---

# Circular dependsOn chains between Flux resources never reconcile

## Observation

The HelmRelease reference says that circular dependencies between HelmRelease resources must be avoided, because otherwise the interdependent resources are never reconciled. Each release waits for the other to become Ready, so neither starts. The Kustomization `dependsOn` field has the same shape, since a dependent is applied only after the Kustomizations it references are Ready. The dossier does not say whether Flux detects the cycle at admission or leaves it waiting. [sources/research-flux-deep-dive](../sources/research-flux-deep-dive.md)

## Why it matters

Ordering is how Flux handles CRDs and operators that must exist before the resources that use them, and the practitioner blog recommends layering infrastructure, platform, and applications with `dependsOn`. A mistaken edge in that layering produces a stall and not an error. kro rejects cycles at definition time, which is the opposite design.

## Related

[examples/flux-dependson-and-health-checks-gate-rollout](../examples/flux-dependson-and-health-checks-gate-rollout.md), [findings/ordering-and-dependency-failures](ordering-and-dependency-failures.md), [comparisons/ordering-models-flux-argo-cd-kro-crossplane](../comparisons/ordering-models-flux-argo-cd-kro-crossplane.md), [entities/flux](../entities/flux.md)

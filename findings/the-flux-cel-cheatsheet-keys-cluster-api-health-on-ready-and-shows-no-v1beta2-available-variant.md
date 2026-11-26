---
title: The Flux CEL cheatsheet keys Cluster API health on Ready and shows no v1beta2 Available variant
type: finding
status: draft
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-g3-argocd-capi
    hash: c3d485fa58ae
    ingested: 2026-11-26
aliases: []
tags: [pitfall, cluster-api, flux, kstatus, readiness, cel]
---

# The Flux CEL cheatsheet keys Cluster API health on Ready and shows no v1beta2 Available variant

## Observation

Flux's community CEL health check cheatsheet (last changed 2026-04-21) shows a `cluster.x-k8s.io/v1beta1` Cluster whose health is `status.conditions.filter(e, e.type == 'Ready')`. Kustomization and HelmRelease accept such expressions through `.spec.healthCheckExprs`. No v1beta2 variant keyed on `Available` was found. Meanwhile the Cluster API proposal "Improving status in CAPI resources" says "the `Ready` condition won't have to exist on all resources anymore", and the v1beta2 Cluster type defines `ClusterAvailableCondition` with no Cluster ready-condition constant found in a text search. [[sources/research-gap-g3-argocd-capi]] URL: https://github.com/fluxcd/website/blob/main/content/en/flux/cheatsheets/cel-healthchecks.md.

## Why it matters

A Flux user copying the cheatsheet for a v1beta2 Cluster would key on a condition the Cluster no longer carries. The practical rule the evidence supports is a per-kind CEL expression that checks `Available` for v1beta2 objects, plus the type-specific conditions for control planes and Machines, and `spec.availabilityGates` to extend what Cluster `Available` requires.

## Open question

The dossier marks as UNVERIFIED the inference that a naive kstatus-based tool would see a v1beta2 Cluster as reconciled. The pieces are verified separately: the kstatus README says a resource with no `Ready` condition is assumed "always reconciled", and the v1beta2 Cluster has no `Ready`. The combination was not tested on a live cluster, so treat it as a question and not a fact. The earlier wiki account of the closed Cluster API issue 9299 is in [[findings/premature-readiness-in-kstatus-based-tools]].

## Related

[[examples/cluster-api-adds-available-and-operation-conditions-beside-ready]], [[examples/cluster-api-readiness-gates-flux-dependents]], [[entities/kstatus]], [[entities/flux]], [[entities/cluster-api]]

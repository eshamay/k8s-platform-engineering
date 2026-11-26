---
title: Premature readiness in kstatus-based tools
type: finding
status: draft
created: 2026-11-25
updated: 2026-11-26
sources:
  - id: research-spec-status-split
    hash: 598e6132ea4f
    ingested: 2026-11-25
  - id: research-conditions
    hash: 97b224c63502
    ingested: 2026-11-25
  - id: research-gap-g3-argocd-capi
    hash: c3d485fa58ae
    ingested: 2026-11-26
aliases: []
tags: [pitfall, kstatus, cluster-api, flux, readiness]
---

# Premature readiness in kstatus-based tools

## Observation

A newly created resource with partial status can look ready to kstatus. Cluster API issue 9299 describes a resource that has `observedGeneration` set but no conditions yet, so Flux can move on to dependents too early. A proposed fix was to default `status.observedGeneration` to `-1`. The issue was reopened in April 2025 and closed "not planned" in May 2025 for three reasons: Cluster API is moving from the `Ready` condition to `Available`, defaults on status lack a clear convention basis, and Flux added CEL-based custom health checks for Cluster API. The closing comment reads, "Given the Ready condition is replaced with Available, Flux can't rely on kstatus for ClusterAPI anymore." [[sources/research-spec-status-split]] URL: https://github.com/kubernetes-sigs/cluster-api/issues/9299.

## Why it matters

Readiness gates ordering, so a false positive starts dependents against a provider that has not acted. The dossier could not extract kstatus's exact rules for combining `observedGeneration` and conditions, so the precise failure window is not documented here.

## Mitigations

Write custom health checks for kinds whose condition vocabulary differs from the convention, as Flux did with CEL for Cluster API, and have controllers set conditions as early as possible after creation. See [[examples/cluster-api-readiness-gates-flux-dependents]], [[entities/kstatus]], [[findings/misleading-readiness-and-stale-status]], and [[findings/ordering-and-dependency-failures]].

## Related

[[entities/cluster-api]], [[entities/flux]], [[concepts/conditions]]

## Additional evidence on the Cluster API race

The conditions dossier reports that the issue became moot when Cluster API changed its conditions and that Flux uses CEL health checks for Cluster API resources, and it adds the kstatus README's own corner case that a controller that has not yet written conditions is treated as reconciled. [[sources/research-conditions]] See [[findings/abnormal-true-polarity-makes-a-stopped-controller-look-healthy]].

## Update from the Cluster API v1beta2 material

The 2026-11-26 dossier verified that the v1beta2 Cluster type defines `ClusterAvailableCondition` and, by text search, no Cluster ready-condition constant, and that the kstatus README treats a resource without `Ready` as "always reconciled". Whether a naive kstatus tool therefore judges a v1beta2 Cluster reconciled is an UNVERIFIED inference that was not tested on a live cluster. Flux's CEL cheatsheet still shows a v1beta1 Cluster keyed on `Ready`. See [[findings/the-flux-cel-cheatsheet-keys-cluster-api-health-on-ready-and-shows-no-v1beta2-available-variant]] and [[sources/research-gap-g3-argocd-capi]].

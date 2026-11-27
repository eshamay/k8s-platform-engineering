---
title: Splitting a provider into a family trades fewer CRDs for more pods and memory
type: finding
status: active
created: 2026-11-25
updated: 2026-11-26
sources:
  - id: research-scale-and-sharding
    hash: d082d1d36d7e
    ingested: 2026-11-25
  - id: research-gap-g3-scale-recheck
    hash: d9bd6911bff7
    ingested: 2026-11-26
aliases: []
tags: [crossplane, provider-family, scale, tradeoff, memory]
---

# Splitting a provider into a family trades fewer CRDs for more pods and memory

## Observation

The Crossplane smaller-providers design doc lists CRD counts at the time as 872 for provider-aws, 692 for provider-azure, and 325 for provider-gcp, says problems appear around 500 CRDs, and estimates that a typical user would drop from more than 900 CRDs to about 176. The same estimate has the user running about 9 provider pods instead of 2. The doc also gives memory figures of about 600 MB for the Crossplane provider process and about 300 MB per Terraform provider process, but these are targets, not measurements: the text reads "we suspect we can get providers down to at least" those values, so earlier wording that providers "need about" them overstated the evidence. The doc's header status is Draft and it was last committed on 2023-04-25. https://github.com/crossplane/crossplane/blob/main/design/design-doc-smaller-providers.md [sources/research-scale-and-sharding](../sources/research-scale-and-sharding.md)

## Why it matters

The family design moves cost from the shared API server to the provider pods the user owns. The API server stays responsive, but a team that installs many services pays for more pods and more per-provider memory, and must upgrade more packages. The same tradeoff appears in ACK, which ships one controller per AWS service, see [comparisons/provider-families-versus-per-service-controllers](../comparisons/provider-families-versus-per-service-controllers.md). The CRD counts and the pod estimate were rechecked against the raw design doc on 2026-11-26 and match, with the survey of about 40 community members as the basis of the 176 and 9 figures. [sources/research-gap-g3-scale-recheck](../sources/research-gap-g3-scale-recheck.md)

## Related pages

[decisions/split-a-large-provider-into-families-or-filter-or-lazy-load-its-crds](../decisions/split-a-large-provider-into-families-or-filter-or-lazy-load-its-crds.md), [findings/one-crd-per-external-resource-type-overloads-api-server-discovery-and-openapi-computation](one-crd-per-external-resource-type-overloads-api-server-discovery-and-openapi-computation.md), [entities/upjet](../entities/upjet.md), [concepts/scale-and-sharding](../concepts/scale-and-sharding.md).

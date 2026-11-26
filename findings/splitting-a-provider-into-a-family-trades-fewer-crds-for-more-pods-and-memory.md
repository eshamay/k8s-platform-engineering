---
title: Splitting a provider into a family trades fewer CRDs for more pods and memory
type: finding
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-scale-and-sharding
    hash: d082d1d36d7e
    ingested: 2026-11-25
aliases: []
tags: [crossplane, provider-family, scale, tradeoff, memory]
---

# Splitting a provider into a family trades fewer CRDs for more pods and memory

## Observation

The Crossplane smaller-providers design doc lists CRD counts at the time as 872 for provider-aws, 692 for provider-azure, and 325 for provider-gcp, says problems appear around 500 CRDs, and estimates that a typical user would drop from more than 900 CRDs to about 176. The same estimate has the user running about 9 provider pods instead of 2. The doc also notes that Upjet-based providers need about 600 MB of baseline memory plus about 300 MB per Terraform provider process. https://github.com/crossplane/crossplane/blob/main/design/design-doc-smaller-providers.md [[sources/research-scale-and-sharding]]

## Why it matters

The family design moves cost from the shared API server to the provider pods the user owns. The API server stays responsive, but a team that installs many services pays for more pods and more per-provider memory, and must upgrade more packages. The same tradeoff appears in ACK, which ships one controller per AWS service, see [[comparisons/provider-families-versus-per-service-controllers]]. The figures came from a digest and need checking.

## Related pages

[[decisions/split-a-large-provider-into-families-or-filter-or-lazy-load-its-crds]], [[findings/one-crd-per-external-resource-type-overloads-api-server-discovery-and-openapi-computation]], [[entities/upjet]], [[concepts/scale-and-sharding]].

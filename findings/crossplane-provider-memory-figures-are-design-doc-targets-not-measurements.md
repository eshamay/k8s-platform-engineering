---
title: Crossplane provider memory figures are design-doc targets, not measurements
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-g3-scale-recheck
    hash: d9bd6911bff7
    ingested: 2026-11-26
aliases: []
tags: [crossplane, provider-family, memory, source-quality, scale]
---

# Crossplane provider memory figures are design-doc targets, not measurements

## Observation

The Crossplane smaller-providers design doc gives memory figures of about 600 MB for the Crossplane provider process and about 300 MB for each Terraform provider process. The sentence that introduces them reads "we suspect we can get providers down to at least: ~600MB memory for the Crossplane provider process." These are goals the authors hoped to reach, not values they measured. The document's header status is Draft, and its last commit was on 2023-04-25. https://github.com/crossplane/crossplane/blob/main/design/design-doc-smaller-providers.md [[sources/research-gap-g3-scale-recheck]]

## Why it matters

Earlier wiki text said Upjet-based providers "need about" these amounts, which read as a measured requirement. A reader sizing provider pods should treat the numbers as an order-of-magnitude target and measure their own providers. The CRD counts in the same document (provider-aws 872, provider-azure 692, provider-gcp 325, at marketplace versions v0.30.0, v0.28.0, and v0.28.0) and the survey-based estimate of about 176 CRDs and 9 pods against more than 900 CRDs and 2 pods did reproduce against the raw text. The design doc also says problems start "very approximately" above 500 CRDs, which is a rough threshold and not a tested limit.

## Related pages

[[findings/splitting-a-provider-into-a-family-trades-fewer-crds-for-more-pods-and-memory]], [[decisions/split-a-large-provider-into-families-or-filter-or-lazy-load-its-crds]], [[findings/one-crd-per-external-resource-type-overloads-api-server-discovery-and-openapi-computation]], [[concepts/scale-and-sharding]].

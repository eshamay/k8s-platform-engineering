---
title: "Crossplane v2.4 and v2.5 cut memory on clusters with hundreds to two thousand CRDs"
type: example
status: draft
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-b1-recheck-kro-crossplane
    hash: ccee0efa5bdd
    ingested: 2026-11-26
  - id: research-gap-g3-crossplane-v2
    hash: 073a1fe74dec
    ingested: 2026-11-26
aliases: []
tags: [crossplane, scale, crd-count, memory, self-reported]
---

# Crossplane v2.4 and v2.5 cut memory on clusters with hundreds to two thousand CRDs

## Scenario

Crossplane's CRD-count problem moved from the API server to Crossplane's own processes, and releases in 2026 report measured reductions. All numbers below come from the project and are self-reported, not independent benchmarks. [[sources/research-gap-g3-crossplane-v2]]

## Reported measurements

- The Crossplane v2.5.0 release notes (2026-11-24) say that after core Crossplane stopped caching all CRD OpenAPI schemas it "cut heap usage from 338 MiB to 190 MiB and RSS from 415 MiB to 250 MiB on a cluster with 791 CRDs". https://github.com/crossplane/crossplane/releases/tag/v2.5.0
- A Crossplane blog post dated 2026-10-08 reports that provider memory "drops by roughly 80-95% depending on the provider" on a cluster of about 2,000 CRDs using crossplane-runtime v2.4, through CRD schema stripping and an optional Secret cache. https://blog.crossplane.io/cutting-provider-memory-by-80-crossplane-runtime-v2-4-and-client-caching/
- Crossplane v2.4.0 (2026-08-20) creates the runtime of a safe-start provider with zero replicas until its first managed resource definition is active.
- The v2.5 docs estimate about 3 MiB of API server memory per CRD, so 200 CRDs is roughly 600 MiB. That is a docs estimate and not a benchmark.

## What is still missing

The dossier found no measurement of API server memory with versus without activation policies, and no independent adopter benchmark. The figures do show that the family-split decision (more pods, fewer CRDs) is being offset from the other side: per-provider memory and idle providers are shrinking.

## Lesson

Quote the numbers as project-reported and tie each to its cluster size. See [[decisions/split-a-large-provider-into-families-or-filter-or-lazy-load-its-crds]], [[findings/splitting-a-provider-into-a-family-trades-fewer-crds-for-more-pods-and-memory]], [[examples/crossplane-managed-resource-activation-policies-install-only-the-resource-types-a-cluster-needs]], and [[concepts/scale-and-sharding]].

## Release-note and docs confirmation (2026-11-26)

The v2.4.0 notes say a safe-start provider's runtime `Deployment` is created with zero replicas until a ManagedResourceDefinition is active, and the v2.5 MRD documentation says "Each CRD consumes about 3 MiB of API server memory" with 300 MiB or more for large providers. [[sources/research-gap-b1-recheck-kro-crossplane]]

---
title: Cozystack's flux-shard-operator creates helm-controller shards at about 100 HelmReleases per shard
type: example
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-o2-flux-internals
    hash: 866650ffd3aa
    ingested: 2026-11-26
aliases: []
tags: [use-case, flux, sharding, cozystack, helm-controller, adopter]
---

# Cozystack's flux-shard-operator creates helm-controller shards at about 100 HelmReleases per shard

## Scenario

Cozystack, which turns commodity servers into a Kubernetes-based cloud (see [[examples/cozystack-turns-commodity-servers-into-a-cloud-with-kubernetes-databases-and-vms]]), ships a `flux-shard-operator` in its repository. The operator creates helm-controller shards that start with `--watch-label-selector=sharding.fluxcd.io/key=shard<i>`, places tenants greedily by HelmRelease count, and sizes the shard count at roughly 100 HelmReleases per shard with a maximum of 16. The README gives the formula `K = clamp(ceil(H/100), 1, min(16, T))`, where H is the HelmRelease count and T the tenant count, and a default per-shard `--concurrent` of 5. URL: https://github.com/cozystack/cozystack/blob/main/packages/system/flux-shard-operator/README.md, read on `main` on 2026-11-26. [[sources/research-gap-o2-flux-internals]]

## What the evidence supports

The numbers are the project's own documentation of design intent. Production use was not independently confirmed, and no measured outcome was found, so they are design targets and not adopter measurements. The example is still the first named project in the wiki that automates label-based sharding of Flux, and it shows the tenant-per-shard placement pattern. It sits beside the Morgan Stanley case, where sharding is listed only as exploration: [[examples/morgan-stanley-runs-flux-across-more-than-500-clusters-with-self-service-onboarding]].

## Related

[[examples/flux-sharding-splits-reconciliation-across-label-selected-controller-instances]], [[findings/a-flux-helmchart-generated-from-a-helmrelease-takes-its-shard-label-from-spec-chart-metadata-labels]], [[decisions/shard-flux-controllers-or-tune-intervals-and-concurrency-first]], [[entities/cozystack]], [[entities/flux]]

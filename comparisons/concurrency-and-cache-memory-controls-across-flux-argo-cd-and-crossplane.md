---
title: Concurrency and cache memory controls across Flux, Argo CD, and Crossplane
type: comparison
status: contradicted
created: 2026-11-25
updated: 2026-11-26
sources:
  - id: research-gap-b1-recheck-kro-crossplane
    hash: ccee0efa5bdd
    ingested: 2026-11-26
  - id: research-informers-reflectors-and-workqueues
    hash: f9de5ca73ab6
    ingested: 2026-11-25
  - id: research-gap-m5-informers-caches
    hash: 1a6a4969c0c2
    ingested: 2026-11-26
aliases: []
tags: [comparison, concurrency, memory, sharding, rate-limiting]
---

# Concurrency and cache memory controls across Flux, Argo CD, and Crossplane

The values below are as extracted from each tool's documentation or issue by the dossier and should be verified before they are quoted. [[sources/research-informers-reflectors-and-workqueues]]

| Control | [[entities/flux]] | [[entities/argo-cd]] | [[entities/crossplane]] |
|---|---|---|---|
| Worker concurrency | `--concurrent` flags on each controller | `--status-processors` (default 20) and `--operation-processors` (default 10) | `MaxConcurrentReconciles`, now bounded through `--max-reconcile-rate` |
| Cache | Own manager per controller with a watch label selector on its kinds, Secrets and ConfigMaps uncached unless a gate is on, and a Helm index cache in source-controller (`--helm-cache-max-size`, `--helm-cache-ttl`) | Lightweight cluster cache fed by watch APIs | Strips CRD schemas from one cache and does not cache Secrets |
| Memory guidance | Use persistent volumes in place of EmptyDir, because tmpfs counts against pod memory | Set `GOMEMLIMIT` to 80 to 90 percent of the container limit | Not described |
| Sharding | Label-selector shards, one controller deployment per `sharding.fluxcd.io/key` value; extra replicas are failover standbys | Clusters sharded across replicas: `legacy`, `round-robin`, `consistent-hashing` | No sharding guidance found in the Crossplane docs |
| External load control | Not described | Not described | `--max-reconcile-rate` caps reconciles per second as a proxy for cloud API calls |

## Reading the table

Each tool exposes the same underlying queue and cache in a different vocabulary. Argo CD and Flux both document sharding, by cluster and by label selector respectively, and no Crossplane sharding guide was found (correction note, 2026-11-26, see Contradictions). Crossplane is the only one whose control is aimed at an external API, because its reconcile rate is its cloud call rate. Flux describes concurrency, cache and sharding settings, and each Flux controller runs its own cache. Empty cells mean the dossier did not read a page that states the value, not that the tool lacks the control. See [[examples/flux-controllers-expose-worker-concurrency-and-helm-cache-size-as-tuning-knobs]], [[examples/argo-cd-application-controller-shards-clusters-and-tunes-processor-counts]], [[examples/crossplane-max-reconcile-rate-turns-reconcile-rate-into-an-api-call-budget]], and [[comparisons/load-and-fairness-controls-across-controller-runtime-flux-argo-cd-and-kro]]. The sharding question is tracked in [[open-knowledge-gaps]].

## Contradictions

> [!WARNING]
> **This page said:** the Crossplane worker concurrency is "`MaxConcurrentReconciles`, now bounded through `--max-reconcile-rate`", and external load control is "`--max-reconcile-rate` caps reconciles per second as a proxy for cloud API calls".<br>
> **The 2026-11-26 dossier says:** in v2.5.0 source `--max-reconcile-rate` is only an alias of `--max-concurrent-reconciles`, "The maximum number of concurrent reconcile operations (worker pool size)", with a default of 100, and the v2.1.0 release notes say the flag "has been renamed". It is a worker pool size, not a per-second cap. [[sources/research-gap-b1-recheck-kro-crossplane]]<br>
> **Suggested resolution:** rewrite the two Crossplane cells for v2 as `--max-concurrent-reconciles` (worker pool, default 100) with the XR circuit breaker (burst 100, refill 1.0 per second) as the runaway guard, and keep the per-second budget description only for the 1.6 era. See [[findings/the-crossplane-v2-5-docs-describe-max-reconcile-rate-as-a-rate-but-source-treats-it-as-a-worker-pool-size-alias]].

> [!WARNING]
> **This page said:** "Argo CD is the only one of the three with documented sharding" and "Flux describes concurrency and cache flags but nothing about shared informers or sharding", with the Flux sharding cell "Not described" and the Flux cache cell limited to the Helm index.<br>
> **The 2026-11-26 informer dossier says:** the Flux docs document sharding ("each controller can be deployed multiple times with a unique label selector which is used as the sharding key") and say "Extra replicas of a Flux controller are failover standbys", and each Flux controller narrows its own cache with a watch label selector. [[sources/research-gap-m5-informers-caches]]<br>
> **Resolution applied:** the Flux cache and sharding cells above were rewritten. The Crossplane cells now state what was found: schema stripping and no cached Secrets, and no sharding or performance guide. The page keeps `status: contradicted` because its earlier Crossplane `--max-reconcile-rate` cells are still awaiting the rewrite described in the first Contradictions block. See [[findings/flux-controllers-keep-separate-caches-narrowed-by-a-watch-label-selector-and-leave-secrets-and-configmaps-uncached-by-default]], [[findings/crossplane-core-strips-crd-schemas-from-its-cache-and-no-crossplane-performance-or-sharding-guide-was-found]], and [[comparisons/informer-and-cache-choices-across-kro-config-connector-ack-and-cluster-api]].

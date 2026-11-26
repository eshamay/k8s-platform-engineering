---
title: Load and fairness controls across controller-runtime, Flux, Argo CD, and kro
type: comparison
status: draft
created: 2026-11-25
updated: 2026-11-26
sources:
  - id: research-reconciliation-loop
    hash: df7d66206baf
    ingested: 2026-11-25
  - id: research-informers-reflectors-and-workqueues
    hash: f9de5ca73ab6
    ingested: 2026-11-25
  - id: research-gap-g3-kro
    hash: e8d7c5923d98
    ingested: 2026-11-26
aliases: []
tags: [comparison, load, rate-limiting, jitter, workqueue]
---

# Load and fairness controls across controller-runtime, Flux, Argo CD, and kro

The values below are as stated on the fetched pages. The kro numbers first came from the `next` documentation, and the released v0.10.0 tuning page confirms them (correction note: the earlier caveat about released versions is resolved). The v0.10.0 page also lists a 30 second watch sync timeout, a Graph controller concurrency of 1, and `applyConcurrency` 20. [[sources/research-gap-g3-kro]] [[sources/research-reconciliation-loop]]

| Control | [[entities/controller-runtime]] | [[entities/flux]] | [[entities/argo-cd]] | [[entities/kro]] |
|---|---|---|---|---|
| Queue | Rate-limited workqueue per controller | Not described | Not described | One shared rate-limited queue for all instances |
| Failure delay | Per-item exponential backoff, tunable with `RateLimiter` | `retryInterval`, default `interval` | Configurable retry backoff | 3 seconds growing to 5 minutes |
| Spreading load | Jitter is advised for requeue | Jitter available on intervals | 60 seconds of jitter on a 120 second poll | Bucket limit of 10 events per second |
| Concurrency | Workers per controller | Not described | Not described | 1 worker by default, configurable |
| API client limits | Not described | Not described | Not described | QPS 100, burst 150 |
| Full resync | Informer resync period | `spec.interval`, minimum 60 seconds | `timeout.reconciliation` | Every 10 hours |

## Reading the table

kro states the fairness goal outright: "All resource events flow through one rate-limited queue, preventing any single RGD from overwhelming the system." The trade-off is that a single worker serializes instances, so a slow instance can delay others unless the worker count is raised. Flux and Argo CD address synchronization of many objects mostly through jitter, and they differ on retries. See [[examples/kro-shared-queue-tunes-throughput]], [[comparisons/reconcile-cadence-and-off-switches-across-tools]], and [[comparisons/retry-and-backoff-controls-across-tools]]. The dossier gives no sharding data, which is tracked in [[open-knowledge-gaps]]. [[sources/research-reconciliation-loop]]

## Concurrency data from the informers dossier

The informers dossier fills some empty cells: Flux raises concurrency with `--concurrent` flags, and Argo CD exposes `--status-processors` and `--operation-processors` and shards clusters. [[sources/research-informers-reflectors-and-workqueues]] See [[comparisons/concurrency-and-cache-memory-controls-across-flux-argo-cd-and-crossplane]].

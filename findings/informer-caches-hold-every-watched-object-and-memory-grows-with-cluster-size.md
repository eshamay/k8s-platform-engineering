---
title: Informer caches hold every watched object and memory grows with cluster size
type: finding
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-informers-reflectors-and-workqueues
    hash: f9de5ca73ab6
    ingested: 2026-11-25
aliases: []
tags: [pitfall, cache, memory, scale, controller-runtime]
---

# Informer caches hold every watched object and memory grows with cluster size

## Observation

The controller-runtime cache is an in-memory copy of every object the controller watches, and the Kubernetes blog says it has no eviction. Memory therefore grows in proportion to the number of watched objects, so a controller on a large cluster or one that watches a kind with many large objects can exhaust its memory. Argo CD advises sharding clusters across replicas and setting `GOMEMLIMIT` to 80 to 90 percent of the container limit. Flux exposes Helm cache size and TTL flags and warns that tmpfs counts against pod memory. [[sources/research-informers-reflectors-and-workqueues]]

## Interpretation

The cache is what makes reads cheap, so memory is the price of avoiding API calls. Narrowing what is watched, through field or label selectors, transforms that trim objects, or metadata-only informers, is a common remedy, but the sources read did not cover these in detail, and the cache blog was read only in part. See [[open-knowledge-gaps]].

## Mitigations seen in the dossier

Shard across replicas ([[examples/argo-cd-application-controller-shards-clusters-and-tunes-processor-counts]]), tune the runtime memory limit, and size caches explicitly ([[examples/flux-controllers-expose-worker-concurrency-and-helm-cache-size-as-tuning-knobs]]).

## Related

[[concepts/informers-reflectors-and-workqueues]], [[comparisons/concurrency-and-cache-memory-controls-across-flux-argo-cd-and-crossplane]], [[findings/etcd-scale-limits-of-the-shared-store]]

---
title: Informer caches hold every watched object and memory grows with cluster size
type: finding
status: active
created: 2026-11-25
updated: 2026-11-26
sources:
  - id: research-informers-reflectors-and-workqueues
    hash: f9de5ca73ab6
    ingested: 2026-11-25
  - id: research-gap-m5-informers-caches
    hash: 1a6a4969c0c2
    ingested: 2026-11-26
aliases: []
tags: [pitfall, cache, memory, scale, controller-runtime]
---

# Informer caches hold every watched object and memory grows with cluster size

## Observation

The controller-runtime cache is an in-memory copy of every object the controller watches, and the Kubernetes blog says it has no eviction. Memory therefore grows in proportion to the number of watched objects, so a controller on a large cluster or one that watches a kind with many large objects can exhaust its memory. Argo CD advises sharding clusters across replicas and setting `GOMEMLIMIT` to 80 to 90 percent of the container limit. Flux exposes Helm cache size and TTL flags and warns that tmpfs counts against pod memory. [sources/research-informers-reflectors-and-workqueues](../sources/research-informers-reflectors-and-workqueues.md)

## Interpretation

The cache is what makes reads cheap, so memory is the price of avoiding API calls. Narrowing what is watched, through field or label selectors, transforms that trim objects, or metadata-only informers, is a common remedy, and the controller-runtime source now documents them: per-type selectors, namespace scoping, transforms, metadata-only informers, and a `DisableFor` list ([findings/controller-runtime-narrows-its-cache-with-selectors-transforms-metadata-only-informers-and-disable-for-and-each-option-has-a-cost](controller-runtime-narrows-its-cache-with-selectors-transforms-metadata-only-informers-and-disable-for-and-each-option-has-a-cost.md)). Correction note, 2026-11-26: this paragraph previously said the sources did not cover these. No memory savings were measured, so the size of the reduction is unknown. [sources/research-gap-m5-informers-caches](../sources/research-gap-m5-informers-caches.md)

## Mitigations seen in the dossier

Shard across replicas ([examples/argo-cd-application-controller-shards-clusters-and-tunes-processor-counts](../examples/argo-cd-application-controller-shards-clusters-and-tunes-processor-counts.md)), tune the runtime memory limit, and size caches explicitly ([examples/flux-controllers-expose-worker-concurrency-and-helm-cache-size-as-tuning-knobs](../examples/flux-controllers-expose-worker-concurrency-and-helm-cache-size-as-tuning-knobs.md)).

## Related

[concepts/informers-reflectors-and-workqueues](../concepts/informers-reflectors-and-workqueues.md), [comparisons/concurrency-and-cache-memory-controls-across-flux-argo-cd-and-crossplane](../comparisons/concurrency-and-cache-memory-controls-across-flux-argo-cd-and-crossplane.md), [findings/etcd-scale-limits-of-the-shared-store](etcd-scale-limits-of-the-shared-store.md)


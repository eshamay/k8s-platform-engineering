---
title: Narrow the controller cache with selectors, transforms, or metadata-only informers, or bypass it for some types
type: decision
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-m5-informers-caches
    hash: 1a6a4969c0c2
    ingested: 2026-11-26
aliases: [cache narrowing choice]
tags: [decision, cache, memory, controller-runtime, evidence-only]
---

# Narrow the controller cache with selectors, transforms, or metadata-only informers, or bypass it for some types

## Status

Open, and evidence-only. This page lists the options and the evidence for each. It makes no recommendation, because the dossier measured no memory savings and no source compares the options. [sources/research-gap-m5-informers-caches](../sources/research-gap-m5-informers-caches.md)

## Context

A controller-runtime cache holds every object it watches with no eviction, so memory grows with the watched set ([findings/informer-caches-hold-every-watched-object-and-memory-grows-with-cluster-size](../findings/informer-caches-hold-every-watched-object-and-memory-grows-with-cluster-size.md)). The package offers several ways to shrink it, each of which changes what a reconciler can read ([findings/controller-runtime-narrows-its-cache-with-selectors-transforms-metadata-only-informers-and-disable-for-and-each-option-has-a-cost](../findings/controller-runtime-narrows-its-cache-with-selectors-transforms-metadata-only-informers-and-disable-for-and-each-option-has-a-cost.md)).

## Options

1. Scope the ListWatch by namespace, label selector, or field selector. Flux does this for its own custom kinds with a watch label selector, and ACK service controllers do it from flags. Objects that fall outside the scope are invisible to the controller. [findings/flux-controllers-keep-separate-caches-narrowed-by-a-watch-label-selector-and-leave-secrets-and-configmaps-uncached-by-default](../findings/flux-controllers-keep-separate-caches-narrowed-by-a-watch-label-selector-and-leave-secrets-and-configmaps-uncached-by-default.md) and [examples/ack-service-controllers-scope-their-cache-by-namespace-and-label-selector-and-trigger-on-generation-changes](../examples/ack-service-controllers-scope-their-cache-by-namespace-and-label-selector-and-trigger-on-generation-changes.md)
2. Transform objects as they enter the cache. Crossplane core strips CRD OpenAPI schemas, and Cluster API strips managed fields in its workload-cluster cache. The documentation says stripping managed fields "can lead to a significant reduction in memory usage", and the stripped data is unavailable to every cached read. [findings/crossplane-core-strips-crd-schemas-from-its-cache-and-no-crossplane-performance-or-sharding-guide-was-found](../findings/crossplane-core-strips-crd-schemas-from-its-cache-and-no-crossplane-performance-or-sharding-guide-was-found.md) and [examples/cluster-api-caches-only-cluster-labelled-secrets-and-gives-each-workload-cluster-its-own-cache](../examples/cluster-api-caches-only-cluster-labelled-secrets-and-gives-each-workload-cluster-its-own-cache.md)
3. Use metadata-only informers. kro holds one per GVR so "memory stays bounded as the set of watched GVRs grows", and only metadata is available from them. [examples/kro-keeps-one-metadata-only-shared-informer-per-gvr](../examples/kro-keeps-one-metadata-only-shared-informer-per-gvr.md)
4. Bypass the cache for chosen types with `DisableFor`. Flux does this for Secrets and ConfigMaps, Crossplane for Secrets, and Config Connector for Namespace, Secret, ConfigMap and IAM kinds. Every read of those types becomes a live API call. [examples/config-connector-caches-only-its-own-configuration-kinds-by-default](../examples/config-connector-caches-only-its-own-configuration-kinds-by-default.md)

## Evidence and limits

Each option is shipped by at least one project, so none is a theoretical choice. The costs named in source are invisibility for scoped-out objects, lost fields for transforms, metadata-only reads, and live API calls for bypassed types, and `DropManagedFields` must not be used where managed fields are read. No source quantifies savings, and no source says which combination suits which workload. The projects also combine options, which the table in [comparisons/informer-and-cache-choices-across-kro-config-connector-ack-and-cluster-api](../comparisons/informer-and-cache-choices-across-kro-config-connector-ack-and-cluster-api.md) shows.

## Consequences

Whichever option a team picks, it moves cost from memory to something else: coverage, field availability, or API load. Bypassing the cache also raises the request rate against the API server, which Flux's feature-gate comment ties to RBAC scope as well. See [concepts/informers-reflectors-and-workqueues](../concepts/informers-reflectors-and-workqueues.md) and [comparisons/concurrency-and-cache-memory-controls-across-flux-argo-cd-and-crossplane](../comparisons/concurrency-and-cache-memory-controls-across-flux-argo-cd-and-crossplane.md).

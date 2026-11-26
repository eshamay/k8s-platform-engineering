---
title: client-go
type: entity
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-gvk-and-gvr
    hash: 5c56bb1e05a8
    ingested: 2026-11-25
  - id: research-informers-reflectors-and-workqueues
    hash: f9de5ca73ab6
    ingested: 2026-11-25
aliases: [k8s.io/client-go]
tags: [client-library, go, discovery]
---

# client-go

## What it is

client-go is the Go client library for the Kubernetes API, and it supplies the discovery client, the RESTMapper, and the Scheme machinery that turn a manifest's [[concepts/gvk-and-gvr]] into an HTTP request. [[sources/research-gvk-and-gvr]]

## Mapper constructors

The restmapper package offers `NewDiscoveryRESTMapper` for a mapper built from discovery output, `DeferredDiscoveryRESTMapper` for lazy initialization on first use, `NewShortcutExpander` for abbreviations such as `po`, `GetAPIGroupResources` for reading discovery into group resources, and `Reset` for invalidation. URLs: https://pkg.go.dev/k8s.io/client-go/restmapper and https://github.com/kubernetes/client-go/blob/master/restmapper/discovery.go. The deferred mapper invalidates and rebuilds its delegate when a mapping fails and the cache is not fresh, which is the mechanism behind self-healing after a CRD is installed. The dossier read the source through a summarizing fetch, so the details should be rechecked against the file.

## Related

[[concepts/api-discovery-and-restmapper]], [[comparisons/restmapper-strategies-static-deferred-and-dynamic]], [[entities/controller-runtime]], [[findings/stale-restmapper-hides-newly-installed-crds]]

## Reflector, DeltaFIFO, Indexer, and workqueue

client-go's `tools/cache` package implements the Reflector (LIST then WATCH), the DeltaFIFO, and the thread-safe Indexer with optional secondary indexes, and `util/workqueue` provides the base, delaying, and rate-limiting queues. The architecture documents describe handlers that only enqueue keys, watch bookmarks, and relisting on 410 Gone. [[sources/research-informers-reflectors-and-workqueues]] See [[concepts/informers-reflectors-and-workqueues]] and [[findings/an-expired-resourceversion-forces-a-relist-and-synchronized-relists-can-storm]].

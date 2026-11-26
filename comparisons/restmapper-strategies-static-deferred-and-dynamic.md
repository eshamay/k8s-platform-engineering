---
title: RESTMapper strategies, static versus deferred versus dynamic
type: comparison
status: active
created: 2026-11-25
updated: 2026-11-26
sources:
  - id: research-gvk-and-gvr
    hash: 5c56bb1e05a8
    ingested: 2026-11-25
  - id: research-gap-m5-informers-caches
    hash: 1a6a4969c0c2
    ingested: 2026-11-26
aliases: []
tags: [restmapper, client-go, controller-runtime]
---

# RESTMapper strategies, static versus deferred versus dynamic

| Strategy | When it builds | Behavior on a missing mapping | Source |
|---|---|---|---|
| Static discovery mapper (`NewDiscoveryRESTMapper`) | Once, from discovery output | Fails with "no matches for kind" until rebuilt | client-go |
| Deferred mapper (`DeferredDiscoveryRESTMapper`) | Lazily on first use | Invalidates and rebuilds its delegate if the cache is not fresh, then retries | client-go |
| Dynamic rate-limited mapper | At startup, then on demand | Invalidates on lookup failure, with a rate limit; the default since controller-runtime v0.3.0 | controller-runtime issue 321, v0.3.0 release notes, and v0.3.0 `manager.go` |

[[sources/research-gvk-and-gvr]]

## Reading the table

A mapper that is built once is a snapshot, which is the root of [[findings/stale-restmapper-hides-newly-installed-crds]]. The deferred and dynamic variants self-heal after a CRD is installed. The v0.3.0 default claim is confirmed by the release notes and the tag source ([[findings/the-dynamic-restmapper-is-confirmed-as-the-controller-runtime-default-at-v0-3-0-from-the-release-notes-and-tag-source]]); correction note, 2026-11-26. See [[concepts/api-discovery-and-restmapper]], [[entities/client-go]], and [[entities/controller-runtime]].

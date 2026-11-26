---
title: A stale RESTMapper hides newly installed CRDs
type: finding
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
tags: [pitfall, restmapper, discovery, controller-runtime]
---

# A stale RESTMapper hides newly installed CRDs

## Observation

A RESTMapper built once at startup reflects the cluster only at that moment. In controller-runtime issue 321, a client's mapper was built at startup, so CRDs created later produced "no matches for kind" errors. Workarounds included wrapper mappers that reload on no-match and recreating the client. The fix was a dynamic, rate-limited mapper that invalidates itself on lookup failure, the default since controller-runtime v0.3.0. URL: https://github.com/kubernetes-sigs/controller-runtime/issues/321. [[sources/research-gvk-and-gvr]]

## Caveat

Correction note, 2026-11-26: the v0.3.0 claim, which first came from a summarized issue thread, is confirmed by the release notes and the v0.3.0 tag source ([[findings/the-dynamic-restmapper-is-confirmed-as-the-controller-runtime-default-at-v0-3-0-from-the-release-notes-and-tag-source]]). A mapper snapshot can also keep stale scope for a recreated CRD ([[examples/controller-runtime-issue-3303-a-recreated-crd-with-a-different-scope-was-not-picked-up-by-the-client-or-restmapper]]). [[sources/research-gap-m5-informers-caches]]

## Mitigation

client-go's `DeferredDiscoveryRESTMapper` initializes lazily and, when a mapping fails and the cache is not fresh, invalidates and rebuilds its delegate. The rate limit prevents a flood of unknown-kind lookups from hammering the discovery endpoints. See [[comparisons/restmapper-strategies-static-deferred-and-dynamic]], [[concepts/api-discovery-and-restmapper]], [[entities/controller-runtime]], and [[entities/client-go]].

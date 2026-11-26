---
title: A stale RESTMapper hides newly installed CRDs
type: finding
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-gvk-and-gvr
    hash: 5c56bb1e05a8
    ingested: 2026-11-25
aliases: []
tags: [pitfall, restmapper, discovery, controller-runtime]
---

# A stale RESTMapper hides newly installed CRDs

## Observation

A RESTMapper built once at startup reflects the cluster only at that moment. In controller-runtime issue 321, a client's mapper was built at startup, so CRDs created later produced "no matches for kind" errors. Workarounds included wrapper mappers that reload on no-match and recreating the client. The fix was a dynamic, rate-limited mapper that invalidates itself on lookup failure, reported as the default since controller-runtime v0.3.0. URL: https://github.com/kubernetes-sigs/controller-runtime/issues/321. [[sources/research-gvk-and-gvr]]

## Caveat

The v0.3.0 claim comes from a summarized issue thread and should be checked against release notes before it is relied upon. See [[open-knowledge-gaps]].

## Mitigation

client-go's `DeferredDiscoveryRESTMapper` initializes lazily and, when a mapping fails and the cache is not fresh, invalidates and rebuilds its delegate. The rate limit prevents a flood of unknown-kind lookups from hammering the discovery endpoints. See [[comparisons/restmapper-strategies-static-deferred-and-dynamic]], [[concepts/api-discovery-and-restmapper]], [[entities/controller-runtime]], and [[entities/client-go]].

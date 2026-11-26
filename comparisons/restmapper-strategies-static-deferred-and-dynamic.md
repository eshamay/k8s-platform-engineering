---
title: RESTMapper strategies, static versus deferred versus dynamic
type: comparison
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-gvk-and-gvr
    hash: 5c56bb1e05a8
    ingested: 2026-11-25
aliases: []
tags: [restmapper, client-go, controller-runtime]
---

# RESTMapper strategies, static versus deferred versus dynamic

| Strategy | When it builds | Behavior on a missing mapping | Source |
|---|---|---|---|
| Static discovery mapper (`NewDiscoveryRESTMapper`) | Once, from discovery output | Fails with "no matches for kind" until rebuilt | client-go |
| Deferred mapper (`DeferredDiscoveryRESTMapper`) | Lazily on first use | Invalidates and rebuilds its delegate if the cache is not fresh, then retries | client-go |
| Dynamic rate-limited mapper | At startup, then on demand | Invalidates on lookup failure, with a rate limit; reported as the default since controller-runtime v0.3.0 | controller-runtime issue 321 |

[[sources/research-gvk-and-gvr]]

## Reading the table

A mapper that is built once is a snapshot, which is the root of [[findings/stale-restmapper-hides-newly-installed-crds]]. The deferred and dynamic variants self-heal after a CRD is installed. The v0.3.0 default claim comes from a summarized thread and should be verified. See [[concepts/api-discovery-and-restmapper]], [[entities/client-go]], and [[entities/controller-runtime]].

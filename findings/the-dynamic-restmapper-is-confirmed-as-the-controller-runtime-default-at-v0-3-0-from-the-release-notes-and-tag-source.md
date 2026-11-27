---
title: The dynamic RESTMapper is confirmed as the controller-runtime default at v0.3.0 from the release notes and tag source
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-m5-informers-caches
    hash: 1a6a4969c0c2
    ingested: 2026-11-26
aliases: [v0.3.0 dynamic mapper]
tags: [controller-runtime, restmapper, release-notes, history, mechanism]
---

# The dynamic RESTMapper is confirmed as the controller-runtime default at v0.3.0 from the release notes and tag source

## Observation

The wiki previously reported, from a summarized issue thread, that controller-runtime's dynamic rate-limited RESTMapper became the default in v0.3.0. Two primary sources now confirm it. [sources/research-gap-m5-informers-caches](../sources/research-gap-m5-informers-caches.md)

The v0.3.0 release notes, published 2019-10-10, list under New Features "DynamicRESTMapper that reloads on REST cache miss (#554)". https://github.com/kubernetes-sigs/controller-runtime/releases/tag/v0.3.0 The release notes themselves say only "New Features" and do not say "default". Pull request 554 merged on 2019-10-10 and says reloads are "rate-limited by a token bucket, and will return an `ErrRateLimited`". The v0.3.0 tag's `pkg/manager/manager.go` returns `apiutil.NewDynamicRESTMapper(c)` as the default mapper, which settles the default claim from source at the tag. https://github.com/kubernetes-sigs/controller-runtime/blob/v0.3.0/pkg/manager/manager.go

## Later history

Pull request 2296, "Use and provide a single dynamic rest mapper", merged on 2023-05-04, and its body is empty. The current mapper holds a `discovery.AggregatedDiscoveryInterface` client and loads groups lazily. Which controller-runtime release first adopted aggregated discovery was not established, because no release-note statement was read. https://github.com/kubernetes-sigs/controller-runtime/blob/main/pkg/client/apiutil/restmapper.go

## Related

[findings/stale-restmapper-hides-newly-installed-crds](stale-restmapper-hides-newly-installed-crds.md), [findings/aggregated-discovery-exists-because-per-group-version-discovery-caused-a-request-storm](aggregated-discovery-exists-because-per-group-version-discovery-caused-a-request-storm.md), [comparisons/restmapper-strategies-static-deferred-and-dynamic](../comparisons/restmapper-strategies-static-deferred-and-dynamic.md), [concepts/api-discovery-and-restmapper](../concepts/api-discovery-and-restmapper.md).

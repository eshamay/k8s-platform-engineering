---
title: An expired resourceVersion forces a relist and synchronized relists can storm
type: finding
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-informers-reflectors-and-workqueues
    hash: f9de5ca73ab6
    ingested: 2026-11-25
aliases: [Relist storm]
tags: [pitfall, watch, reflector, api-server, resourceVersion]
---

# An expired resourceVersion forces a relist and synchronized relists can storm

## Observation

A watch resumes from a resource version. When that version is too old, the API server returns 410 Gone and the client must relist the whole collection before watching again. If many clients lose their watch at the same time, they all relist at once, which is expensive for the API server and etcd. [[sources/research-informers-reflectors-and-workqueues]]

## Mitigations

Watch bookmarks keep the cursor fresh during quiet periods so it is less likely to expire. The server's watch cache lets clients resume from recent versions without reading etcd. Streaming lists reduce the cost of large collections, and jittered backoff spreads out relists. The secondary explainer recommends jitter explicitly, and the API concepts page was read only through its first 100,000 characters. See [[concepts/informers-reflectors-and-workqueues]] and [[examples/ant-group-large-cluster-tuning-of-apiserver-watch-cache-and-etcd]].

## Related

[[findings/etcd-scale-limits-of-the-shared-store]], [[findings/retry-storms-and-unbounded-retries]]

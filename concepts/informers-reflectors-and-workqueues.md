---
title: Informers, Reflectors, and Workqueues
type: concept
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: krm-platform-vocabulary
    hash: 731a6941f9db
    ingested: 2026-11-25
aliases: [client-go caching, controller-runtime cache]
tags: [controllers, scale]
---

# Informers, Reflectors, and Workqueues

## Definition

The caching machinery inside client-go and controller-runtime. It watches the API server over HTTP streams, keeps an in-memory local cache to avoid overloading etcd, and queues object keys (namespace/name) for worker threads to process. [[sources/krm-platform-vocabulary]]

## Why it matters

This machinery is why one controller can watch thousands of objects cheaply, and it is where scaling limits appear: cache memory, queue depth, worker concurrency, and rate limiting. The scale gap in [[open-knowledge-gaps]] centers on this topic.

## Related

[[concepts/reconciliation-loop]], [[concepts/level-triggered-vs-edge-triggered]], [[concepts/gvk-and-gvr]]

## To research

Resync behavior, rate-limited queues, sharding of controllers, and memory costs for large CRD populations.

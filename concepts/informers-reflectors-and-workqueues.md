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
  - id: research-level-triggered-vs-edge-triggered
    hash: 27a34aa0de59
    ingested: 2026-11-25
aliases: [client-go caching, controller-runtime cache]
tags: [controllers, scale]
---

# Informers, Reflectors, and Workqueues

## Definition

The caching machinery inside client-go and controller-runtime. It watches the API server over HTTP streams, keeps an in-memory local cache to avoid overloading etcd, and queues object keys (namespace/name) for worker threads to process. [[sources/krm-platform-vocabulary]]

## Why it matters

This machinery is why one controller can watch thousands of objects cheaply, and it is where scaling limits appear: cache memory, queue depth, worker concurrency, and rate limiting. The scale gap in [[open-knowledge-gaps]] centers on this topic.

## Events as hints and cache lag

Watch events delivered through informers are hints that enqueue an object key, and the reconciler then reads the full object from the cache. Because the cache can lag the controller's own writes, controllers need deterministic names or expectations to avoid acting twice. [[sources/research-level-triggered-vs-edge-triggered]] See [[decisions/events-as-hints-state-as-truth]] and [[findings/stale-cache-and-double-action]]. The exact semantics of resync (replaying cached state to handlers, not relisting from the API server) were not explained by any source in the dossier.

## Related

[[concepts/reconciliation-loop]], [[concepts/level-triggered-vs-edge-triggered]], [[concepts/gvk-and-gvr]]

## To research

Resync behavior, rate-limited queues, sharding of controllers, and memory costs for large CRD populations.

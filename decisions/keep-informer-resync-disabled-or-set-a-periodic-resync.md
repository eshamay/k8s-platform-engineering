---
title: Keep informer resync disabled or set a periodic resync
type: decision
status: active
created: 2026-11-25
updated: 2026-11-26
sources:
  - id: research-informers-reflectors-and-workqueues
    hash: f9de5ca73ab6
    ingested: 2026-11-25
  - id: research-gap-m5-informers-caches
    hash: 1a6a4969c0c2
    ingested: 2026-11-26
aliases: []
tags: [informers, resync, controller-runtime, decision]
---

# Keep informer resync disabled or set a periodic resync

## Status

Open. The mechanism is now sourced, but whether to enable a resync remains a design choice with no measured evidence. [sources/research-informers-reflectors-and-workqueues](../sources/research-informers-reflectors-and-workqueues.md)

## Context

An informer can be configured with a resync period that periodically re-delivers cached objects to the handlers so every object is reconciled again even if no event arrived. Defaults differ by framework: client-go does no resync at a zero period, and controller-runtime's `SyncPeriod` defaults to 10 hours with jitter. One secondary explainer calls resync a defense against reconciler bugs that is usually disabled, while the pitfalls blog lists misunderstanding resync as a common mistake. Resync replays cached state to the handlers and does not refetch from the API server ([findings/a-resync-replays-the-informers-local-cache-to-the-handlers-and-never-contacts-the-api-server](../findings/a-resync-replays-the-informers-local-cache-to-the-handlers-and-never-contacts-the-api-server.md)). Correction note, 2026-11-26: this sentence previously said no source stated that. See the resync gap in [open-knowledge-gaps](../open-knowledge-gaps.md).

## Options

Leave resync disabled, and rely on level-based reconcilers plus watch events and the requeue timers the reconciler sets itself. Or enable a periodic resync, which adds a safety net against missed events and reconciler bugs at the cost of extra reconciles of every object on each period.

## Consequences

Disabling resync keeps load low and puts the burden on correct reconcilers and on explicit `RequeueAfter` for external drift. Enabling it raises steady-state reconcile load in proportion to object count, which matters for controllers that call external APIs, where tools already lengthen the interval (kro's informer resync and ACK's `RequeueAfter` are both about ten hours, but they are different mechanisms, see [findings/the-word-resync-names-three-different-mechanisms-in-client-go-kro-and-ack](../findings/the-word-resync-names-three-different-mechanisms-in-client-go-kro-and-ack.md); correction note, 2026-11-26). See [decisions/choosing-a-drift-check-interval-for-external-resources](choosing-a-drift-check-interval-for-external-resources.md), [findings/cost-of-constant-reconciliation](../findings/cost-of-constant-reconciliation.md), and [concepts/informers-reflectors-and-workqueues](../concepts/informers-reflectors-and-workqueues.md).

On the missed-event case, the controller-runtime documentation recommends returning `RequeueAfter` instead of shortening `SyncPeriod`, because a resync only replays the cache. [sources/research-gap-m5-informers-caches](../sources/research-gap-m5-informers-caches.md)

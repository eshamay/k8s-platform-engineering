---
title: Keep informer resync disabled or set a periodic resync
type: decision
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-informers-reflectors-and-workqueues
    hash: f9de5ca73ab6
    ingested: 2026-11-25
aliases: []
tags: [informers, resync, controller-runtime, decision]
---

# Keep informer resync disabled or set a periodic resync

## Status

Open. The dossier's sources disagree in emphasis, and none explains the mechanism in detail. [[sources/research-informers-reflectors-and-workqueues]]

## Context

An informer can be configured with a resync period that periodically re-delivers cached objects to the handlers so every object is reconciled again even if no event arrived. Defaults differ by framework. One secondary explainer calls resync a defense against reconciler bugs that is usually disabled, while the pitfalls blog lists misunderstanding resync as a common mistake. Whether resync replays cached state or refetches from the API server is not stated by any source in the wiki. See the resync gap in [[open-knowledge-gaps]].

## Options

Leave resync disabled, and rely on level-based reconcilers plus watch events and the requeue timers the reconciler sets itself. Or enable a periodic resync, which adds a safety net against missed events and reconciler bugs at the cost of extra reconciles of every object on each period.

## Consequences

Disabling resync keeps load low and puts the burden on correct reconcilers and on explicit `RequeueAfter` for external drift. Enabling it raises steady-state reconcile load in proportion to object count, which matters for controllers that call external APIs, where tools already lengthen resync (ACK and kro use roughly ten hours). See [[decisions/choosing-a-drift-check-interval-for-external-resources]], [[findings/cost-of-constant-reconciliation]], and [[concepts/informers-reflectors-and-workqueues]].

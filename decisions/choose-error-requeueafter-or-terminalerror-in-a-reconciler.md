---
title: Choose error, RequeueAfter, or TerminalError in a reconciler
type: decision
status: active
created: 2026-11-25
updated: 2026-11-26
sources:
  - id: research-gap-g3-k8s-and-controller-runtime
    hash: 2b4e3378c119
    ingested: 2026-11-26
  - id: research-reconciliation-loop
    hash: df7d66206baf
    ingested: 2026-11-25
aliases: [Reconcile return value choice]
tags: [controller-runtime, requeue, backoff, decision]
---

# Choose error, RequeueAfter, or TerminalError in a reconciler

## Status

Recommended practice assembled from the dossier's sources. It is not an ADR authored by this wiki. The `Requeue: true` semantics were verified against controller-runtime v0.25.3 on 2026-11-26. [[sources/research-gap-g3-k8s-and-controller-runtime]]

## Context

Every pass of a controller-runtime reconciler must end by telling the workqueue what to do next. The package reference defines the outcomes, and practitioners report that the choice is a common source of confusion that leads to hot loops or stalled objects. [[sources/research-reconciliation-loop]]

## Options

- Return a non-nil error. The item is requeued with per-item exponential backoff, tunable through the controller's `RateLimiter` option.
- Return nil with `RequeueAfter`. The item is requeued after a fixed delay.
- Return nil with nothing set. The work is done until the next watch event or resync.
- Return a `TerminalError`. It is logged and counted in metrics but not retried.
- Return `Requeue: true`. It is deprecated. At v0.25.3 it is a rate-limited requeue with per-item exponential backoff that keeps the failure history, while `RequeueAfter` calls `Queue.Forget(req)` before it waits, so only `RequeueAfter` gives a steady cadence. See [[findings/a-requeue-true-result-backs-off-exponentially-because-only-requeueafter-forgets-the-failure-history]] and [[findings/the-requeue-true-result-is-deprecated-and-described-inconsistently]].

## Decision

Use an error for a failure that may succeed on retry, `RequeueAfter` for planned polling or a known waiting state, nothing for converged work, and `TerminalError` for failures that retry cannot fix, with the cause recorded in status. Do not use errors as timers. [[sources/research-reconciliation-loop]]

## Consequences

Errors give automatic backoff but unbounded retries, which can amplify load as described in [[findings/retry-storms-and-unbounded-retries]]. A fixed `RequeueAfter` is predictable but should carry jitter so many objects do not align. `TerminalError` stops wasted retries but needs a human or a spec change to resume. The tools built on top choose differently, for example Argo CD does not retry the same commit. See [[comparisons/retry-and-backoff-controls-across-tools]].

## Related

[[concepts/reconciliation-loop]], [[findings/errors-used-as-timers-in-reconcilers]], [[entities/controller-runtime]]

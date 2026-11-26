---
title: "A Requeue true result backs off exponentially because only RequeueAfter forgets the failure history"
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-g3-k8s-and-controller-runtime
    hash: 2b4e3378c119
    ingested: 2026-11-26
aliases: [Requeue true is rate-limited]
tags: [pitfall, controller-runtime, requeue, backoff, rate-limiter]
---

# A Requeue true result backs off exponentially because only RequeueAfter forgets the failure history

## Observation

In controller-runtime v0.25.3 (published 2026-11-16), returning `Result{Requeue: true}` with a nil error is a rate-limited requeue, and it is not an immediate one. The handler in `pkg/internal/controller/controller.go` handles `result.Requeue` by adding the request with `RateLimited: true`, so the controller's rate limiter chooses the delay. The per-item failure counter is not reset on this path, which means that a reconciler returning `Requeue: true` on every pass waits longer each time. [[sources/research-gap-g3-k8s-and-controller-runtime]]

The return values behave as follows at v0.25.3.

| Reconcile returns | Queue behavior |
|---|---|
| Non-nil error | Rate-limited requeue. `Requeue` and `RequeueAfter` are ignored, with a logged warning if either is set. A `TerminalError` is not requeued. |
| nil with `Requeue: true` | Rate-limited requeue, per-item exponential backoff, failure history kept. |
| nil with `RequeueAfter > 0` | `Queue.Forget(req)` is called first, which clears the backoff history, and then the item is added after exactly that duration. It takes precedence over `Requeue`. |
| nil with an empty result | No requeue until the next watch event or resync. |

The package comment ("Requeue tells the Controller to perform a ratelimited requeue using the workqueues ratelimiter"), the Reconciler documentation ("the request will be requeued using exponential backoff"), and the handler code agree. The field carries "Deprecated: Use `RequeueAfter` instead", with the advice to use a duration or poll interval and not a rate-limiter delay. The metric `reconcile_total` carries the result labels `error`, `requeue_after`, `requeue`, and `success`, so the three paths are distinguishable in monitoring.

## The defaults behind the delay

`UsePriorityQueue` defaults to true when unset. With the priority queue, the default limiter is the per-item exponential limiter alone, with a 5 ms base and a 1000 s cap, and no overall bucket. With the priority queue disabled, the default is client-go's `DefaultTypedControllerRateLimiter`, the maximum of that same limiter and a bucket of 10 qps with burst 100 (read from client-go master, not a pinned tag). In the priority queue, if a rate-limited add also carries an explicit `After` value, the smaller delay wins.

## What this corrects

An earlier version of this wiki recorded a conflict: the package reference said rate-limited, while a summary of controller-runtime issue 808 read `Requeue: true` as an immediate requeue without backoff. The source settles it in favor of the package reference. The dossier read only the body of issue 808, and the body does not say the requeue is immediate. It says "it is not immediately clear what returns from a `Reconcile()` will force a requeue with (or without) an exponential backoff." The comment thread was not read, so where the "immediate" reading came from is not located. See [[findings/the-requeue-true-result-is-deprecated-and-described-inconsistently]].

## Why it matters

An author who expects an immediate retry from `Requeue: true` is surprised by growing delays, and an author who uses `Requeue: true` for planned polling accumulates backoff and never gets a steady cadence. Use `RequeueAfter` for planned revisits, since it resets history, and an error for a failure that should back off. See [[decisions/choose-error-requeueafter-or-terminalerror-in-a-reconciler]] and [[findings/errors-used-as-timers-in-reconcilers]].

## Related

[[entities/controller-runtime]], [[concepts/reconciliation-loop]], [[findings/failure-retry-loops-and-backoff]], [[findings/retry-storms-and-unbounded-retries]]

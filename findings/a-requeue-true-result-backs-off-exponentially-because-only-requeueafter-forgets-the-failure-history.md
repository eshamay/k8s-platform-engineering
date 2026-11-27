---
title: "A Requeue true result backs off exponentially because only RequeueAfter forgets the failure history"
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-b1-recheck-flux-k8s
    hash: c78dc9a9635e
    ingested: 2026-11-26
  - id: research-gap-g3-k8s-and-controller-runtime
    hash: 2b4e3378c119
    ingested: 2026-11-26
aliases: [Requeue true is rate-limited]
tags: [pitfall, controller-runtime, requeue, backoff, rate-limiter]
---

# A Requeue true result backs off exponentially because only RequeueAfter forgets the failure history

## Observation

In controller-runtime v0.25.3 (published 2026-11-16), returning `Result{Requeue: true}` with a nil error is a rate-limited requeue, and it is not an immediate one. The handler in `pkg/internal/controller/controller.go` handles `result.Requeue` by adding the request with `RateLimited: true`, so the controller's rate limiter chooses the delay. The per-item failure counter is not reset on this path, which means that a reconciler returning `Requeue: true` on every pass waits longer each time. [sources/research-gap-g3-k8s-and-controller-runtime](../sources/research-gap-g3-k8s-and-controller-runtime.md)

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

An earlier version of this wiki recorded a conflict: the package reference said rate-limited, while a summary of controller-runtime issue 808 read `Requeue: true` as an immediate requeue without backoff. The source settles it in favor of the package reference. The dossier read only the body of issue 808, and the body does not say the requeue is immediate. It says "it is not immediately clear what returns from a `Reconcile()` will force a requeue with (or without) an exponential backoff." The comment thread was not read, so where the "immediate" reading came from is not located. See [findings/the-requeue-true-result-is-deprecated-and-described-inconsistently](the-requeue-true-result-is-deprecated-and-described-inconsistently.md).

## Why it matters

An author who expects an immediate retry from `Requeue: true` is surprised by growing delays, and an author who uses `Requeue: true` for planned polling accumulates backoff and never gets a steady cadence. Use `RequeueAfter` for planned revisits, since it resets history, and an error for a failure that should back off. See [decisions/choose-error-requeueafter-or-terminalerror-in-a-reconciler](../decisions/choose-error-requeueafter-or-terminalerror-in-a-reconciler.md) and [findings/errors-used-as-timers-in-reconcilers](errors-used-as-timers-in-reconcilers.md).

## Related

[entities/controller-runtime](../entities/controller-runtime.md), [concepts/reconciliation-loop](../concepts/reconciliation-loop.md), [findings/failure-retry-loops-and-backoff](failure-retry-loops-and-backoff.md), [findings/retry-storms-and-unbounded-retries](retry-storms-and-unbounded-retries.md)

## Update from the Flux and Kubernetes recheck

Correction note, 2026-11-26: the section "What this corrects" said the issue 808 comment thread was not read. It is now read in full (13 comments) and does not claim an immediate requeue ([findings/controller-runtime-issue-808-is-a-documentation-request-and-does-not-claim-that-requeue-true-is-immediate](controller-runtime-issue-808-is-a-documentation-request-and-does-not-claim-that-requeue-true-is-immediate.md)). Source at v0.4.0, v0.7.0, and v0.15.0 also calls `AddRateLimited` for `Requeue`, so the exponential backoff reading is stable across versions, not only at v0.25.3 ([examples/controller-runtime-pull-request-3107-deprecated-requeue-true-on-2025-02-24-and-pull-request-3574-to-document-it-is-still-open](../examples/controller-runtime-pull-request-3107-deprecated-requeue-true-on-2025-02-24-and-pull-request-3574-to-document-it-is-still-open.md)). The origin of the "immediate" reading is still not found. [sources/research-gap-b1-recheck-flux-k8s](../sources/research-gap-b1-recheck-flux-k8s.md)

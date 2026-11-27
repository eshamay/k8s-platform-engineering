---
title: Choose error, RequeueAfter, or TerminalError in a reconciler
type: decision
status: active
created: 2026-11-25
updated: 2026-11-26
sources:
  - id: research-gap-b1-recheck-flux-k8s
    hash: c78dc9a9635e
    ingested: 2026-11-26
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

Recommended practice assembled from the dossier's sources. It is not an ADR authored by this wiki. The `Requeue: true` semantics were verified against controller-runtime v0.25.3 on 2026-11-26. [sources/research-gap-g3-k8s-and-controller-runtime](../sources/research-gap-g3-k8s-and-controller-runtime.md)

## Context

Every pass of a controller-runtime reconciler must end by telling the workqueue what to do next. The package reference defines the outcomes, and practitioners report that the choice is a common source of confusion that leads to hot loops or stalled objects. [sources/research-reconciliation-loop](../sources/research-reconciliation-loop.md)

## Options

- Return a non-nil error. The item is requeued with per-item exponential backoff, tunable through the controller's `RateLimiter` option.
- Return nil with `RequeueAfter`. The item is requeued after a fixed delay.
- Return nil with nothing set. The work is done until the next watch event or resync.
- Return a `TerminalError`. It is logged and counted in metrics but not retried.
- Return `Requeue: true`. It is deprecated. At v0.25.3 it is a rate-limited requeue with per-item exponential backoff that keeps the failure history, while `RequeueAfter` calls `Queue.Forget(req)` before it waits, so only `RequeueAfter` gives a steady cadence. See [findings/a-requeue-true-result-backs-off-exponentially-because-only-requeueafter-forgets-the-failure-history](../findings/a-requeue-true-result-backs-off-exponentially-because-only-requeueafter-forgets-the-failure-history.md) and [findings/the-requeue-true-result-is-deprecated-and-described-inconsistently](../findings/the-requeue-true-result-is-deprecated-and-described-inconsistently.md).

## Decision

Use an error for a failure that may succeed on retry, `RequeueAfter` for planned polling or a known waiting state, nothing for converged work, and `TerminalError` for failures that retry cannot fix, with the cause recorded in status. Do not use errors as timers. [sources/research-reconciliation-loop](../sources/research-reconciliation-loop.md)

## Consequences

Errors give automatic backoff but unbounded retries, which can amplify load as described in [findings/retry-storms-and-unbounded-retries](../findings/retry-storms-and-unbounded-retries.md). A fixed `RequeueAfter` is predictable but should carry jitter so many objects do not align. `TerminalError` stops wasted retries but needs a human or a spec change to resume. The tools built on top choose differently, for example Argo CD does not retry the same commit. See [comparisons/retry-and-backoff-controls-across-tools](../comparisons/retry-and-backoff-controls-across-tools.md).

## Related

[concepts/reconciliation-loop](../concepts/reconciliation-loop.md), [findings/errors-used-as-timers-in-reconcilers](../findings/errors-used-as-timers-in-reconcilers.md), [entities/controller-runtime](../entities/controller-runtime.md)

## Update from the Flux and Kubernetes recheck

Update 2026-11-26: the evidence behind the `Requeue: true` row now reaches back to v0.4.0, because the source at v0.4.0, v0.7.0, and v0.15.0 calls `AddRateLimited` for it, and issue 808 never claimed otherwise ([findings/controller-runtime-issue-808-is-a-documentation-request-and-does-not-claim-that-requeue-true-is-immediate](../findings/controller-runtime-issue-808-is-a-documentation-request-and-does-not-claim-that-requeue-true-is-immediate.md)). Pull request 3107 deprecated the field on 2025-02-24 ([examples/controller-runtime-pull-request-3107-deprecated-requeue-true-on-2025-02-24-and-pull-request-3574-to-document-it-is-still-open](../examples/controller-runtime-pull-request-3107-deprecated-requeue-true-on-2025-02-24-and-pull-request-3574-to-document-it-is-still-open.md)). The recommendation to avoid it in new code is unchanged. [sources/research-gap-b1-recheck-flux-k8s](../sources/research-gap-b1-recheck-flux-k8s.md)

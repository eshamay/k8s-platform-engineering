---
title: The Requeue true result is deprecated and described inconsistently
type: finding
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
aliases: [Requeue true ambiguity]
tags: [controller-runtime, requeue, backoff, documentation]
---

# The Requeue true result is deprecated and described inconsistently

## Observation

Two sources in the dossier disagree about what `Result{Requeue: true}` does. The controller-runtime package reference says it produces a rate-limited requeue, which implies backoff. A summary of controller-runtime issue 808 reads the same return value as an immediate requeue without backoff, and says that returning an error is the way to enter the exponential backoff loop. The package reference also marks `Requeue` as deprecated. [sources/research-reconciliation-loop](../sources/research-reconciliation-loop.md)

## Why it is a pitfall

Authors who guess wrong build either a hot loop, if they expect backoff that does not happen, or a slow retry, if they expect immediacy. The Ahmet Alp Balkan guide lists unclear use of error versus `Requeue` versus `RequeueAfter` among common mistakes, and the issue itself exists because the semantics were historically under-documented. [sources/research-reconciliation-loop](../sources/research-reconciliation-loop.md)

## Resolution from the v0.25.3 source

Correction note, 2026-11-26: the conflict above is settled by the controller-runtime source at tag v0.25.3 (published 2026-11-16). `Result{Requeue: true}` with a nil error is a rate-limited requeue with per-item exponential backoff, and the failure history is kept, so the package reference was right. The "immediate requeue" reading is not supported by `reconcile.go` or `controller.go`. The dossier read only the body of issue 808, which does not claim that the requeue is immediate, and it did not read the comment thread, so where the immediate reading came from is not located. `RequeueAfter` forgets the history and waits the exact duration, and the `Requeue` field is marked "Deprecated: Use `RequeueAfter` instead." [sources/research-gap-g3-k8s-and-controller-runtime](../sources/research-gap-g3-k8s-and-controller-runtime.md) See [findings/a-requeue-true-result-backs-off-exponentially-because-only-requeueafter-forgets-the-failure-history](a-requeue-true-result-backs-off-exponentially-because-only-requeueafter-forgets-the-failure-history.md). The page keeps its title and the original observation so that readers who met the older conflicting claims can see what changed.

## What to do

Avoid the deprecated field in new code. Use an error for failures, `RequeueAfter` for planned polling, and `TerminalError` for failures that retry cannot fix. See [decisions/choose-error-requeueafter-or-terminalerror-in-a-reconciler](../decisions/choose-error-requeueafter-or-terminalerror-in-a-reconciler.md).

## Related

[entities/controller-runtime](../entities/controller-runtime.md), [findings/errors-used-as-timers-in-reconcilers](errors-used-as-timers-in-reconcilers.md), [findings/failure-retry-loops-and-backoff](failure-retry-loops-and-backoff.md), [concepts/reconciliation-loop](../concepts/reconciliation-loop.md)

## Update from the Flux and Kubernetes recheck

Correction note, 2026-11-26: the conflict recorded above came from a summary of issue 808, not from the issue. The thread, read in full, never calls the requeue immediate ([findings/controller-runtime-issue-808-is-a-documentation-request-and-does-not-claim-that-requeue-true-is-immediate](controller-runtime-issue-808-is-a-documentation-request-and-does-not-claim-that-requeue-true-is-immediate.md)). The deprecation came from pull request 3107 on 2025-02-24 ([examples/controller-runtime-pull-request-3107-deprecated-requeue-true-on-2025-02-24-and-pull-request-3574-to-document-it-is-still-open](../examples/controller-runtime-pull-request-3107-deprecated-requeue-true-on-2025-02-24-and-pull-request-3574-to-document-it-is-still-open.md)). [sources/research-gap-b1-recheck-flux-k8s](../sources/research-gap-b1-recheck-flux-k8s.md)

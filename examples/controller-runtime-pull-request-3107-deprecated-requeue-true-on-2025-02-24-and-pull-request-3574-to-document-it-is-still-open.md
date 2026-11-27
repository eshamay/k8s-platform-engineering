---
title: "controller-runtime pull request 3107 deprecated Requeue true on 2025-02-24, and pull request 3574 to document it is still open"
type: example
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-b1-recheck-flux-k8s
    hash: c78dc9a9635e
    ingested: 2026-11-26
aliases: [controller-runtime PR 3107, controller-runtime PR 3574]
tags: [controller-runtime, requeue, deprecation, backoff, pr-3107, pr-3574, issue-808]
---

# controller-runtime pull request 3107 deprecated Requeue true on 2025-02-24, and pull request 3574 to document it is still open

## Scenario

controller-runtime's `reconcile.Result` has had a `Requeue` boolean since early versions, and authors could not tell from its documentation whether it backed off. This example follows how the project handled that confusion, from the 2019 and 2020 issues to the 2025 deprecation and a still-open documentation pull request. [sources/research-gap-b1-recheck-flux-k8s](../sources/research-gap-b1-recheck-flux-k8s.md)

## Timeline

- **2019-09-30:** Issue 617 describes the logic of the time: "If `result.Requeue` is `true` then the request is added to the queue with the same exponential backoff logic used when an error is returned". Source at v0.4.0, v0.7.0, and v0.15.0 calls `c.Queue.AddRateLimited(req)` for `result.Requeue`. https://github.com/kubernetes-sigs/controller-runtime/issues/617
- **2020-02-20:** Issue 808, "Document ways to trigger/not trigger exponential backoff", is opened. It is still open, and all 13 comments say how to enter the backoff loop (return an error) and how to set the rate limiter, and none claims an immediate requeue. See [findings/controller-runtime-issue-808-is-a-documentation-request-and-does-not-claim-that-requeue-true-is-immediate](../findings/controller-runtime-issue-808-is-a-documentation-request-and-does-not-claim-that-requeue-true-is-immediate.md).
- **2025-02-24:** Pull request 3107 merges and deprecates the field with the rationale "There is no good reason to use this setting, either an error or `RequeueAfter` should be used instead." https://github.com/kubernetes-sigs/controller-runtime/pull/3107
- **State at 2026-11-26:** The current `Result` documentation says `Requeue` "tells the Controller to perform a ratelimited requeue using the workqueues ratelimiter" and is deprecated in favor of `RequeueAfter`. Pull request 3574, whose body says "Fixes #808", would document requeue and backoff behavior in the godoc, and it is open and unmerged. https://github.com/kubernetes-sigs/controller-runtime/pull/3574

## What it shows

The deprecation changed the guidance and not the behavior: `Requeue: true` still backs off, and the project chose to steer authors to an error for failures and to `RequeueAfter` for planned revisits. The documentation gap that issue 808 asked for in 2020 was still being addressed by an open pull request in November 2026. See [findings/a-requeue-true-result-backs-off-exponentially-because-only-requeueafter-forgets-the-failure-history](../findings/a-requeue-true-result-backs-off-exponentially-because-only-requeueafter-forgets-the-failure-history.md) and [decisions/choose-error-requeueafter-or-terminalerror-in-a-reconciler](../decisions/choose-error-requeueafter-or-terminalerror-in-a-reconciler.md).

## Related

[findings/the-requeue-true-result-is-deprecated-and-described-inconsistently](../findings/the-requeue-true-result-is-deprecated-and-described-inconsistently.md), [entities/controller-runtime](../entities/controller-runtime.md), [concepts/reconciliation-loop](../concepts/reconciliation-loop.md)

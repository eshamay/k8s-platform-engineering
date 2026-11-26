---
title: "controller-runtime issue 808 is a documentation request and does not claim that Requeue true is immediate"
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-b1-recheck-flux-k8s
    hash: c78dc9a9635e
    ingested: 2026-11-26
aliases: [issue 808 does not say immediate, origin of the immediate requeue claim]
tags: [controller-runtime, requeue, backoff, provenance, source-quality, verified]
---

# controller-runtime issue 808 is a documentation request and does not claim that Requeue true is immediate

## Observation

An earlier wiki source read a summary of controller-runtime issue 808 as saying that `Result{Requeue: true}` requeues immediately without backoff. The issue does not say that. Issue 808, "Document ways to trigger/not trigger exponential backoff", was opened on 2020-02-20, is still open, and has 13 comments, all of which the dossier read. It is a request for documentation. The commenters say that "Today, you only need to return an error to make it go in exponential backoff loop" (vincepri), that the rate limiter can be set through controller options (djzager), and a later commenter links Daniel Mangum's blog post on controller-runtime rate limiting. The word "immediate" does not appear in the thread, and no comment makes a statement about `Requeue` beyond the opening reference to requeue and backoff documentation. [[sources/research-gap-b1-recheck-flux-k8s]] https://github.com/kubernetes-sigs/controller-runtime/issues/808

## What the primary text says instead

Issue 617 (opened 2019-09-30) states the logic at that time: "If `result.Requeue` is `true` then the request is added to the queue with the same exponential backoff logic used when an error is returned". The source agrees at three tags: v0.4.0, v0.7.0, and v0.15.0 all call `c.Queue.AddRateLimited(req)` for `result.Requeue`. The current `Result` documentation says `Requeue` "tells the Controller to perform a ratelimited requeue using the workqueues ratelimiter", and it is deprecated in favor of `RequeueAfter` through [[examples/controller-runtime-pull-request-3107-deprecated-requeue-true-on-2025-02-24-and-pull-request-3574-to-document-it-is-still-open]].

## What remains unknown

The origin of the "immediate requeue" reading was not found. The dossier searched the issue 808 comments, issue 617, issue search for "Requeue immediately" and "Requeue backoff Result", and pull request search for "Deprecate Requeue", and the web search tool returned no results. The reading may have come from a model-generated summary, but that is not established. The wiki should treat it as an unsupported claim with no known primary source.

## Why it matters

A source-quality lesson follows. The conflict recorded in [[findings/the-requeue-true-result-is-deprecated-and-described-inconsistently]] was created by a summary and not by two primary sources disagreeing. When a summary and the source code disagree, read the thread. The behavior itself is settled in [[findings/a-requeue-true-result-backs-off-exponentially-because-only-requeueafter-forgets-the-failure-history]].

## Related

[[entities/controller-runtime]], [[decisions/choose-error-requeueafter-or-terminalerror-in-a-reconciler]], [[concepts/reconciliation-loop]]

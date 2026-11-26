---
title: The default workqueue rate limiter differs between client-go and controller-runtime
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-g3-scale-recheck
    hash: d9bd6911bff7
    ingested: 2026-11-26
aliases: []
tags: [workqueue, rate-limiter, client-go, controller-runtime, defaults]
---

# The default workqueue rate limiter differs between client-go and controller-runtime

## Observation

In client-go, `DefaultTypedControllerRateLimiter` is the maximum of two limiters: a per-item exponential failure limiter with a 5 ms base and a 1000 s cap, and a bucket limiter at 10 qps with a burst of 100. The source comment says the bucket is "only for retry speed and its only the overall factor (not per item)". https://github.com/kubernetes/client-go/blob/master/util/workqueue/default_rate_limiters.go

controller-runtime does not always use that default. In the version read, `pkg/controller/controller.go` on main builds only `NewTypedItemExponentialFailureRateLimiter` with the same 5 ms and 1000 s values when its priority queue is enabled, which is the default, and falls back to the client-go default otherwise. It also sets `MaxConcurrentReconciles` to 1 by default. https://github.com/kubernetes-sigs/controller-runtime/blob/main/pkg/controller/controller.go (lines 272 to 275). An earlier citation of `pkg/internal/controller/controller.go` was wrong, since that file does not contain this code. [[sources/research-gap-g3-scale-recheck]]

## Why it matters

Documentation and blog posts often describe "the default workqueue limiter" as exponential backoff plus a token bucket. That is true for client-go, but a controller-runtime controller with the priority queue on has no overall bucket, so a burst of failing keys is limited only by per-item backoff and worker count. Anyone tuning retry throughput should check which path their controller takes.

## Related pages

[[entities/controller-runtime]], [[entities/client-go]], [[concepts/informers-reflectors-and-workqueues]], [[findings/a-requeue-true-result-backs-off-exponentially-because-only-requeueafter-forgets-the-failure-history]].

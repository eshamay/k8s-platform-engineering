---
title: kro v0.10.0 requeues an unready instance with per-instance exponential backoff capped at five minutes while v0.9.4 has no backoff package
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-b1-recheck-kro-crossplane
    hash: ccee0efa5bdd
    ingested: 2026-11-26
aliases: []
tags: [kro, requeue, backoff, tuning, version-difference]
---

# kro v0.10.0 requeues an unready instance with per-instance exponential backoff capped at five minutes while v0.9.4 has no backoff package

## Observation

At v0.10.0 the kro instance controller seeds a `backoff.Tracker` from the `instance-requeue-interval` flag, which defaults to 3 seconds. The tracker doubles the delay on every attempt (factor 2), caps it at five minutes, and resets after a clean reconcile. The code comment on the cap reads "Max caps the requeue delay for a persistently not-ready object. Max = 5 * time.Minute". The v0.9.4 tree has no `pkg/controller/backoff` package, so an instance that is waiting for cluster state at v0.9.4 requeues at the fixed interval. The flag help text still says "Fixed delay" at v0.10.0, so the help text is stale there. [sources/research-gap-b1-recheck-kro-crossplane](../sources/research-gap-b1-recheck-kro-crossplane.md) URL: https://github.com/kubernetes-sigs/kro/blob/v0.10.0/pkg/controller/backoff/backoff.go

The shared dynamic controller queue is a separate mechanism and did not change. It is a `MaxOf` rate limiter that combines a per-item exponential failure limiter (200 ms to 1000 s) with a token bucket (10 per second, burst 100), and the code is identical at v0.9.4 and v0.10.0. All other defaults read in `cmd/controller/main.go` are the same at both tags. The only additions at v0.10.0 are the flags `watch-sync-timeout` (30 s), `graph-concurrent-reconciles` (1), `apply-concurrency` (20), and `cel-cost-limit` (0, disabled).

## Why it matters

A platform team that tuned or reasoned about instance requeue on v0.9.x should not carry the same assumption to v0.10.0. A persistently not-ready instance at v0.9.4 is retried every 3 seconds without growth, while at v0.10.0 the same instance settles at one attempt per five minutes. The absence of the package is verified, and the fixed-delay behavior at v0.9.4 is an inference from that absence and the flag text, not a traced code path.

## Mitigations

State the kro version whenever a requeue interval is quoted, and read the flag help text as stale at v0.10.0. See [entities/kro](../entities/kro.md), [examples/kro-shared-queue-tunes-throughput](../examples/kro-shared-queue-tunes-throughput.md), and [comparisons/retry-and-backoff-controls-across-tools](../comparisons/retry-and-backoff-controls-across-tools.md).

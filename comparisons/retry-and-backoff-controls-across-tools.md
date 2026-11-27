---
title: Retry and backoff controls across tools
type: comparison
status: draft
created: 2026-11-25
updated: 2026-11-26
sources:
  - id: research-gap-b1-recheck-kro-crossplane
    hash: ccee0efa5bdd
    ingested: 2026-11-26
  - id: research-eventual-consistency-and-convergence
    hash: bb35eafbd239
    ingested: 2026-11-25
  - id: research-reconciliation-loop
    hash: df7d66206baf
    ingested: 2026-11-25
  - id: research-idempotency
    hash: 4704ffd77903
    ingested: 2026-11-25
  - id: research-gap-g3-kro
    hash: e8d7c5923d98
    ingested: 2026-11-26
aliases: []
tags: [comparison, retries, backoff, convergence]
---

# Retry and backoff controls across tools

The values below are as stated on the fetched pages, and the kro values first came from unreleased "next" documentation. The released v0.10.0 tuning page repeats the retry and backoff values (correction note), and says the instance requeue interval is 3 seconds with exponential backoff capped at five minutes. [sources/research-gap-g3-kro](../sources/research-gap-g3-kro.md) [sources/research-eventual-consistency-and-convergence](../sources/research-eventual-consistency-and-convergence.md)

| Behavior | [entities/flux](../entities/flux.md) | [entities/argo-cd](../entities/argo-cd.md) | [entities/crossplane](../entities/crossplane.md) | [entities/kro](../entities/kro.md) | [entities/controller-runtime](../entities/controller-runtime.md) |
|---|---|---|---|---|---|
| Failure retry | `retryInterval`, separate from `interval` | Configurable exponential backoff, unlimited retries allowed | Providers back off on errors, values not stated | Exponential backoff 200ms to 1000s plus token bucket 10/s burst 100 | Exponential backoff on non-nil error |
| Retry cap | Not described | Configurable | Not described | 20 retries, then the item is dropped | `TerminalError` stops retries |
| Same-input failure | Retries on `retryInterval` | Does not re-sync the same commit and parameters unless self-heal is on | Not described | Not described | Not described |
| Waiting state | `wait` and `healthChecks` | Waves wait for Healthy | Ready from function pipeline | Not described | `RequeueAfter` |
| Ordering | `dependsOn` | Phase, wave, kind, name | Composition function readiness | Not described | Not applicable |

## Reading the table

The tools disagree on who intervenes after repeated failure. Argo CD and kro eventually stop (a new commit, or a dropped item), while Flux and controller-runtime keep retrying on a schedule. The disagreement mirrors the trade-off in [findings/retry-storms-and-unbounded-retries](../findings/retry-storms-and-unbounded-retries.md): unbounded retries risk amplification, and bounded retries risk silent non-convergence. See also [comparisons/reconcile-cadence-and-off-switches-across-tools](reconcile-cadence-and-off-switches-across-tools.md), [findings/errors-used-as-timers-in-reconcilers](../findings/errors-used-as-timers-in-reconcilers.md), and [findings/failure-retry-loops-and-backoff](../findings/failure-retry-loops-and-backoff.md).

## Further reading

For the load, jitter, and queue side of the same tools see [comparisons/load-and-fairness-controls-across-controller-runtime-flux-argo-cd-and-kro](load-and-fairness-controls-across-controller-runtime-flux-argo-cd-and-kro.md). The reconciliation-loop dossier confirms the Argo CD no-retry-for-the-same-commit rule and the kro 20-retry cap. [sources/research-reconciliation-loop](../sources/research-reconciliation-loop.md)

## Retry safety from the idempotency dossier

The Argo CD retry fields (`limit`, `duration`, `factor`, `maxDuration`) and Flux's `retryInterval` and jitter bound how often a retry happens, but they do not make the retried call safe. That depends on the target API being idempotent. [sources/research-idempotency](../sources/research-idempotency.md) See [findings/blind-retries-duplicate-side-effects-when-the-cloud-api-is-not-idempotent](../findings/blind-retries-duplicate-side-effects-when-the-cloud-api-is-not-idempotent.md).

## Source-code confirmation for kro (2026-11-26)

Correction note: the kro column rests on source now. The queue backoff of 200 ms to 1000 s with a token bucket of 10 per second and burst 100 is identical at v0.9.4 and v0.10.0. The instance requeue was a fixed 3 second delay at v0.9.4 and is a per-instance exponential backoff, doubling and capped at five minutes, at v0.10.0, see [findings/kro-v0-10-0-requeues-an-unready-instance-with-per-instance-exponential-backoff-capped-at-five-minutes-while-v0-9-4-has-no-backoff-package](../findings/kro-v0-10-0-requeues-an-unready-instance-with-per-instance-exponential-backoff-capped-at-five-minutes-while-v0-9-4-has-no-backoff-package.md). [sources/research-gap-b1-recheck-kro-crossplane](../sources/research-gap-b1-recheck-kro-crossplane.md)

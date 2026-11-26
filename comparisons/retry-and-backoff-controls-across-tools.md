---
title: Retry and backoff controls across tools
type: comparison
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-eventual-consistency-and-convergence
    hash: bb35eafbd239
    ingested: 2026-11-25
  - id: research-reconciliation-loop
    hash: df7d66206baf
    ingested: 2026-11-25
  - id: research-idempotency
    hash: 4704ffd77903
    ingested: 2026-11-25
aliases: []
tags: [comparison, retries, backoff, convergence]
---

# Retry and backoff controls across tools

The values below are as stated on the fetched pages, and the kro values come from unreleased "next" documentation. [[sources/research-eventual-consistency-and-convergence]]

| Behavior | [[entities/flux]] | [[entities/argo-cd]] | [[entities/crossplane]] | [[entities/kro]] | [[entities/controller-runtime]] |
|---|---|---|---|---|---|
| Failure retry | `retryInterval`, separate from `interval` | Configurable exponential backoff, unlimited retries allowed | Providers back off on errors, values not stated | Exponential backoff 200ms to 1000s plus token bucket 10/s burst 100 | Exponential backoff on non-nil error |
| Retry cap | Not described | Configurable | Not described | 20 retries, then the item is dropped | `TerminalError` stops retries |
| Same-input failure | Retries on `retryInterval` | Does not re-sync the same commit and parameters unless self-heal is on | Not described | Not described | Not described |
| Waiting state | `wait` and `healthChecks` | Waves wait for Healthy | Ready from function pipeline | Not described | `RequeueAfter` |
| Ordering | `dependsOn` | Phase, wave, kind, name | Composition function readiness | Not described | Not applicable |

## Reading the table

The tools disagree on who intervenes after repeated failure. Argo CD and kro eventually stop (a new commit, or a dropped item), while Flux and controller-runtime keep retrying on a schedule. The disagreement mirrors the trade-off in [[findings/retry-storms-and-unbounded-retries]]: unbounded retries risk amplification, and bounded retries risk silent non-convergence. See also [[comparisons/reconcile-cadence-and-off-switches-across-tools]], [[findings/errors-used-as-timers-in-reconcilers]], and [[findings/failure-retry-loops-and-backoff]].

## Further reading

For the load, jitter, and queue side of the same tools see [[comparisons/load-and-fairness-controls-across-controller-runtime-flux-argo-cd-and-kro]]. The reconciliation-loop dossier confirms the Argo CD no-retry-for-the-same-commit rule and the kro 20-retry cap. [[sources/research-reconciliation-loop]]

## Retry safety from the idempotency dossier

The Argo CD retry fields (`limit`, `duration`, `factor`, `maxDuration`) and Flux's `retryInterval` and jitter bound how often a retry happens, but they do not make the retried call safe. That depends on the target API being idempotent. [[sources/research-idempotency]] See [[findings/blind-retries-duplicate-side-effects-when-the-cloud-api-is-not-idempotent]].

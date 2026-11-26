---
title: Retry storms and unbounded retries
type: finding
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
aliases: [Retry amplification]
tags: [pitfall, retries, backoff, postmortem]
---

# Retry storms and unbounded retries

## Observation

When a controller retries a failing write against an overloaded dependency, the retries can keep the dependency overloaded and prevent recovery. The dossier illustrates this with a secondary account of a September 2026 GitHub incident, in which a background job saturated a shared permissions database and a retry loop around token creation "kept re-sending the writes that were already failing." URL: https://www.aurorasre.ai/blog/github-retry-storm-outage-2026. [[sources/research-eventual-consistency-and-convergence]]

> [!WARNING]
> The GitHub account is a vendor blog and a secondary source, its accuracy is unverified, and it is not a Kubernetes incident. Use it only as an illustration of retry amplification and prefer GitHub's own postmortem if one is located.

## How tools bound retries

kro combines exponential backoff, a token bucket, and a cap of 20 retries. Argo CD uses configurable backoff and refuses to repeat a failed sync of the same commit and parameters. Flux separates `retryInterval` from `interval`, so a failing object is retried on its own schedule. See [[comparisons/retry-and-backoff-controls-across-tools]].

## Mitigations

The dossier's lessons are to rate-limit background work, monitor the resource that is actually consumed, and bound retries with timeouts. Jitter on intervals and backoff caps serve the same purpose inside controllers. See [[findings/failure-retry-loops-and-backoff]] and [[findings/cost-of-constant-reconciliation]].

## Related

[[concepts/eventual-consistency-and-convergence]], [[examples/kro-shared-queue-tunes-throughput]]

## Retry caps in the reconciliation-loop dossier

The dossier contrasts controller-runtime, which retries failures forever with exponential backoff unless the error is terminal, with kro, which caps retries at 20, and Argo CD, which does not retry the same commit unless configured. [[sources/research-reconciliation-loop]] See [[examples/argo-cd-does-not-retry-a-failed-sync-of-the-same-commit-unless-retry-is-configured]].

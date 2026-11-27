---
title: Retry storms and unbounded retries
type: finding
status: draft
created: 2026-11-25
updated: 2026-11-26
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
  - id: research-informers-reflectors-and-workqueues
    hash: f9de5ca73ab6
    ingested: 2026-11-25
  - id: research-gap-g1-gitops-drift-incidents
    hash: 0a1a75f3cab5
    ingested: 2026-11-26
  - id: research-gap-g1-operator-loop-failures
    hash: baca2cdf965d
    ingested: 2026-11-26
aliases: [Retry amplification]
tags: [pitfall, retries, backoff, postmortem]
---

# Retry storms and unbounded retries

## Observation

When a controller retries a failing write against an overloaded dependency, the retries can keep the dependency overloaded and prevent recovery. The dossier illustrates this with a secondary account of a September 2026 GitHub incident, in which a background job saturated a shared permissions database and a retry loop around token creation "kept re-sending the writes that were already failing." URL: https://www.aurorasre.ai/blog/github-retry-storm-outage-2026. [sources/research-eventual-consistency-and-convergence](../sources/research-eventual-consistency-and-convergence.md)

> [!WARNING]
> The GitHub account is a vendor blog and a secondary source, its accuracy is unverified, and it is not a Kubernetes incident. Use it only as an illustration of retry amplification and prefer GitHub's own postmortem if one is located.

## How tools bound retries

kro combines exponential backoff, a token bucket, and a cap of 20 retries. Argo CD uses configurable backoff and refuses to repeat a failed sync of the same commit and parameters. Flux separates `retryInterval` from `interval`, so a failing object is retried on its own schedule. See [comparisons/retry-and-backoff-controls-across-tools](../comparisons/retry-and-backoff-controls-across-tools.md).

## Mitigations

The dossier's lessons are to rate-limit background work, monitor the resource that is actually consumed, and bound retries with timeouts. Jitter on intervals and backoff caps serve the same purpose inside controllers. See [findings/failure-retry-loops-and-backoff](failure-retry-loops-and-backoff.md) and [findings/cost-of-constant-reconciliation](cost-of-constant-reconciliation.md).

## Related

[concepts/eventual-consistency-and-convergence](../concepts/eventual-consistency-and-convergence.md), [examples/kro-shared-queue-tunes-throughput](../examples/kro-shared-queue-tunes-throughput.md)

## Retry caps in the reconciliation-loop dossier

The dossier contrasts controller-runtime, which retries failures forever with exponential backoff unless the error is terminal, with kro, which caps retries at 20, and Argo CD, which does not retry the same commit unless configured. [sources/research-reconciliation-loop](../sources/research-reconciliation-loop.md) See [examples/argo-cd-does-not-retry-a-failed-sync-of-the-same-commit-unless-retry-is-configured](../examples/argo-cd-does-not-retry-a-failed-sync-of-the-same-commit-unless-retry-is-configured.md).

## Idempotency of the retried call

The AWS Builders' Library article adds that blind retry is safe only when the target API is idempotent, and that Flux jitter and `retryInterval` and Argo CD's `maxDuration` cap address load and not duplicate side effects. [sources/research-idempotency](../sources/research-idempotency.md) See [findings/blind-retries-duplicate-side-effects-when-the-cloud-api-is-not-idempotent](blind-retries-duplicate-side-effects-when-the-cloud-api-is-not-idempotent.md).

## The default workqueue limiter

The rate-limiting walkthrough explains why the default limiter pairs per-item exponential backoff with an overall token bucket: without the bucket, thousands of failing objects could produce tens of thousands of requeues per second, and synchronized backoff creates thundering herds. The default may not fit controllers that share an external API. [sources/research-informers-reflectors-and-workqueues](../sources/research-informers-reflectors-and-workqueues.md) See [concepts/informers-reflectors-and-workqueues](../concepts/informers-reflectors-and-workqueues.md) and [findings/skipping-done-or-forget-on-the-workqueue-leaves-items-stuck-or-retrying](skipping-done-or-forget-on-the-workqueue-leaves-items-stuck-or-retrying.md).

## Addition from the GitOps incidents dossier

The 2026-11-26 dossier searched again for a named-company primary postmortem of Kubernetes controller retry amplification or stale caches and found none. The nearest finds are an anonymous Argo CD self-heal race and k8s.af index entries that were not read, see [findings/no-named-organization-postmortem-was-found-for-a-gitops-revert-loop-a-gitops-outage-or-controller-retry-amplification](no-named-organization-postmortem-was-found-for-a-gitops-revert-loop-a-gitops-outage-or-controller-retry-amplification.md) and [sources/research-gap-g1-gitops-drift-incidents](../sources/research-gap-g1-gitops-drift-incidents.md).

## Addition from the operator loop dossier

The 2026-11-26 operator dossier adds a controller-side retry case, Longhorn issue 14121, where retries against an unreachable backup target grew the controller's own memory about 25 times. It is an issue-level report with self-reported figures and not a named-company postmortem of retry amplification across services. See [examples/longhorn-issue-14121-a-backup-target-outage-grew-longhorn-manager-memory-about-25-fold](../examples/longhorn-issue-14121-a-backup-target-outage-grew-longhorn-manager-memory-about-25-fold.md) and [sources/research-gap-g1-operator-loop-failures](../sources/research-gap-g1-operator-loop-failures.md).

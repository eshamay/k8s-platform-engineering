---
title: Failure retry loops and backoff
type: finding
status: active
created: 2026-11-25
updated: 2026-11-26
sources:
  - id: research-level-triggered-vs-edge-triggered
    hash: 27a34aa0de59
    ingested: 2026-11-25
  - id: research-eventual-consistency-and-convergence
    hash: bb35eafbd239
    ingested: 2026-11-25
  - id: research-gap-g1-operator-loop-failures
    hash: baca2cdf965d
    ingested: 2026-11-26
aliases: []
tags: [pitfall, retries, backoff, level-triggered]
---

# Failure retry loops and backoff

## Observation

A reconcile that always fails retries forever, because the level-triggered model has no notion of giving up. Tools bound this behavior in different ways. controller-runtime requeues a non-nil error with exponential backoff, and a `TerminalError` stops the retries. Argo CD does not retry a failed automated sync of the same commit and parameters. Config Connector caps its exponential backoff at two minutes, and exposes an annotation to cap it lower. Flux has a separate `retryInterval` for failures. [sources/research-level-triggered-vs-edge-triggered](../sources/research-level-triggered-vs-edge-triggered.md)

## Interpretation

Permanent errors, such as an invalid spec, should be marked terminal so they stop consuming reconciles, while transient errors should retry with backoff so a recovering dependency is not overwhelmed. Argo CD's refusal to retry the same commit shows the opposite design choice, where a human must push a new revision.

## Mitigations

Return terminal errors for unfixable input, surface failure through [concepts/conditions](../concepts/conditions.md), and tune retry caps for external APIs with quotas. See [findings/cost-of-constant-reconciliation](cost-of-constant-reconciliation.md).

## Bounded retries in the convergence dossier

kro caps retries at 20, Argo CD will not repeat a failed sync of the same commit, and a secondary GitHub account shows what unbounded retries can do to a struggling dependency. [sources/research-eventual-consistency-and-convergence](../sources/research-eventual-consistency-and-convergence.md) See [findings/retry-storms-and-unbounded-retries](retry-storms-and-unbounded-retries.md) and [comparisons/retry-and-backoff-controls-across-tools](../comparisons/retry-and-backoff-controls-across-tools.md).

## Related

[entities/controller-runtime](../entities/controller-runtime.md), [concepts/eventual-consistency-and-convergence](../concepts/eventual-consistency-and-convergence.md), [comparisons/reconcile-cadence-and-off-switches-across-tools](../comparisons/reconcile-cadence-and-off-switches-across-tools.md)

## Memory cost of an unbounded retry in Longhorn

Longhorn issue 14121 reports that retries against a dead S3 backup target with no backoff or target-health gate grew `longhorn-manager` memory about 25 times and led to OOM kills and node flaps. The figures and diagnosis are the reporter's, and the issue was open when read. See [findings/a-retry-loop-with-no-backoff-or-target-health-gate-grows-controller-memory-during-a-dependency-outage](a-retry-loop-with-no-backoff-or-target-health-gate-grows-controller-memory-during-a-dependency-outage.md). Source: [sources/research-gap-g1-operator-loop-failures](../sources/research-gap-g1-operator-loop-failures.md).

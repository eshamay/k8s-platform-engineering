---
title: Failure retry loops and backoff
type: finding
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-level-triggered-vs-edge-triggered
    hash: 27a34aa0de59
    ingested: 2026-11-25
aliases: []
tags: [pitfall, retries, backoff, level-triggered]
---

# Failure retry loops and backoff

## Observation

A reconcile that always fails retries forever, because the level-triggered model has no notion of giving up. Tools bound this behavior in different ways. controller-runtime requeues a non-nil error with exponential backoff, and a `TerminalError` stops the retries. Argo CD does not retry a failed automated sync of the same commit and parameters. Config Connector caps its exponential backoff at two minutes, and exposes an annotation to cap it lower. Flux has a separate `retryInterval` for failures. [[sources/research-level-triggered-vs-edge-triggered]]

## Interpretation

Permanent errors, such as an invalid spec, should be marked terminal so they stop consuming reconciles, while transient errors should retry with backoff so a recovering dependency is not overwhelmed. Argo CD's refusal to retry the same commit shows the opposite design choice, where a human must push a new revision.

## Mitigations

Return terminal errors for unfixable input, surface failure through [[concepts/conditions]], and tune retry caps for external APIs with quotas. See [[findings/cost-of-constant-reconciliation]].

## Related

[[entities/controller-runtime]], [[concepts/eventual-consistency-and-convergence]], [[comparisons/reconcile-cadence-and-off-switches-across-tools]]

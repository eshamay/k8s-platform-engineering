---
title: A status patch or update on every pass keeps a controller in a self-sustaining reconcile loop
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-g1-operator-loop-failures
    hash: baca2cdf965d
    ingested: 2026-11-26
aliases: [Unconditional status write loop]
tags: [reconcile-loop, hot-loop, status-writes, cluster-api, crossplane, operator-failure]
---

# A status patch or update on every pass keeps a controller in a self-sustaining reconcile loop

## Observation

Two named projects show the same mechanism. A controller writes status on every pass, with no check that the status changed, and the write produces a watch event that re-enqueues the same object. Cluster API provider RKE2 reached about 10 reconciles per second from v0.22.0, and the loop continued after the external trigger was removed ([examples/cluster-api-provider-rke2-issue-905-an-unconditional-status-patch-held-the-controller-at-about-ten-reconciles-per-second](../examples/cluster-api-provider-rke2-issue-905-an-unconditional-status-patch-held-the-controller-at-about-ten-reconciles-per-second.md)). Crossplane's CompositionRevision and composite reconcilers called `Status().Update()` on every pass, so reconcile-ordering test scenarios never converged ([examples/crossplane-issue-7221-an-unconditional-status-update-kept-reconcile-ordering-tests-from-converging](../examples/crossplane-issue-7221-an-unconditional-status-update-kept-reconcile-ordering-tests-from-converging.md)). The rates are the reporters' own. [sources/research-gap-g1-operator-loop-failures](../sources/research-gap-g1-operator-loop-failures.md)

## Interpretation

In production the rate limiter can hide the loop, which Crossplane's report says turns it into slow churn. A test tool that waits for convergence exposes it. Enabling the status subresource does not remove the cause, because the write is still a write with a new resource version.

## Mitigations

Compare the desired status with the current status and skip the write when they are equal, and use predicates that ignore status-only events on the controller's own object. See [findings/self-triggered-reconcile-loops-generate-their-own-events](self-triggered-reconcile-loops-generate-their-own-events.md) and [findings/status-writes-through-the-main-resource-retrigger-reconcile-loops](status-writes-through-the-main-resource-retrigger-reconcile-loops.md). Crossplane's fix pull request was not read, so this page does not record how it was fixed.

## Related

[concepts/reconciliation-loop](../concepts/reconciliation-loop.md), [findings/volatile-text-in-a-condition-message-defeats-the-equality-check-and-causes-a-reconcile-storm](volatile-text-in-a-condition-message-defeats-the-equality-check-and-causes-a-reconcile-storm.md), [findings/updating-lasttransitiontime-on-every-reconcile-turns-a-condition-into-a-heartbeat](updating-lasttransitiontime-on-every-reconcile-turns-a-condition-into-a-heartbeat.md), [findings/cost-of-constant-reconciliation](cost-of-constant-reconciliation.md)

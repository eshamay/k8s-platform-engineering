---
title: A Deployment progress deadline sets Progressing to False for a stalled rollout
type: example
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-conditions
    hash: 97b224c63502
    ingested: 2026-11-25
aliases: []
tags: [deployment, conditions, rollout, kubectl, built-in]
---

# A Deployment progress deadline sets Progressing to False for a stalled rollout

## Scenario

A team rolls out a new image, but the new pods never become ready. The team uses `kubectl rollout status` in a pipeline and needs the command to fail instead of waiting forever. [sources/research-conditions](../sources/research-conditions.md)

## How it works

A Deployment publishes the conditions `Progressing`, `Available`, and `ReplicaFailure`, along with an `observedGeneration`. The field `progressDeadlineSeconds` defaults to 600. When the rollout makes no progress for that long, the controller sets `Progressing=False` with reason `ProgressDeadlineExceeded`, and `kubectl rollout status` reads that condition to report failure. URL: https://kubernetes.io/docs/concepts/workloads/controllers/deployment/. The dossier read only the first 100 KB of the page.

## Lesson

The Deployment is the built-in model that the rest of the ecosystem is compared against. Its conditions describe state over time, not just binary health: a rollout can be `Available` and still `Progressing`, and a stall is an explicit condition with a reason, not merely an absence. See [examples/deployment-status-reports-ready-replicas-against-spec-replicas](deployment-status-reports-ready-replicas-against-spec-replicas.md), [concepts/conditions](../concepts/conditions.md), [concepts/spec-status-split](../concepts/spec-status-split.md), and [comparisons/health-and-readiness-models-across-tools](../comparisons/health-and-readiness-models-across-tools.md).

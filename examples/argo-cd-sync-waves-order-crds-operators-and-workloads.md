---
title: Argo CD sync waves order CRDs, operators, and workloads
type: example
status: draft
created: 2026-11-25
updated: 2026-11-26
sources:
  - id: medium-config-connector-pitfalls
    hash: c5b9825d753a
    ingested: 2026-11-26
  - id: research-eventual-consistency-and-convergence
    hash: bb35eafbd239
    ingested: 2026-11-25
aliases: []
tags: [argo-cd, gitops, sync-waves, self-heal]
---

# Argo CD sync waves order CRDs, operators, and workloads

## Scenario

An engineer hand-edits a live Deployment, and separately a team needs CRDs applied before the operators that use them, and operators before the workloads they manage. The dossier uses Argo CD for both situations. [sources/research-eventual-consistency-and-convergence](../sources/research-eventual-consistency-and-convergence.md)

## Self-heal

With automated sync and self-heal enabled, Argo CD notices that live state has diverged from Git and syncs again, with a default delay of about 5 seconds. Prune is off by default as a safety measure. If a sync fails, Argo CD does not re-sync the same commit and parameters unless self-heal is on, which avoids a tight failure loop. URL: https://argo-cd.readthedocs.io/en/stable/user-guide/auto_sync/.

## Waves and hooks

Ordering is phase, then wave, then kind, then name. Each wave must become Healthy before the next one starts, with a short pause between waves so controllers can react. Hooks run on every sync and therefore must be idempotent, and a failed PreSync hook stops the whole sync and marks it failed. URL: https://argo-cd.readthedocs.io/en/stable/user-guide/sync-waves/.

## Lesson

Waves are how a GitOps tool imposes order on a cluster that otherwise converges concurrently. The price is that hooks and waves require idempotent operations. See [entities/argo-cd](../entities/argo-cd.md), [findings/ordering-and-dependency-failures](../findings/ordering-and-dependency-failures.md), [examples/gitops-reverts-a-hand-edited-deployment](gitops-reverts-a-hand-edited-deployment.md), and [comparisons/ordering-models-flux-argo-cd-kro-crossplane](../comparisons/ordering-models-flux-argo-cd-kro-crossplane.md).

## A practitioner's use of waves for Config Connector

A 2023 Medium post uses sync-wave annotations to order Config Connector resources, the BigQuery dataset at `-1` and its table at `0`, because the table cannot be created until the dataset exists, and says waves fix creation but Argo CD has no deletion ordering for the same pair. See [examples/a-practitioner-ran-a-cronjob-that-removed-finalizers-from-config-connector-bigquery-tables-whose-dataset-was-deleted-first](a-practitioner-ran-a-cronjob-that-removed-finalizers-from-config-connector-bigquery-tables-whose-dataset-was-deleted-first.md). [sources/medium-config-connector-pitfalls](../sources/medium-config-connector-pitfalls.md)

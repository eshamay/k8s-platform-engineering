---
title: Argo CD sync waves order CRDs, operators, and workloads
type: example
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-eventual-consistency-and-convergence
    hash: bb35eafbd239
    ingested: 2026-11-25
aliases: []
tags: [argo-cd, gitops, sync-waves, self-heal]
---

# Argo CD sync waves order CRDs, operators, and workloads

## Scenario

An engineer hand-edits a live Deployment, and separately a team needs CRDs applied before the operators that use them, and operators before the workloads they manage. The dossier uses Argo CD for both situations. [[sources/research-eventual-consistency-and-convergence]]

## Self-heal

With automated sync and self-heal enabled, Argo CD notices that live state has diverged from Git and syncs again, with a default delay of about 5 seconds. Prune is off by default as a safety measure. If a sync fails, Argo CD does not re-sync the same commit and parameters unless self-heal is on, which avoids a tight failure loop. URL: https://argo-cd.readthedocs.io/en/stable/user-guide/auto_sync/.

## Waves and hooks

Ordering is phase, then wave, then kind, then name. Each wave must become Healthy before the next one starts, with a short pause between waves so controllers can react. Hooks run on every sync and therefore must be idempotent, and a failed PreSync hook stops the whole sync and marks it failed. URL: https://argo-cd.readthedocs.io/en/stable/user-guide/sync-waves/.

## Lesson

Waves are how a GitOps tool imposes order on a cluster that otherwise converges concurrently. The price is that hooks and waves require idempotent operations. See [[entities/argo-cd]], [[findings/ordering-and-dependency-failures]], [[examples/gitops-reverts-a-hand-edited-deployment]], and [[comparisons/ordering-models-flux-argo-cd-kro-crossplane]].

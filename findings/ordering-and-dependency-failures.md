---
title: Ordering and dependency failures
type: finding
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-universal-control-plane
    hash: 037575049a4c
    ingested: 2026-11-25
aliases: []
tags: [pitfall, ordering, dependencies]
---

# Ordering and dependency failures

## Observation

CRDs and their controllers must exist before the custom resources that use them, and dependencies must be ready before dependents. Each stack handles this differently, and each has failure modes. [[sources/research-universal-control-plane]]

- [[entities/flux]] uses `dependsOn` plus health checks between Kustomizations, and it requires CRDs and controllers to be reconciled first.
- [[entities/argo-cd]] uses phases and waves with health gating. PreSync hooks can run before the ConfigMaps or Secrets they need, hooks run every sync so they must be idempotent, and long migrations can time out while still running.
- [[entities/kro]] derives ordering from references between resources in its graph, although the dossier could not see the mechanics.
- [[entities/crossplane]] functions see observed state each loop and can withhold dependent resources until they are ready.

## Why it matters

Because the system is eventually consistent (see [[concepts/eventual-consistency-and-convergence]]), many ordering errors resolve themselves through retries, but a wave-based or hook-based tool can instead stop and mark the sync failed. See [[comparisons/ordering-models-flux-argo-cd-kro-crossplane]].

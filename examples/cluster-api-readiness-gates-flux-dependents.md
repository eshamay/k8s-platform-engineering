---
title: Cluster API readiness gates Flux dependents
type: example
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-spec-status-split
    hash: 598e6132ea4f
    ingested: 2026-11-25
aliases: []
tags: [cluster-api, flux, kstatus, ordering]
---

# Cluster API readiness gates Flux dependents

## Scenario

Flux can hold back dependent Kustomizations until a Cluster API infrastructure object reports ready. That makes the status of provider objects a load-bearing input to GitOps ordering. [[sources/research-spec-status-split]]

## How it works

Flux uses kstatus to judge readiness without per-kind logic. kstatus reads `observedGeneration` and the `Ready`, `Reconciling`, and `Stalled` conditions. A Cluster API object that has `observedGeneration` set but no conditions yet can look ready right after creation, and Flux may proceed to dependents too early. An issue proposed defaulting `status.observedGeneration` to `-1`, but it was closed as not planned in May 2025, because Cluster API is moving from `Ready` to `Available` and Flux added CEL-based custom health checks for it. URL: https://github.com/kubernetes-sigs/cluster-api/issues/9299.

## Lesson

Generic readiness depends on every provider following one convention. When a project changes its condition vocabulary, the consumers need explicit per-kind checks again. See [[findings/premature-readiness-in-kstatus-based-tools]], [[entities/cluster-api]], [[entities/kstatus]], and [[examples/flux-dependson-and-health-checks-gate-rollout]].

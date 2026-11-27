---
title: Flux HelmRelease status records attempts and health
type: example
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-spec-status-split
    hash: 598e6132ea4f
    ingested: 2026-11-25
aliases: []
tags: [flux, helmrelease, conditions, audit-trail]
---

# Flux HelmRelease status records attempts and health

## Scenario

A Flux HelmRelease is a mature controller status that serves two audiences at once. People use it as an audit trail of what the controller tried, and tools use it as machine-readable health. [sources/research-spec-status-split](../sources/research-spec-status-split.md)

## How it works

The conditions are `Ready`, `Reconciling`, `Stalled`, `Released`, and `TestSuccess`. Beside them sit `observedGeneration`, failure counters, `lastAttemptedRevision`, `lastAttemptedConfigDigest`, `lastAttemptedReleaseAction`, a pointer to the generated HelmChart, and `lastHandledReconcileAt`, which answers the `reconcile.fluxcd.io/requestedAt` annotation that a user sets to request a reconcile. A reader's guide adds the interpretation rules: `Ready` is the headline, `Reconciling=True` is normal progress, `Stalled` means the release will not advance without a change, and an `observedGeneration` below `metadata.generation` means a spec change is still pending. URLs: https://fluxcd.io/flux/components/helm/helmreleases/ and https://oneuptime.com/blog/post/2026-03-05-flux-cd-ready-conditions-status/view.

## Lesson

The status never repeats the user's intent; it records what happened to that intent. Two traps remain for readers: a suspended resource keeps its last condition and can look healthy, and a chain of `DependencyNotReady` conditions points at an upstream problem. See [entities/flux](../entities/flux.md), [concepts/conditions](../concepts/conditions.md), [examples/flux-dependson-and-health-checks-gate-rollout](flux-dependson-and-health-checks-gate-rollout.md), and [comparisons/health-and-readiness-models-across-tools](../comparisons/health-and-readiness-models-across-tools.md).

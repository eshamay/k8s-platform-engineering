---
title: kstatus
type: entity
status: active
created: 2026-11-25
updated: 2026-11-26
sources:
  - id: research-spec-status-split
    hash: 598e6132ea4f
    ingested: 2026-11-25
  - id: research-conditions
    hash: 97b224c63502
    ingested: 2026-11-25
  - id: research-gap-b1-recheck-capi-argocd
    hash: 832b86e20750
    ingested: 2026-11-26
  - id: research-gap-m3-status-conditions
    hash: 07099fedb0c8
    ingested: 2026-11-26
aliases: [cli-utils kstatus]
tags: [tool, status, readiness, cli-utils]
---

# kstatus

## What it is

kstatus is a Go package in `sigs.k8s.io/cli-utils` (Kubernetes SIGs) that computes a generic status for any Kubernetes resource that follows the status conventions. Its result values are InProgress, Current, Failed, Terminating, NotFound, and Unknown. The package describes itself as containing "functionality for computing the status of Kubernetes resources". [[sources/research-spec-status-split]] URL: https://pkg.go.dev/sigs.k8s.io/cli-utils/pkg/kstatus/status.

## How it reads status

It uses `observedGeneration`, the `Ready`, `Reconciling`, and `Stalled` conditions, and an abnormal-true idea. Flux and other tools use it to decide whether a dependency is ready without per-kind logic, which is why following the conventions matters. The exact combination rules are now read from source and recorded in the m3 section below.

## Limits

kstatus can report premature readiness for a resource that has `observedGeneration` but no conditions yet, and it cannot follow a provider that replaces `Ready` with `Available`, as Cluster API is doing. See [[findings/premature-readiness-in-kstatus-based-tools]] and [[comparisons/health-and-readiness-models-across-tools]].

## Related

[[concepts/conditions]], [[concepts/spec-status-split]], [[entities/flux]], [[entities/cluster-api]]

## Conditions README details

The kstatus README computes InProgress, Failed, Current, Terminating, NotFound, and Unknown, defines `Reconciling` and `Stalled` under the abnormal-true pattern, falls back to `Ready` for other types, and lists two corner cases: a `Ready` condition that only appears once `True` is invisible, and a controller that has not yet written conditions is treated as reconciled. [[sources/research-conditions]] See [[findings/abnormal-true-polarity-makes-a-stopped-controller-look-healthy]] and [[findings/premature-readiness-in-kstatus-based-tools]].

## Unknown-kind fallback, rechecked 2026-11-26

kstatus checks deletion, generation, and the `Reconciling` and `Stalled` conditions first, then type-specific rules, and for unknown kinds looks for `Ready`. A resource without `Ready` falls back to "assume they are always reconciled". Correction note: the Limits section above says kstatus "cannot follow" a provider that replaces `Ready` with `Available`. The verified behavior is narrower. kstatus does not read `Available` at all, and whether a v1beta2 Cluster is then reported as Current is an unverified inference. See [[findings/kstatus-treats-an-unknown-kind-without-a-ready-condition-as-always-reconciled]] and [[sources/research-gap-b1-recheck-capi-argocd]].

## Combination rules read from source in the m3 dossier

`Compute` runs a fixed sequence on the default branch of cli-utils (latest release v0.37.2, 2024-07-08). A deletion timestamp gives Terminating. A mismatch between `metadata.generation` and `status.observedGeneration` gives InProgress with reason `LatestGenerationNotObserved`, and the check is skipped when the status field is absent. The conditions are then scanned in array order, where `Reconciling=True` gives InProgress and `Stalled=True` gives Failed. Built-in kinds then get type-specific rules, then a `Ready` fallback gives Current for True and InProgress for False or Unknown, and the default is Current. `Ready=False` never gives Failed. The condition struct has no `observedGeneration`, so per-condition values are ignored. Correction note: the README lists six statuses, but the Go `Statuses` slice lists five and omits NotFound. The effect that a stale top-level generation overrides `Ready=True` is an inference from code order. [[sources/research-gap-m3-status-conditions]] See [[findings/kstatus-checks-deletion-then-generation-then-reconciling-and-stalled-then-ready-so-a-stale-top-level-observedgeneration-overrides-ready-true]], [[findings/kstatus-reads-only-the-top-level-observedgeneration-because-its-condition-struct-has-no-per-condition-field]], [[findings/a-kstatus-resource-whose-controller-never-writes-status-observedgeneration-skips-the-generation-check-and-can-read-current-early]], and [[examples/cli-utils-issue-167-a-kstatus-maintainer-said-stalled-is-not-named-failed-because-slow-and-doomed-are-hard-to-tell-apart]].

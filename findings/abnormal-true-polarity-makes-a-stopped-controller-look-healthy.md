---
title: Abnormal-true polarity makes a stopped controller look healthy
type: finding
status: active
created: 2026-11-25
updated: 2026-11-26
sources:
  - id: research-conditions
    hash: 97b224c63502
    ingested: 2026-11-25
  - id: research-gap-m3-status-conditions
    hash: 07099fedb0c8
    ingested: 2026-11-26
aliases: []
tags: [pitfall, kstatus, conditions, polarity, observedgeneration]
---

# Abnormal-true polarity makes a stopped controller look healthy

## Observation

The kstatus library defines the standard `Reconciling` and `Stalled` conditions under an abnormal-true pattern, where a condition is present and `True` only when something is wrong or in flight. Under that pattern the absence of problem conditions looks healthy, so a controller that is not running, or that is lagging, looks the same as a healthy one. The kstatus README says so directly: "If the controller is not running... it will look like it is in a good state when that is not true." [[sources/research-conditions]] URL: https://github.com/kubernetes-sigs/cli-utils/blob/master/pkg/kstatus/README.md.

## Why it matters

Readiness decisions for GitOps ordering rest on this inference. Positive `Ready` conditions avoid some of the ambiguity, but a `Ready=False` cannot say whether the object is progressing or doomed, which is why kstatus pairs them with `Reconciling` and `Stalled`. The kstatus README also lists two corners: a `Ready` condition that only appears once it is `True` is invisible, and a controller that has not yet written conditions is treated as reconciled.

## Mitigations

Compare `observedGeneration` with `metadata.generation`, which breaks the ambiguity because a stopped controller stops advancing the observed value. Write an initial `Unknown` condition when a controller first sees an object, as the API conventions advise. See [[findings/premature-readiness-in-kstatus-based-tools]], [[findings/missing-observedgeneration-hides-stale-status]], [[entities/kstatus]], and [[decisions/choose-abnormal-true-or-positive-polarity-for-new-condition-types]].

## Verified against the kstatus source

The README's stated cover, comparing top-level `observedGeneration`, is implemented ahead of the condition checks in `Compute`, so a stale top-level value yields InProgress even beside `Ready=True`. That effect is read from code order. It does not help when the controller never writes the field. Flux recommends `Stalled` and `Reconciling` precisely so observers do not depend on a timeout. [[sources/research-gap-m3-status-conditions]] See [[findings/kstatus-checks-deletion-then-generation-then-reconciling-and-stalled-then-ready-so-a-stale-top-level-observedgeneration-overrides-ready-true]], [[findings/a-kstatus-resource-whose-controller-never-writes-status-observedgeneration-skips-the-generation-check-and-can-read-current-early]], and [[findings/the-kubernetes-api-conventions-recommended-abnormal-true-then-positive-polarity-and-since-june-2020-recommend-neither]].

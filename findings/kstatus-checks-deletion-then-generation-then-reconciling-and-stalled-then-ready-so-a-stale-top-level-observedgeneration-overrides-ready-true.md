---
title: kstatus checks deletion, then generation, then Reconciling and Stalled, then Ready, so a stale top-level observedGeneration overrides Ready=True
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-m3-status-conditions
    hash: 07099fedb0c8
    ingested: 2026-11-26
aliases: [kstatus evaluation order]
tags: [kstatus, conditions, observedgeneration, readiness, verified]
---

# kstatus checks deletion, then generation, then Reconciling and Stalled, then Ready, so a stale top-level observedGeneration overrides Ready=True

## Observation

The `Compute` function in the kstatus package of cli-utils evaluates a resource in a fixed order. It first checks whether a deletion timestamp is set, which gives Terminating. It then compares `metadata.generation` with `status.observedGeneration`, and a mismatch gives InProgress with the synthetic reason `LatestGenerationNotObserved`. Next it scans the conditions in array order, where `Reconciling=True` gives InProgress and `Stalled=True` gives Failed, and the first match wins. Only if none of these decides does it apply type-specific rules for built-in kinds, and then a `Ready` fallback, where True gives Current and both False and Unknown give InProgress. If nothing decides, the result is Current. [sources/research-gap-m3-status-conditions](../sources/research-gap-m3-status-conditions.md) URLs: https://github.com/kubernetes-sigs/cli-utils/blob/master/pkg/kstatus/status/status.go and https://github.com/kubernetes-sigs/cli-utils/blob/master/pkg/kstatus/status/generic.go

Two details matter for platform authors. `Ready=False` never produces Failed, because the source comment says there is no way to tell a progressing resource from a doomed one when only `Ready=False` is present. And the first-match-wins behavior for `Reconciling` and `Stalled` is read from the loop and is not stated in the documentation.

## Why it matters

Because the generation check runs before the `Ready` check, a `Ready=True` condition sitting beside a stale top-level `observedGeneration` is reported as InProgress. This is an inference from code order and not a documented rule. It means a controller that does publish the top-level field protects its consumers from stale `Ready=True`, which is the cover the kstatus README relies on for the abnormal-true pattern. See [findings/a-kstatus-resource-whose-controller-never-writes-status-observedgeneration-skips-the-generation-check-and-can-read-current-early](a-kstatus-resource-whose-controller-never-writes-status-observedgeneration-skips-the-generation-check-and-can-read-current-early.md) for the opposite case.

## Mitigations

Write the top-level `status.observedGeneration` on every reconcile, and keep `Reconciling` and `Stalled` truthful, because they outrank `Ready`. See [entities/kstatus](../entities/kstatus.md), [findings/abnormal-true-polarity-makes-a-stopped-controller-look-healthy](abnormal-true-polarity-makes-a-stopped-controller-look-healthy.md), [findings/premature-readiness-in-kstatus-based-tools](premature-readiness-in-kstatus-based-tools.md), and [concepts/conditions](../concepts/conditions.md).

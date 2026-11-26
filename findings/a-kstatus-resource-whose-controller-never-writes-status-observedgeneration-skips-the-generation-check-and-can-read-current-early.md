---
title: A kstatus resource whose controller never writes status.observedGeneration skips the generation check and can read Current early
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-m3-status-conditions
    hash: 07099fedb0c8
    ingested: 2026-11-26
aliases: [kstatus missing observedGeneration skip]
tags: [kstatus, observedgeneration, premature-readiness, pitfall, verified]
---

# A kstatus resource whose controller never writes status.observedGeneration skips the generation check and can read Current early

## Observation

In kstatus, the generic generation check runs only when both `metadata.generation` and `status.observedGeneration` exist. The source comment reads "Resource does not have this field, so we can't do this check", and an open TODO in the same file notes the unresolved difference between an unset field and a missing one. A custom resource whose controller never writes `status.observedGeneration` therefore skips the check, falls through to the condition rules, and, if no `Reconciling`, `Stalled`, or `Ready` condition has been written yet, is reported as Current by the final default. [[sources/research-gap-m3-status-conditions]] URL: https://github.com/kubernetes-sigs/cli-utils/blob/master/pkg/kstatus/status/generic.go

For built-in kinds the code is stricter. A helper in `core.go` returns InProgress with reason `NoObservedGeneration` when `status.observedGeneration` is missing, but the generic path used for custom resources has no such guard. URL: https://github.com/kubernetes-sigs/cli-utils/blob/master/pkg/kstatus/status/core.go

## Why it matters

This is the code-level mechanism behind the premature-readiness window that the kstatus README lists as a corner case: a library that sees a resource before its controller has written conditions treats it as reconciled. The window is closed only if the controller writes the top-level field early. The effect on a given tool is an inference from code, and no source reports a specific incident for this exact path.

## Mitigations

Write `status.observedGeneration` and an initial `Unknown` condition on the first visit. Where a consumer cannot rely on that, use a per-kind CEL or Lua health check. See [[findings/premature-readiness-in-kstatus-based-tools]], [[findings/kstatus-checks-deletion-then-generation-then-reconciling-and-stalled-then-ready-so-a-stale-top-level-observedgeneration-overrides-ready-true]], [[findings/missing-observedgeneration-hides-stale-status]], and [[entities/kstatus]].

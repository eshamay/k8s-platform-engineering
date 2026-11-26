---
title: CloudNativePG issue 11390 kubectl wait for Ready can return on a condition produced before the spec change
type: example
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-g1-operator-loop-failures
    hash: baca2cdf965d
    ingested: 2026-11-26
aliases: [CloudNativePG issue 11390]
tags: [cloudnativepg, observedgeneration, readiness, kubectl-wait, status]
---

# CloudNativePG issue 11390 kubectl wait for Ready can return on a condition produced before the spec change

## Scenario

On 2026-09-01 a reporter, GellertBabel, filed issue 11390 against CloudNativePG 1.30.0, using a kind cluster on Kubernetes 1.36. The issue was open when the dossier read it, so no fix is known. [[sources/research-gap-g1-operator-loop-failures]] URL: https://github.com/cloudnative-pg/cloudnative-pg/issues/11390

## What happened

After patching `spec.instances`, `kubectl wait --for=condition=Ready` returned immediately. The Ready condition it saw had been produced before the change, and `Cluster.status` has no field that tells a consumer which generation the condition describes. The reporter writes "I can get Ready=True that was produced before my change was ever looked at." The reporter saw intermittent CI assertion failures as a result.

## Why it belongs here

It shows the consumer side of a missing `observedGeneration`: scripts and CI that gate on a Ready condition cannot be made reliable without the field. See [[findings/ready-can-be-reported-for-a-spec-generation-the-controller-has-not-yet-observed]].

## Related

[[findings/missing-observedgeneration-hides-stale-status]], [[concepts/conditions]], [[concepts/spec-status-split]]

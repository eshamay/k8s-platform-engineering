---
title: restate-operator issue 216 Ready True before a StatefulSet rollout finished let Flux mark the release healthy
type: example
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-g1-operator-loop-failures
    hash: baca2cdf965d
    ingested: 2026-11-26
aliases: [restate-operator issue 216]
tags: [restate, flux, readiness, observedgeneration, statefulset, status]
---

# restate-operator issue 216 Ready True before a StatefulSet rollout finished let Flux mark the release healthy

## Scenario

On 2026-10-12 a reporter, we2beast, filed issue 216 against restate-operator 3.1.0. The issue was open when the dossier read it. [sources/research-gap-g1-operator-loop-failures](../sources/research-gap-g1-operator-loop-failures.md) URL: https://github.com/restatedev/restate-operator/issues/216

## What happened

A RestateCluster reported Ready=True before its StatefulSet rollout had finished, and the report notes that "`RestateClusterStatus` also has no `observedGeneration`." Flux with `wait: true` marked the release healthy at 14:16:53, about 37 seconds before the last pod became Ready. The timing is self-reported.

## Why it belongs here

It connects a missing `observedGeneration` to a concrete delivery-tool consequence, a health-gated Flux release that proceeds early. See [findings/ready-can-be-reported-for-a-spec-generation-the-controller-has-not-yet-observed](../findings/ready-can-be-reported-for-a-spec-generation-the-controller-has-not-yet-observed.md).

## Related

[findings/premature-readiness-in-kstatus-based-tools](../findings/premature-readiness-in-kstatus-based-tools.md), [entities/flux](../entities/flux.md), [examples/flux-dependson-and-health-checks-gate-rollout](flux-dependson-and-health-checks-gate-rollout.md)

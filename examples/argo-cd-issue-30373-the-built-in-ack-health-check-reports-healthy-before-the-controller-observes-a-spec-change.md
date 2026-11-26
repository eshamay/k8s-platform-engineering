---
title: Argo CD issue 30373 the built-in ACK health check reports Healthy before the controller observes a spec change
type: example
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-g1-operator-loop-failures
    hash: baca2cdf965d
    ingested: 2026-11-26
aliases: [Argo CD issue 30373]
tags: [argo-cd, ack, observedgeneration, health-check, status]
---

# Argo CD issue 30373 the built-in ACK health check reports Healthy before the controller observes a spec change

## Scenario

On 2026-10-23 a reporter filed Argo CD issue 30373 about the built-in ACK health check that was added in v3.6.0-rc1. The reporter used iam-controller v1.10.1 on EKS 1.35, and the issue was open when read. [[sources/research-gap-g1-operator-loop-failures]] URL: https://github.com/argoproj/argo-cd/issues/30373

## What happened

The health check reports Healthy before the ACK controller has observed a spec change, because "ACK resources have no `observedGeneration`". The reporter's watch shows the conditions unchanged while the generation moved from 2 to 3, until the controller re-stamped them about 2 seconds later. The reporter adds that ACK's `observedGeneration` issue 1583 has been open since 2022. That last statement is SECONDARY-ONLY, because the 2022 issue was not read here, although [[findings/missing-observedgeneration-hides-stale-status]] already records issue 1583 from an earlier dossier.

## Why it belongs here

It is the delivery-tool consequence of a gap the wiki had recorded only at the ACK side, now with a dated timeline. See [[findings/ready-can-be-reported-for-a-spec-generation-the-controller-has-not-yet-observed]].

## Related

[[entities/ack]], [[entities/argo-cd]], [[findings/generic-gitops-agents-cannot-judge-custom-resource-health]]

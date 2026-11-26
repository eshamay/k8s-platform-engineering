---
title: Flux stamps the current generation on every condition and also keeps a top-level observedGeneration
type: example
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-m3-status-conditions
    hash: 07099fedb0c8
    ingested: 2026-11-26
aliases: [Flux observedGeneration practice]
tags: [flux, conditions, observedgeneration, polarity, kstatus]
---

# Flux stamps the current generation on every condition and also keeps a top-level observedGeneration

## Scenario

Flux controllers publish status that both humans and generic tools read, including kstatus-based waiters. The Flux runtime library therefore has to satisfy the Kubernetes convention of a per-condition `observedGeneration` and the kstatus habit of reading only the top-level field. [[sources/research-gap-m3-status-conditions]]

## How it works

Flux's condition setter always stamps `condition.ObservedGeneration = to.GetGeneration()` on any condition it sets, with the source comment "Always set the observed generation on the condition." URL: https://github.com/fluxcd/pkg/blob/main/runtime/conditions/setter.go. The Kustomization status type also has a top-level `observedGeneration`, documented as "the last reconciled generation". URL: https://github.com/fluxcd/kustomize-controller/blob/main/api/v1/kustomization_types.go.

On polarity, Flux mixes both styles. Its constants say `Stalled` and `Reconciling` "MUST only be present on the resource if the Condition is True" (abnormal-true), recommend them so that kstatus observers "will be able to stop waiting for a change if a StalledCondition is observed, without having to rely on a timeout", and keep `Ready` positive, where `Ready=False` means the resource should be considered to be reconciling. URL: https://github.com/fluxcd/pkg/blob/main/apis/meta/conditions.go.

## Lesson

Flux is the clearest worked case of the "both" option in [[decisions/place-observedgeneration-at-the-top-level-on-each-condition-or-both]], at the cost of two places that must stay correct. It also shows the mixed-polarity option in [[decisions/choose-abnormal-true-or-positive-polarity-for-new-condition-types]]. See [[entities/flux]], [[entities/kstatus]], and [[comparisons/observedgeneration-top-level-versus-per-condition]].

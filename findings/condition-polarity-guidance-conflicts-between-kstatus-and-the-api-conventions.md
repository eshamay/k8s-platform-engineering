---
title: Condition polarity guidance conflicts between kstatus and the API conventions
type: finding
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-conditions
    hash: 97b224c63502
    ingested: 2026-11-25
aliases: []
tags: [conditions, polarity, kstatus, conventions, disputed]
---

# Condition polarity guidance conflicts between kstatus and the API conventions

## Observation

The sources the dossier read do not agree on which polarity condition authors should use. kstatus favors abnormal-true conditions (`Reconciling` and `Stalled`). The Cluster API proposal and the Kubernetes API conventions lean toward positive `Ready` and `Available`, with the conventions advising that `Ready` or `Succeeded` is preferred over `Failed`, while also noting that "A negative condition like 'MemoryExhausted' may be easier for humans to understand than 'SufficientMemory.'" The conventions leave polarity to authors. [[sources/research-conditions]] The API conventions were read only to about 100 KB, so later guidance may exist.

## Why it matters

This is a tension in the guidance, not a contradiction against an existing wiki page, and the dossier records it as unresolved. Authors who follow one source produce conditions that the other source's tooling reads poorly: kstatus expects `Reconciling` and `Stalled`, while humans and many dashboards expect a positive `Ready`. Flux publishes both styles together (`Ready` plus `Reconciling` and `Stalled`).

## Mitigations

Publish a positive summary and the kstatus pair together, as Flux does, and set `observedGeneration` so stale values can be detected. See [[decisions/choose-abnormal-true-or-positive-polarity-for-new-condition-types]], [[findings/abnormal-true-polarity-makes-a-stopped-controller-look-healthy]], [[entities/flux]], and [[entities/kstatus]].

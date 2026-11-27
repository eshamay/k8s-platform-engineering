---
title: Condition polarity guidance conflicts between kstatus and the API conventions
type: finding
status: contradicted
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
tags: [conditions, polarity, kstatus, conventions, disputed]
---

# Condition polarity guidance conflicts between kstatus and the API conventions

## Observation

The sources the dossier read do not agree on which polarity condition authors should use. kstatus favors abnormal-true conditions (`Reconciling` and `Stalled`). The Kubernetes API conventions once recommended abnormal-true, reversed to positive in February 2020, and since June 2020 say neither polarity can be recommended as a general rule. Cluster API's 2020 proposal leans positive in its suffix guidance but its text and its 2024 proposal also say neither can be recommended. The conventions also note that a negative condition may be easier for humans to understand, and that `Failed=False` can cause double-negative confusion. The conventions leave polarity to authors. [sources/research-conditions](../sources/research-conditions.md) The 2026-11-26 dossier read the conventions on the default branch and found no later guidance.

## Why it matters

This is a tension in the guidance, not a contradiction against an existing wiki page, and the dossier records it as unresolved. Authors who follow one source produce conditions that the other source's tooling reads poorly: kstatus expects `Reconciling` and `Stalled`, while humans and many dashboards expect a positive `Ready`. Flux publishes both styles together (`Ready` plus `Reconciling` and `Stalled`).

## Mitigations

Publish a positive summary and the kstatus pair together, as Flux does, and set `observedGeneration` so stale values can be detected. See [decisions/choose-abnormal-true-or-positive-polarity-for-new-condition-types](../decisions/choose-abnormal-true-or-positive-polarity-for-new-condition-types.md), [findings/abnormal-true-polarity-makes-a-stopped-controller-look-healthy](abnormal-true-polarity-makes-a-stopped-controller-look-healthy.md), [entities/flux](../entities/flux.md), and [entities/kstatus](../entities/kstatus.md).

## Contradictions

> [!WARNING]
> This page said the Kubernetes API conventions and the Cluster API proposal "lean toward positive" polarity. The primary sources say the current position is neither.

- Earlier claim on this page: "The Cluster API proposal and the Kubernetes API conventions lean toward positive `Ready` and `Available`".
- Verified in [sources/research-gap-m3-status-conditions](../sources/research-gap-m3-status-conditions.md): the conventions on the default branch (last commit 2026-11-05) say "neither positive nor negative polarity can be recommended as a general rule", and Cluster API's 2024 proposal quotes the same text. The positive lean was a February 2020 revision that a June 2020 commit removed. See [findings/the-kubernetes-api-conventions-recommended-abnormal-true-then-positive-polarity-and-since-june-2020-recommend-neither](the-kubernetes-api-conventions-recommended-abnormal-true-then-positive-polarity-and-since-june-2020-recommend-neither.md).
- Suggested resolution: the tension that remains is between kstatus's README, which still describes abnormal-true, and conventions that recommend neither. The page body above now states this, and the status can return to active once a reader has confirmed it.

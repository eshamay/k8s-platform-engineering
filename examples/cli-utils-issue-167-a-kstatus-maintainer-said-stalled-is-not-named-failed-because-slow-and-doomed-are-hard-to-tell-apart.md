---
title: cli-utils issue 167, a kstatus maintainer said Stalled is not named Failed because slow and doomed are hard to tell apart
type: example
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-m3-status-conditions
    hash: 07099fedb0c8
    ingested: 2026-11-26
aliases: [cli-utils issue 167]
tags: [kstatus, conditions, polarity, design-rationale, cli-utils]
---

# cli-utils issue 167, a kstatus maintainer said Stalled is not named Failed because slow and doomed are hard to tell apart

## Scenario

Issue 167 in kubernetes-sigs/cli-utils asked about the naming of the `Stalled` condition that kstatus reads. The issue was closed by a stale bot on 2020-10-09. On 2020-05-12 a maintainer (login mortent, who was assigned) explained the design reasoning. [sources/research-gap-m3-status-conditions](../sources/research-gap-m3-status-conditions.md) URL: https://github.com/kubernetes-sigs/cli-utils/issues/167

## What the maintainer said

The comment says "It is hard in most cases to distinguish \"slow\" from \"doomed\"", which is why the condition is named `Stalled` and not `Failed` or `Error`. The same comment says the then-pending conventions change "changes the suggest naming scheme of conditions away from using \"abnormal-true\" polarity". That pending change is the February 2020 conventions pull request described in [findings/the-kubernetes-api-conventions-recommended-abnormal-true-then-positive-polarity-and-since-june-2020-recommend-neither](../findings/the-kubernetes-api-conventions-recommended-abnormal-true-then-positive-polarity-and-since-june-2020-recommend-neither.md).

## Lesson

The same reasoning appears in kstatus source, where `Ready=False` gives InProgress and never Failed because the library cannot tell a progressing resource from a doomed one. The issue is the closest primary discussion of kstatus design that the dossier found, and it contains no measurement of how often generic tools misread conditions under either polarity. See [findings/kstatus-checks-deletion-then-generation-then-reconciling-and-stalled-then-ready-so-a-stale-top-level-observedgeneration-overrides-ready-true](../findings/kstatus-checks-deletion-then-generation-then-reconciling-and-stalled-then-ready-so-a-stale-top-level-observedgeneration-overrides-ready-true.md), [entities/kstatus](../entities/kstatus.md), and [decisions/choose-abnormal-true-or-positive-polarity-for-new-condition-types](../decisions/choose-abnormal-true-or-positive-polarity-for-new-condition-types.md).

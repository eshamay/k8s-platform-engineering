---
title: The Kubernetes API conventions recommended abnormal-true, then positive polarity, and since June 2020 recommend neither
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-m3-status-conditions
    hash: 07099fedb0c8
    ingested: 2026-11-26
aliases: [condition polarity history]
tags: [conditions, polarity, conventions, history, verified]
---

# The Kubernetes API conventions recommended abnormal-true, then positive polarity, and since June 2020 recommend neither

## Observation

The primary record on condition polarity is a history and not a rule. The July 2017 conventions text carried the line "Condition types should indicate state in the \"abnormal-true\" polarity", which a 2019 blog by maelvls quotes (SECONDARY-ONLY for the 2017 text, because the commit-pinned fetch returned later wording). A commit of 2020-02-14, part of kubernetes/community pull request 4521, deleted that line and recommended positive polarity as "an explicit reversal from earlier recommendations of abnormal-true". A commit of 2020-06-26 removed the positive-polarity preference and added the current text. [[sources/research-gap-m3-status-conditions]] URLs: https://github.com/kubernetes/community/commit/3a2c17b49 and https://github.com/kubernetes/community/commit/5f972cff4

The conventions on the default branch (last commit 2026-11-05) now say "neither positive nor negative polarity can be recommended as a general rule" and "Without further knowledge of the conditions, it is not possible to compute a generic summary of the conditions on a resource". They also note that `Failed=False` or `Failed=Unknown` may cause double-negative confusion. KEP-1623 does not discuss polarity. Cluster API's 2024 status proposal cites the same "neither" text as the position it adopts.

## Why it matters

Tools built in different eras follow different advice. kstatus's README still describes abnormal-true for `Reconciling` and `Stalled`, and a kstatus maintainer said on 2020-05-12 that the pending conventions change would move naming away from abnormal-true. Flux keeps both styles. Authors who cite "the conventions say positive" or "the conventions say abnormal-true" are each quoting a superseded revision. See [[examples/cli-utils-issue-167-a-kstatus-maintainer-said-stalled-is-not-named-failed-because-slow-and-doomed-are-hard-to-tell-apart]].

## Correction note

An earlier wiki page said the Kubernetes conventions and the Cluster API proposal "lean toward positive" names. The 2020 Cluster API proposal's suffix guidance does lean positive (`Ready`, `Succeeded`, "other suffix with positive meaning"), but both its text and the 2024 proposal say neither polarity can be recommended. See [[findings/condition-polarity-guidance-conflicts-between-kstatus-and-the-api-conventions]].

## Mitigations

Treat polarity as the author's choice, document each condition's polarity for generic consumers, and set the top-level `observedGeneration`. See [[decisions/choose-abnormal-true-or-positive-polarity-for-new-condition-types]], [[findings/abnormal-true-polarity-makes-a-stopped-controller-look-healthy]], and [[concepts/conditions]].

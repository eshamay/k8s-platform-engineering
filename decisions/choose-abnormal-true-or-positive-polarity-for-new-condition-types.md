---
title: Choose abnormal-true or positive polarity for new condition types
type: decision
status: active
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
tags: [conditions, polarity, kstatus, api-design, decision]
---

# Choose abnormal-true or positive polarity for new condition types

## Status

Open question framed by the sources, not an ADR authored by this wiki. The Kubernetes API conventions leave polarity to authors, and the sources the dossier read disagree on which to prefer. [sources/research-conditions](../sources/research-conditions.md)

## Context

An API author adding conditions must decide whether `True` means healthy (`Ready`, `Available`, `Succeeded`) or means something needs attention (`Reconciling`, `Stalled`, `MemoryExhausted`). The API conventions advise that humans should find the name easy to read, prefer `Ready` or `Succeeded` over `Failed`, and also say a negative name can be easier to understand. kstatus's README favors abnormal-true for `Reconciling` and `Stalled`. Correction note: this page previously said the Cluster API proposal moved toward positive polarity, but the current conventions and Cluster API's 2024 proposal both say neither polarity can be recommended as a general rule.

## Options

With a positive polarity, a reader sees `Ready=True` and moves on, but `Ready=False` cannot say whether the object is progressing or doomed. With abnormal-true polarity, the absence of problems looks healthy, which hides a dead or lagging controller unless `observedGeneration` is compared. The combination used by Flux publishes a positive `Ready` along with `Reconciling` and `Stalled`.

## Consequences

Whichever polarity is chosen, the author should set `observedGeneration`, write an initial `Unknown` condition on first visit, and tell generic consumers which condition to read. The dossier gives no evidence on which option produces fewer incidents. See [findings/condition-polarity-guidance-conflicts-between-kstatus-and-the-api-conventions](../findings/condition-polarity-guidance-conflicts-between-kstatus-and-the-api-conventions.md), [findings/abnormal-true-polarity-makes-a-stopped-controller-look-healthy](../findings/abnormal-true-polarity-makes-a-stopped-controller-look-healthy.md), [concepts/conditions](../concepts/conditions.md), and [entities/kstatus](../entities/kstatus.md).

## Evidence from the m3 dossier

This page records options and evidence and makes no recommendation. The conventions recommended abnormal-true, then positive in February 2020, and since June 2020 recommend neither. [sources/research-gap-m3-status-conditions](../sources/research-gap-m3-status-conditions.md) See [findings/the-kubernetes-api-conventions-recommended-abnormal-true-then-positive-polarity-and-since-june-2020-recommend-neither](../findings/the-kubernetes-api-conventions-recommended-abnormal-true-then-positive-polarity-and-since-june-2020-recommend-neither.md).

### Option A: abnormal-true

kstatus's `Reconciling` and `Stalled` follow it, and Flux marks them as present only when True so that observers can stop waiting without a timeout. The kstatus README names the weakness: a stopped controller looks healthy, and it relies on top-level `observedGeneration` to cover that. Argo CD's Application conditions behave like abnormal-true, with no status field.

### Option B: positive

The 2020 Cluster API proposal recommends the suffixes `Ready` and `Succeeded` and notes that Pod conditions are consistently positive while Node conditions mix polarities. The conventions warn that `Failed=False` can cause double-negative confusion, and Config Connector uses one positive `Ready`. kstatus's own `Ready` fallback treats False as InProgress and cannot distinguish doomed from slow, as a maintainer said in [examples/cli-utils-issue-167-a-kstatus-maintainer-said-stalled-is-not-named-failed-because-slow-and-doomed-are-hard-to-tell-apart](../examples/cli-utils-issue-167-a-kstatus-maintainer-said-stalled-is-not-named-failed-because-slow-and-doomed-are-hard-to-tell-apart.md).

### Option C: both

Flux publishes a positive `Ready` with abnormal-true `Stalled` and `Reconciling`. See [examples/flux-stamps-the-current-generation-on-every-condition-and-also-keeps-a-top-level-observedgeneration](../examples/flux-stamps-the-current-generation-on-every-condition-and-also-keeps-a-top-level-observedgeneration.md).

### What the evidence does not show

No incident write-up measuring misreadings by generic tools per polarity was found (UNVERIFIED, searched). The only documented failure mode is the kstatus README's stopped-controller case. The conventions add that without knowing each condition's polarity, "it is not possible to compute a generic summary".

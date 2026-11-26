---
title: Choose abnormal-true or positive polarity for new condition types
type: decision
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-conditions
    hash: 97b224c63502
    ingested: 2026-11-25
aliases: []
tags: [conditions, polarity, kstatus, api-design, decision]
---

# Choose abnormal-true or positive polarity for new condition types

## Status

Open question framed by the sources, not an ADR authored by this wiki. The Kubernetes API conventions leave polarity to authors, and the sources the dossier read disagree on which to prefer. [[sources/research-conditions]]

## Context

An API author adding conditions must decide whether `True` means healthy (`Ready`, `Available`, `Succeeded`) or means something needs attention (`Reconciling`, `Stalled`, `MemoryExhausted`). The API conventions advise that humans should find the name easy to read, prefer `Ready` or `Succeeded` over `Failed`, and also say a negative name can be easier to understand. kstatus favors abnormal-true, while the Cluster API proposal moved toward positive `Ready` and `Available`.

## Options

With a positive polarity, a reader sees `Ready=True` and moves on, but `Ready=False` cannot say whether the object is progressing or doomed. With abnormal-true polarity, the absence of problems looks healthy, which hides a dead or lagging controller unless `observedGeneration` is compared. The combination used by Flux publishes a positive `Ready` along with `Reconciling` and `Stalled`.

## Consequences

Whichever polarity is chosen, the author should set `observedGeneration`, write an initial `Unknown` condition on first visit, and tell generic consumers which condition to read. The dossier gives no evidence on which option produces fewer incidents. See [[findings/condition-polarity-guidance-conflicts-between-kstatus-and-the-api-conventions]], [[findings/abnormal-true-polarity-makes-a-stopped-controller-look-healthy]], [[concepts/conditions]], and [[entities/kstatus]].

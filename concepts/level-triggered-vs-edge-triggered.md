---
title: Level-Triggered vs Edge-Triggered
type: concept
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: krm-platform-vocabulary
    hash: 731a6941f9db
    ingested: 2026-11-25
  - id: research-declarative-vs-imperative
    hash: 570767ba4094
    ingested: 2026-11-25
aliases: [State-based vs event-based]
tags: [architecture, controllers]
---

# Level-Triggered vs Edge-Triggered

## Definition

A level-triggered (state-based) controller bases its logic on the current state of a resource, comparing spec with reality. An edge-triggered (event-based) controller reacts to the specific event that caused a change. If a level-triggered controller misses an event, the next reconciliation still converges to the right state. [[sources/krm-platform-vocabulary]]

## Why it matters

This property is why controllers tolerate restarts, dropped watch events, and network partitions. It shapes how [[concepts/reconciliation-loop]] is written: the loop must derive its work from observed state, never from the triggering event alone.

## Declarative evidence

The API conventions state that "the system's behavior is level-based rather than edge-based," so the system drives toward the latest spec regardless of intermediate values. A HackerNoon explainer, which attributes the "forgiving" framing to Joe Beda, shows a replica-scaling case where edge-triggered handling reaches the wrong end state after missed events while level-triggered comparison converges. Tim Hockin's slides add that the cache is updated by events (edges) yet controllers still reconcile full state, and that they should re-list periodically because software has bugs. [[sources/research-declarative-vs-imperative]] See [[concepts/declarative-vs-imperative]].

## Related

[[concepts/eventual-consistency-and-convergence]], [[concepts/informers-reflectors-and-workqueues]], [[concepts/idempotency]]

## To research

The origin of the edge/level framing in Kubernetes design discussions, and pitfalls when controllers leak edge-triggered assumptions.

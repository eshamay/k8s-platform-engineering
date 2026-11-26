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
aliases: [State-based vs event-based]
tags: [architecture, controllers]
---

# Level-Triggered vs Edge-Triggered

## Definition

A level-triggered (state-based) controller bases its logic on the current state of a resource, comparing spec with reality. An edge-triggered (event-based) controller reacts to the specific event that caused a change. If a level-triggered controller misses an event, the next reconciliation still converges to the right state. [[sources/krm-platform-vocabulary]]

## Why it matters

This property is why controllers tolerate restarts, dropped watch events, and network partitions. It shapes how [[concepts/reconciliation-loop]] is written: the loop must derive its work from observed state, never from the triggering event alone.

## Related

[[concepts/eventual-consistency-and-convergence]], [[concepts/informers-reflectors-and-workqueues]], [[concepts/idempotency]]

## To research

The origin of the edge/level framing in Kubernetes design discussions, and pitfalls when controllers leak edge-triggered assumptions.

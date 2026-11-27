---
title: Event-specific logic in reconcilers
type: finding
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-level-triggered-vs-edge-triggered
    hash: 27a34aa0de59
    ingested: 2026-11-25
  - id: research-idempotency
    hash: 4704ffd77903
    ingested: 2026-11-25
aliases: []
tags: [pitfall, controllers, level-triggered]
---

# Event-specific logic in reconcilers

## Observation

Controller authors are tempted to branch on whether an object was created, updated, or deleted. Doing so reintroduces edge-triggered fragility, because a restart or a coalesced event means the handler for that edge never runs. The controller-runtime FAQ answers the question directly: "You should not. Reconcile functions should be idempotent, and should always reconcile state by reading all the state it needs, then writing updates." The first-principles book lists event-driven controllers that break when events are missed as a common misconception. [sources/research-level-triggered-vs-edge-triggered](../sources/research-level-triggered-vs-edge-triggered.md)

## Interpretation

The framework enforces the rule structurally. The `Request` passed to Reconcile carries only a namespaced name, so there is no event type to branch on. A correct reconciler computes what to do from desired and observed state alone, which also makes it tolerate skipped or coalesced events and restarts. See [concepts/idempotency](../concepts/idempotency.md) and [entities/controller-runtime](../entities/controller-runtime.md).

## Mitigations

Read all needed state at the start of each reconcile, write only the difference, and treat deletion as an observable state, for example through a deletion timestamp and [concepts/finalizers](../concepts/finalizers.md), instead of as an event.

## Related

[concepts/level-triggered-vs-edge-triggered](../concepts/level-triggered-vs-edge-triggered.md), [concepts/reconciliation-loop](../concepts/reconciliation-loop.md), [decisions/events-as-hints-state-as-truth](../decisions/events-as-hints-state-as-truth.md)

## Corroboration from the Kubebuilder book

The Kubebuilder good-practices page repeats the rule: the reconciliation loop needs to be idempotent, and logic keyed to specific events goes against the operator pattern and can leave resources stuck needing manual fixes. [sources/research-idempotency](../sources/research-idempotency.md) See [concepts/idempotency](../concepts/idempotency.md).

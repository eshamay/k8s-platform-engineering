---
title: An edge-triggered scaler ends at zero replicas where a level-triggered one converges
type: example
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-reconciliation-loop
    hash: df7d66206baf
    ingested: 2026-11-25
aliases: []
tags: [level-triggered, reconciliation, scaling]
---

# An edge-triggered scaler ends at zero replicas where a level-triggered one converges

## Scenario

The 2018 Level Triggering article asks the reader to imagine a replica count that changes from 1 to 5 and then to 2. An edge-triggered system reacts to each change event as a delta, while a level-triggered system reacts to the current declared number. [sources/research-reconciliation-loop](../sources/research-reconciliation-loop.md)

## What happens

If the edge-triggered system misses or reorders the events, it can act on the wrong deltas. The article shows it terminating more replicas than exist and ending at zero, a state the source of truth never held. The level-triggered system compares the declared count of 2 with the observed count each time it runs, so it ends at 2 no matter which intermediate events it saw. [sources/research-reconciliation-loop](../sources/research-reconciliation-loop.md)

## Why it matters

This is the clearest small illustration of why a reconcile request carries only a name and a namespace and why the reconciler rereads state. The article concedes that edge triggering is more efficient and can be made safe with periodic full resync or event versioning, which is the hybrid that [decisions/events-as-hints-state-as-truth](../decisions/events-as-hints-state-as-truth.md) records. The price of the level-based design is that the logic must be idempotent. [sources/research-reconciliation-loop](../sources/research-reconciliation-loop.md)

## Related

[concepts/reconciliation-loop](../concepts/reconciliation-loop.md), [concepts/level-triggered-vs-edge-triggered](../concepts/level-triggered-vs-edge-triggered.md), [examples/deployment-replica-changes-converge-to-the-final-count](deployment-replica-changes-converge-to-the-final-count.md), [findings/event-specific-logic-in-reconcilers](../findings/event-specific-logic-in-reconcilers.md)

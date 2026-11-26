---
title: Self-triggered reconcile loops generate their own events
type: finding
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-reconciliation-loop
    hash: df7d66206baf
    ingested: 2026-11-25
aliases: [Reconcile loop explosion, Hot loop]
tags: [reconciliation, hot-loop, predicates, requeue]
---

# Self-triggered reconcile loops generate their own events

## Observation

A controller can create the events that wake it. The GoLinuxCloud article lists the causes: status writes that retrigger reconciles, accidental mutation of the spec, noisy child resources watched through `Owns()`, an aggressive `RequeueAfter`, and logic that depends on individual events. The result is a hot loop that burns controller CPU and API server capacity while changing nothing of substance. [[sources/research-reconciliation-loop]]

## Mitigations

The article and the Red Hat best-practices post agree on a set of fixes. Use `GenerationChangedPredicate` so status-only changes do not requeue. Write status through the status subresource and use `Patch` instead of a full `Update`. Watch a higher-level aggregate in place of many noisy children. Add jitter to requeue delays. Keep `Reconcile` idempotent and level-triggered. The GoLinuxCloud article is a secondary source, so check its claims against the controller-runtime documentation. [[sources/research-reconciliation-loop]]

## Why it matters

The finding is the operational face of the level-based design: because a reconcile reads state and writes state, any write that is visible to its own watch can feed itself. No named-company postmortem appeared in the dossier, so the evidence is guidance and not incident reports. [[sources/research-reconciliation-loop]]

## Related

[[findings/status-writes-through-the-main-resource-retrigger-reconcile-loops]], [[findings/defaulting-and-drift-reconcile-loops]], [[findings/controllers-fighting-over-fields-cause-revert-loops]], [[concepts/reconciliation-loop]], [[concepts/spec-status-split]]

---
title: Reconciliation Loop
type: concept
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: krm-platform-vocabulary
    hash: 731a6941f9db
    ingested: 2026-11-25
  - id: research-level-triggered-vs-edge-triggered
    hash: 27a34aa0de59
    ingested: 2026-11-25
aliases: [Reconcile, Control loop]
tags: [controllers]
---

# Reconciliation Loop

## Definition

The core `Reconcile(ctx, req)` function. It reads a resource's spec, inspects the external world, performs idempotent API calls to align the two, and updates status. [[sources/krm-platform-vocabulary]]

## Why it matters

Every controller in this wiki is a reconcile loop at heart. The loop's quality depends on [[concepts/idempotency]] and on being [[concepts/level-triggered-vs-edge-triggered|level-triggered]]. Requests arrive as namespace/name keys from the [[concepts/informers-reflectors-and-workqueues|workqueue]].

## Level-based contract

The Reconcile function receives only a namespaced name, never an event type, and must read all needed state before writing. Errors requeue with exponential backoff, and `RequeueAfter` schedules a timed revisit. [[sources/research-level-triggered-vs-edge-triggered]] See [[entities/controller-runtime]] and [[findings/event-specific-logic-in-reconcilers]].

## Related

[[concepts/spec-status-split]], [[concepts/conditions]], [[concepts/operator-pattern]]

## To research

Requeue and backoff behavior, error handling, long-running external operations, and testing strategies.

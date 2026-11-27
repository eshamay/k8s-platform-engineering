---
title: Built-in controllers use deterministic names to avoid duplicate children
type: example
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-idempotency
    hash: 4704ffd77903
    ingested: 2026-11-25
aliases: []
tags: [idempotency, deployment, statefulset, replicaset, controller-runtime]
---

# Built-in controllers use deterministic names to avoid duplicate children

## Scenario

A controller owns child objects and may be restarted, or may read a stale cache, between deciding to create a child and seeing it in its cache. If the next reconcile creates the child again, the cluster ends up with duplicates. The controller-runtime FAQ describes how the built-in controllers avoid this. [sources/research-idempotency](../sources/research-idempotency.md)

## What each controller does

- The StatefulSet controller appends an ordinal to the Pod name, so a second create of `web-0` fails with an already-exists error and does not produce a second Pod.
- The Deployment controller hashes the pod template into the ReplicaSet name, so the same template always maps to the same ReplicaSet name.
- The ReplicaSet controller creates Pods with generated names, so the name cannot reject a duplicate. It tracks the actions it has taken and requeues to repeat them if the Pods have not appeared in the cache.

## Lesson

Deterministic names turn the API server's optimistic locking into a free idempotency check, because the second create fails loudly. Where names must be generated, the controller needs its own record of intent, which is the same shape of problem that external cloud creates have in a harder form. See [concepts/idempotency](../concepts/idempotency.md), [findings/stale-cache-and-double-action](../findings/stale-cache-and-double-action.md), and [examples/how-core-controllers-handle-cache-lag](how-core-controllers-handle-cache-lag.md). [sources/research-idempotency](../sources/research-idempotency.md)

## Related

[entities/controller-runtime](../entities/controller-runtime.md), [concepts/reconciliation-loop](../concepts/reconciliation-loop.md)

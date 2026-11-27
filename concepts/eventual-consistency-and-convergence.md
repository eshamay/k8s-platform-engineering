---
title: Eventual Consistency and Convergence
type: concept
status: active
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: krm-platform-vocabulary
    hash: 731a6941f9db
    ingested: 2026-11-25
  - id: research-level-triggered-vs-edge-triggered
    hash: 27a34aa0de59
    ingested: 2026-11-25
  - id: research-eventual-consistency-and-convergence
    hash: bb35eafbd239
    ingested: 2026-11-25
aliases: [Convergence]
tags: [architecture, principle]
---

# Eventual Consistency and Convergence

## Definition

Accepting that complex systems do not update instantaneously. Instead of building a strict dependency graph up front, resources are applied concurrently and fail and retry until their dependencies exist and the system converges on the desired state. [sources/krm-platform-vocabulary](../sources/krm-platform-vocabulary.md)

The convergence dossier states the guarantee precisely. Kubernetes does not promise that the gap between desired and actual state closes instantly, or that every intermediate change is seen. It promises that the system keeps working toward the latest declared state, and convergence is the observable result: actual state settles on desired state once disruptions stop. The API conventions say the system drives toward the most recent spec regardless of previous versions. [sources/research-eventual-consistency-and-convergence](../sources/research-eventual-consistency-and-convergence.md)

## Why it matters

It explains why a first apply of a large manifest set may show transient errors that resolve on their own, and why platform tools lean on retries and [concepts/conditions](conditions.md) rather than strict ordering. It also marks a tension with tools that want explicit ordering, which is worth comparing across [entities/flux](../entities/flux.md), [entities/crossplane](../entities/crossplane.md), and [entities/kro](../entities/kro.md).

## What makes convergence robust

The mechanism is level-based logic. An edge-triggered system reacts to "something changed" and can be left permanently wrong by a missed or reordered event, while a level-triggered system recomputes the whole difference from current state each time. Tim Hockin summarizes the choice as "State is more useful than events." For controller authors this means reconcilers must be idempotent, must compute from observed state and not from the event that woke them, and must tolerate being run extra times. Mechanically a controller has informers (a watch plus a local cache), a work queue that deduplicates keys, and a reconcile function, and failures return an error so the queue retries with exponential backoff. Healthy-but-waiting situations should use a timed requeue instead of an error. [sources/research-eventual-consistency-and-convergence](../sources/research-eventual-consistency-and-convergence.md) See [concepts/level-triggered-vs-edge-triggered](level-triggered-vs-edge-triggered.md), [concepts/idempotency](idempotency.md), and [examples/deployment-replica-changes-converge-to-the-final-count](../examples/deployment-replica-changes-converge-to-the-final-count.md).

## Convergence under lost events

Convergence relies on the level-triggered property: a missed event delays the correct end state but does not prevent it. A failing reconcile retries with backoff until it succeeds or is marked terminal. [sources/research-level-triggered-vs-edge-triggered](../sources/research-level-triggered-vs-edge-triggered.md) See [findings/failure-retry-loops-and-backoff](../findings/failure-retry-loops-and-backoff.md).

## Telling users where convergence stands

Status conditions and `observedGeneration` tell users whether a given spec generation has been acted on. Crossplane separates `Synced` from `Ready` so that "the controller is working" is distinct from "the thing is usable." See [findings/misleading-readiness-and-stale-status](../findings/misleading-readiness-and-stale-status.md) and [examples/crossplane-database-claim-reports-synced-and-ready](../examples/crossplane-database-claim-reports-synced-and-ready.md).

## Costs and mitigations

The dossier lists five costs. Each has a documented mitigation.

- Staleness, because informer caches lag the API server. Kubernetes v1.36 adds mitigation and metrics for cache synchronization and watch latency, and optimistic concurrency turns a stale write into a retried 409. See [findings/stale-cache-and-double-action](../findings/stale-cache-and-double-action.md).
- Retry amplification when backoff is absent or unbounded. See [findings/retry-storms-and-unbounded-retries](../findings/retry-storms-and-unbounded-retries.md), [findings/errors-used-as-timers-in-reconcilers](../findings/errors-used-as-timers-in-reconcilers.md), and [comparisons/retry-and-backoff-controls-across-tools](../comparisons/retry-and-backoff-controls-across-tools.md).
- Duplicated work when several replicas run without leader election. See [findings/duplicate-work-from-replicas-without-leader-election](../findings/duplicate-work-from-replicas-without-leader-election.md) and [decisions/single-replica-versus-leader-election](../decisions/single-replica-versus-leader-election.md).
- Ordering problems, because Kubernetes does not order dependent resources. Flux, Argo CD, and Crossplane add health-gated ordering. See [findings/ordering-and-dependency-failures](../findings/ordering-and-dependency-failures.md), [examples/flux-dependson-and-health-checks-gate-rollout](../examples/flux-dependson-and-health-checks-gate-rollout.md), and [examples/argo-cd-sync-waves-order-crds-operators-and-workloads](../examples/argo-cd-sync-waves-order-crds-operators-and-workloads.md).
- Slow drift correction, because detection latency equals the interval. See [findings/drift-detection-latency-is-the-interval](../findings/drift-detection-latency-is-the-interval.md).

## Related

[concepts/level-triggered-vs-edge-triggered](level-triggered-vs-edge-triggered.md), [concepts/reconciliation-loop](reconciliation-loop.md), [concepts/self-healing-and-drift-detection](self-healing-and-drift-detection.md), [examples/kro-shared-queue-tunes-throughput](../examples/kro-shared-queue-tunes-throughput.md), [entities/kube-rs](../entities/kube-rs.md)

## To research

The exact Kubernetes v1.36 staleness mechanisms and metric names, the Crossplane, ACK, Config Connector, and Cluster API default intervals, and a named end-user case study of convergence trouble. See [open-knowledge-gaps](../open-knowledge-gaps.md).

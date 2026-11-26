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

Accepting that complex systems do not update instantaneously. Instead of building a strict dependency graph up front, resources are applied concurrently and fail and retry until their dependencies exist and the system converges on the desired state. [[sources/krm-platform-vocabulary]]

The convergence dossier states the guarantee precisely. Kubernetes does not promise that the gap between desired and actual state closes instantly, or that every intermediate change is seen. It promises that the system keeps working toward the latest declared state, and convergence is the observable result: actual state settles on desired state once disruptions stop. The API conventions say the system drives toward the most recent spec regardless of previous versions. [[sources/research-eventual-consistency-and-convergence]]

## Why it matters

It explains why a first apply of a large manifest set may show transient errors that resolve on their own, and why platform tools lean on retries and [[concepts/conditions]] rather than strict ordering. It also marks a tension with tools that want explicit ordering, which is worth comparing across [[entities/flux]], [[entities/crossplane]], and [[entities/kro]].

## What makes convergence robust

The mechanism is level-based logic. An edge-triggered system reacts to "something changed" and can be left permanently wrong by a missed or reordered event, while a level-triggered system recomputes the whole difference from current state each time. Tim Hockin summarizes the choice as "State is more useful than events." For controller authors this means reconcilers must be idempotent, must compute from observed state and not from the event that woke them, and must tolerate being run extra times. Mechanically a controller has informers (a watch plus a local cache), a work queue that deduplicates keys, and a reconcile function, and failures return an error so the queue retries with exponential backoff. Healthy-but-waiting situations should use a timed requeue instead of an error. [[sources/research-eventual-consistency-and-convergence]] See [[concepts/level-triggered-vs-edge-triggered]], [[concepts/idempotency]], and [[examples/deployment-replica-changes-converge-to-the-final-count]].

## Convergence under lost events

Convergence relies on the level-triggered property: a missed event delays the correct end state but does not prevent it. A failing reconcile retries with backoff until it succeeds or is marked terminal. [[sources/research-level-triggered-vs-edge-triggered]] See [[findings/failure-retry-loops-and-backoff]].

## Telling users where convergence stands

Status conditions and `observedGeneration` tell users whether a given spec generation has been acted on. Crossplane separates `Synced` from `Ready` so that "the controller is working" is distinct from "the thing is usable." See [[findings/misleading-readiness-and-stale-status]] and [[examples/crossplane-database-claim-reports-synced-and-ready]].

## Costs and mitigations

The dossier lists five costs. Each has a documented mitigation.

- Staleness, because informer caches lag the API server. Kubernetes v1.36 adds mitigation and metrics for cache synchronization and watch latency, and optimistic concurrency turns a stale write into a retried 409. See [[findings/stale-cache-and-double-action]].
- Retry amplification when backoff is absent or unbounded. See [[findings/retry-storms-and-unbounded-retries]], [[findings/errors-used-as-timers-in-reconcilers]], and [[comparisons/retry-and-backoff-controls-across-tools]].
- Duplicated work when several replicas run without leader election. See [[findings/duplicate-work-from-replicas-without-leader-election]] and [[decisions/single-replica-versus-leader-election]].
- Ordering problems, because Kubernetes does not order dependent resources. Flux, Argo CD, and Crossplane add health-gated ordering. See [[findings/ordering-and-dependency-failures]], [[examples/flux-dependson-and-health-checks-gate-rollout]], and [[examples/argo-cd-sync-waves-order-crds-operators-and-workloads]].
- Slow drift correction, because detection latency equals the interval. See [[findings/drift-detection-latency-is-the-interval]].

## Related

[[concepts/level-triggered-vs-edge-triggered]], [[concepts/reconciliation-loop]], [[concepts/self-healing-and-drift-detection]], [[examples/kro-shared-queue-tunes-throughput]], [[entities/kube-rs]]

## To research

The exact Kubernetes v1.36 staleness mechanisms and metric names, the Crossplane, ACK, Config Connector, and Cluster API default intervals, and a named end-user case study of convergence trouble. See [[open-knowledge-gaps]].

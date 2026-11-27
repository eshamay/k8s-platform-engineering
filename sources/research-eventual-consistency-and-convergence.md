---
title: "Research dossier: Eventual Consistency and Convergence"
type: source
status: active
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-eventual-consistency-and-convergence
    hash: bb35eafbd239
    ingested: 2026-11-25
aliases: []
tags: [eventual-consistency, convergence, research-dossier, controllers, retries, pitfalls]
---

# Research dossier: Eventual Consistency and Convergence

> [!NOTE]
> **Raw file:** `raw/research-eventual-consistency-and-convergence.md` (sha256 prefix bb35eafbd239)<br>
> **Kind:** Research dossier summarizing 15 web pages, dated 2026-11-25<br>
> **Ingested:** 2026-11-25<br>
> **Caveat:** Several large pages were read through a summarizing fetch tool and a few only in their first 100,000 characters, so quotes and specific values should be re-verified against the live pages before publication.

## Summary

The dossier frames Kubernetes as declared intent plus continuous correction. Nothing guarantees that the gap between desired and actual state closes instantly or that every intermediate change is seen. What the system guarantees is that it keeps working toward the latest declared state, and convergence is the observable result once disruptions stop. The mechanism that makes this robust is level-based logic, together with idempotent reconcilers, informer caches, a deduplicating work queue, and retries with exponential backoff.

The dossier also catalogs the costs: cache staleness, retry amplification, duplicate work from multiple replicas, ordering problems between dependent resources, and status that does not say whether the latest spec has been acted on. It then shows how Flux, Argo CD, Crossplane, and kro each bound those costs with intervals, backoff, health-gated ordering, and explicit conditions. It found no named end-user case study of convergence trouble, and the one retry-storm postmortem it cites is a secondary account of a non-Kubernetes incident.

See [concepts/eventual-consistency-and-convergence](../concepts/eventual-consistency-and-convergence.md) for the synthesized concept.

## Key claims

### Concept and mechanism

- Controllers decide from informer caches that can lag the API server when watch events are delayed or missed, so a controller may act on outdated state. Kubernetes v1.36 adds staleness mitigation and metrics for cache synchronization and watch latency, which makes "eventual" a measurable lag. URL: https://kubernetes.io/blog/2026/04/28/kubernetes-v1-36-staleness-mitigation-for-controllers/. Quote: "Staleness in Kubernetes controllers is a problem that affects many controllers". The dossier read only the first 100,000 characters and its summary of the specific mitigation and metric names was generic. See [findings/stale-cache-and-double-action](../findings/stale-cache-and-double-action.md).
- The official controllers page defines the pattern with a thermostat analogy: controllers watch the cluster, compare current to desired state, and act through the API server. It prefers many simple, decoupled controllers over one monolith. URL: https://kubernetes.io/docs/concepts/architecture/controller/. Quote: "Each controller tries to move the current cluster state closer to the desired state." See [concepts/reconciliation-loop](../concepts/reconciliation-loop.md).
- Tim Hockin's slides use hardware interrupt lines as the analogy: a pulse (edge) can be missed, while a held signal (level) persists until serviced. He concludes that level-driven software suits Kubernetes because clients can check state again at any time. URL: https://speakerdeck.com/thockin/edge-vs-level-triggered-logic. Quote: "State is more useful than events." See [concepts/level-triggered-vs-edge-triggered](../concepts/level-triggered-vs-edge-triggered.md).
- A 2018 HackerNoon explainer walks through a replica scaling scenario (1 to 5 to 2) that ends at 0 replicas under edge-triggered handling and at 2 under level-triggered comparison of full states. It notes that edge triggering can be repaired by periodic full resync or versioned events. URL: https://hackernoon.com/level-triggering-and-reconciliation-in-kubernetes-1f17fe30333d. Quote (Joe Beda, as quoted): "The goal seeking behavior of the control loop is very stable." See [examples/deployment-replica-changes-converge-to-the-final-count](../examples/deployment-replica-changes-converge-to-the-final-count.md).
- The DevOps Toolkit write-up describes the observe, compare, act loop: informers keep a local cache and push notifications to work queues, failed operations retry with exponential backoff, and operations must be idempotent. URL: https://devopstoolkit.live/kubernetes/kubernetes-controllers-deep-dive-how-they-really-work/. Quote: "The controller (1) observes the current state of the resources it's responsible for." See [concepts/idempotency](../concepts/idempotency.md) and [concepts/informers-reflectors-and-workqueues](../concepts/informers-reflectors-and-workqueues.md).
- The Kubernetes API conventions define spec versus status, level-based semantics, `resourceVersion` and optimistic concurrency (a 409 on conflict), the standard conditions structure, and `observedGeneration` for detecting stale status. They establish that the system drives toward the most recent spec regardless of intermediate versions. URL: https://github.com/kubernetes/community/blob/master/contributors/devel/sig-architecture/api-conventions.md. Quote (tool-reported, verify wording): "The system will drive toward the most recent spec regardless of previous versions". The dossier read about 100,000 of 127,000 characters. See [concepts/conditions](../concepts/conditions.md) and [findings/misleading-readiness-and-stale-status](../findings/misleading-readiness-and-stale-status.md).

### Retries and requeue semantics

- A third-party controller-runtime guide maps return values to behavior: an empty result with a nil error means converged, `RequeueAfter` means healthy but waiting, and an error means failure and triggers workqueue exponential backoff. It warns against using errors for normal waiting, tight `RequeueAfter` loops, ignoring NotFound and Conflict, and over-requeueing instead of watching children. URL: https://www.golinuxcloud.com/requeue-requeueafter-error-handling-controller-runtime/. Quote: "Errors should mean 'this reconcile attempt failed,' not 'come back in thirty seconds.'" The dossier says to confirm this against controller-runtime source. See [findings/errors-used-as-timers-in-reconcilers](../findings/errors-used-as-timers-in-reconcilers.md) and [entities/controller-runtime](../entities/controller-runtime.md).
- A secondary account of a September 2026 GitHub incident says a background job saturated a shared permissions database and a retry loop around token creation kept re-sending failing writes, which prevented recovery. The dossier stresses that this is not a Kubernetes incident and recommends the primary GitHub postmortem if one is found. URL: https://www.aurorasre.ai/blog/github-retry-storm-outage-2026. Quote: "a retry loop around token creation kept re-sending the writes that were already failing". See [findings/retry-storms-and-unbounded-retries](../findings/retry-storms-and-unbounded-retries.md).

### Replicas and leader election

- The kube-rs guide explains why most controllers can run as a single replica: they are queue consumers, watch streams reinitialize with current state on boot, and idempotent reconcilers make repeats harmless, which yields an eventual consistency guarantee. Two replicas without leader election cause duplicate work and racy writes. It describes Lease-based leader election, step-down on SIGTERM, and rollout surge hazards. URL: https://kube.rs/controllers/availability/. Quote (paraphrase-close, verify): "most controllers lean into the eventual consistency model and run with a single replica". See [decisions/single-replica-versus-leader-election](../decisions/single-replica-versus-leader-election.md), [findings/duplicate-work-from-replicas-without-leader-election](../findings/duplicate-work-from-replicas-without-leader-election.md), and [entities/kube-rs](../entities/kube-rs.md).

### Tool behavior

- Flux re-reconciles a Kustomization at `spec.interval` (minimum 60 seconds), uses a server-side apply dry run to detect and correct drift, and supports `prune`, `wait` and `healthChecks` for readiness, `dependsOn` for ordering (dependents wait for Ready), `retryInterval` for failures, `force` for immutable-field changes (risking downtime), and `suspend`. URL: https://fluxcd.io/flux/components/kustomize/kustomizations/. Quote: "If the .metadata.generation of a resource changes or the Source revision changes, this is handled instantly outside the interval window." The dossier read about 100,000 of 121,000 characters. See [entities/flux](../entities/flux.md) and [examples/flux-dependson-and-health-checks-gate-rollout](../examples/flux-dependson-and-health-checks-gate-rollout.md).
- Crossplane managed resources mirror external cloud objects. The `Synced` condition means the provider can reconcile the resource and `Ready` means the resource is available, which separates "controller is working" from "thing is usable". The poll interval can be set per resource with an annotation to detect external drift, the external-name annotation links the object to the cloud identifier and avoids duplicates, and providers back off on errors. URL: https://docs.crossplane.io/latest/managed-resources/managed-resources/. Quote: "Crossplane considers the forProvider field of a managed resource the 'source of truth' for external resources." See [entities/crossplane](../entities/crossplane.md) and [examples/crossplane-database-claim-reports-synced-and-ready](../examples/crossplane-database-claim-reports-synced-and-ready.md).
- Crossplane composite resources also report `Synced` and `Ready`, and `Ready` depends on the composition function pipeline reporting that all composed resources are ready. A reconcile can be forced with the `crossplane.io/reconcile-requested-at` annotation. The page does not describe retry mechanics in detail. URL: https://docs.crossplane.io/latest/composition/composite-resources/. Quote: "Crossplane sets the Ready status condition to True when the composite resource's composition function pipeline reports that all its composed resources are ready." See [concepts/composite-resource](../concepts/composite-resource.md).
- Argo CD self-heal triggers a sync when live state drifts from Git, with a default delay of about 5 seconds. Prune is off by default. Retries use configurable exponential backoff, including unlimited retries, and Argo CD does not re-sync the same commit and parameters after a failure unless self-heal is on. Rollback is blocked while automated sync is enabled. URL: https://argo-cd.readthedocs.io/en/stable/user-guide/auto_sync/. Quote: "Automatic sync will not reattempt a sync if the previous sync attempt against the same commit-SHA and parameters had failed." See [entities/argo-cd](../entities/argo-cd.md).
- Argo CD orders work by phase, then wave, then kind, then name. Each wave must become Healthy before the next proceeds, with a short pause between waves. Hooks run on every sync and so must be idempotent, and a failed PreSync hook aborts the sync. URL: https://argo-cd.readthedocs.io/en/stable/user-guide/sync-waves/. Quote: "If a PreSync hook fails then the whole sync operation will stop and will be marked as failed". See [examples/argo-cd-sync-waves-order-crds-operators-and-workloads](../examples/argo-cd-sync-waves-order-crds-operators-and-workloads.md).
- kro processes all instances from a single shared queue with configurable workers (default 1), combined exponential backoff (200ms to 1000s) and a token bucket (10 per second, burst 100), client QPS 100 and burst 150, a 10-hour full resync, and up to 20 retries before an item is dropped. These come from the "next" (unreleased) docs and may differ in released versions. URL: https://kro.run/next/docs/advanced/controller-tuning. Quote (tool-reported): "Single shared queue prevents any single RGD from overwhelming the system". See [entities/kro](../entities/kro.md), [examples/kro-shared-queue-tunes-throughput](../examples/kro-shared-queue-tunes-throughput.md), and [comparisons/retry-and-backoff-controls-across-tools](../comparisons/retry-and-backoff-controls-across-tools.md).

### Pitfall synthesis

- Dependencies between resources are not ordered by Kubernetes itself. Flux uses `dependsOn` plus health checks, Argo CD uses health-gated waves and hooks, and Crossplane uses composition function readiness. See [findings/ordering-and-dependency-failures](../findings/ordering-and-dependency-failures.md).
- Drift detection latency is the reconcile or poll interval, so long intervals trade API load for slower correction. See [findings/drift-detection-latency-is-the-interval](../findings/drift-detection-latency-is-the-interval.md).

### Limits of the evidence

- The dossier found no named end-user case study of convergence issues, and Config Connector, ACK, and Cluster API handling of convergence was not sourced (the Cluster API page fetch returned 404). Crossplane's default poll interval and backoff values were not stated.
- The kro instances concept page returned empty content, so kro's status conditions and per-instance reconcile semantics are unverified. The Hackernoon piece dates from 2018 and the date of the Hockin deck is unknown. See [open-knowledge-gaps](../open-knowledge-gaps.md).

## Related

[concepts/eventual-consistency-and-convergence](../concepts/eventual-consistency-and-convergence.md), [sources/research-level-triggered-vs-edge-triggered](research-level-triggered-vs-edge-triggered.md), [sources/research-declarative-vs-imperative](research-declarative-vs-imperative.md), [sources/research-universal-control-plane](research-universal-control-plane.md)

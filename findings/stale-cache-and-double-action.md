---
title: Stale cache and double action
type: finding
status: active
created: 2026-11-25
updated: 2026-11-26
sources:
  - id: research-gap-o9-cadence-and-staleness
    hash: eb353fed45cd
    ingested: 2026-11-26
  - id: research-gap-b1-recheck-flux-k8s
    hash: c78dc9a9635e
    ingested: 2026-11-26
  - id: research-gap-g3-k8s-and-controller-runtime
    hash: 2b4e3378c119
    ingested: 2026-11-26
  - id: research-level-triggered-vs-edge-triggered
    hash: 27a34aa0de59
    ingested: 2026-11-25
  - id: research-eventual-consistency-and-convergence
    hash: bb35eafbd239
    ingested: 2026-11-25
  - id: research-informers-reflectors-and-workqueues
    hash: f9de5ca73ab6
    ingested: 2026-11-25
  - id: research-gap-b1-unverified-claims
    hash: d152f98abb04
    ingested: 2026-11-26
  - id: research-gap-m5-informers-caches
    hash: 1a6a4969c0c2
    ingested: 2026-11-26
aliases: [Expectations problem]
tags: [pitfall, controllers, cache, level-triggered]
---

# Stale cache and double action

## Observation

A level-triggered controller reads its informer cache, and that cache can lag the controller's own writes. If the controller creates a Pod and reconciles again before the cache shows it, the gap still appears to exist and the controller may create a second Pod. A simulation in the Ayson blog post shows the same effect abstractly: a regulator that cannot see its own recent writes ends with four plates when three were wanted. Edge-triggered handling survives delay but not loss, while level-triggered handling survives loss but not blind spots about its own actions. [sources/research-level-triggered-vs-edge-triggered](../sources/research-level-triggered-vs-edge-triggered.md)

## Interpretation

Pure level-triggering is not enough. The post's fix is Kubernetes-style expectations, where the loop remembers its own unseen writes and clears them using API resource versions. This is why mature controllers are a hybrid of level-based logic plus bookkeeping about in-flight actions. See [decisions/events-as-hints-state-as-truth](../decisions/events-as-hints-state-as-truth.md).

## Mitigations

The controller-runtime FAQ lists two approaches used by built-in controllers. StatefulSet and Deployment use deterministic names (ordinal numbers and a hash of the pod template), so the API server rejects a duplicate create. ReplicaSet tracks its own actions as expectations and requeues, and generateName cases can requeue after a timeout. See [examples/how-core-controllers-handle-cache-lag](../examples/how-core-controllers-handle-cache-lag.md) and [entities/controller-runtime](../entities/controller-runtime.md).

## Caveat

The Ayson post was read only through a summarizing fetch. Correction note, 2026-11-26: the "Kubernetes Controller Writing Guide" it cites has since been located at `contributors/devel/sig-api-machinery/controllers.md` in kubernetes/community, see [findings/the-level-driven-not-edge-driven-guideline-is-point-3-of-the-controller-writing-guide-and-the-beda-quote-remains-second-hand](the-level-driven-not-edge-driven-guideline-is-point-3-of-the-controller-writing-guide-and-the-beda-quote-remains-second-hand.md). [sources/research-gap-m5-informers-caches](../sources/research-gap-m5-informers-caches.md)

## Kubernetes v1.36 staleness work

Optimistic concurrency through `resourceVersion` turns a write based on stale data into a 409 conflict that the controller retries. [sources/research-eventual-consistency-and-convergence](../sources/research-eventual-consistency-and-convergence.md) See [concepts/informers-reflectors-and-workqueues](../concepts/informers-reflectors-and-workqueues.md).

Kubernetes v1.36 added a built-in mitigation (KEP 5647) that gates on resource version. The DaemonSet, StatefulSet, ReplicaSet, and Job controllers record the resource version of their own writes and skip a sync when the informer cache has not caught up, with each controller behind a `StaleControllerConsistency<API type>` gate that is Beta and on by default from 1.36 and depends on the client-go `AtomicFIFO` gate. The built-in fix is therefore resource-version gating with a skip and a later retry, and it is not a sleep or a time-based wait. Lag is observable through the client-go gauge `informer_store_resource_version` and per-controller skip counters such as `daemonset_controller_stale_sync_skips_total`, and the blog's shorter metric names differ from the code. Kubernetes v1.37 extends the gating to the HorizontalPodAutoscaler controller. For controller-runtime, a read-your-own-write client design merged on 2026-10-05, and no release is confirmed to ship it. [sources/research-gap-g3-k8s-and-controller-runtime](../sources/research-gap-g3-k8s-and-controller-runtime.md) See [examples/kubernetes-v1-36-daemonset-statefulset-replicaset-and-job-controllers-skip-a-sync-until-the-cache-catches-up-with-their-own-write](../examples/kubernetes-v1-36-daemonset-statefulset-replicaset-and-job-controllers-skip-a-sync-until-the-cache-catches-up-with-their-own-write.md), [examples/controller-runtime-merged-a-read-your-own-write-client-design-in-october-2026-but-no-release-is-confirmed-to-ship-it](../examples/controller-runtime-merged-a-read-your-own-write-client-design-in-october-2026-but-no-release-is-confirmed-to-ship-it.md), and [findings/the-kubernetes-v1-36-staleness-blog-names-metrics-differently-from-the-changelog-and-source](the-kubernetes-v1-36-staleness-blog-names-metrics-differently-from-the-changelog-and-source.md).

Correction note, 2026-11-26: this section previously said only that v1.36 "adds staleness mitigation and metrics for cache synchronization and watch latency". The mechanisms and names above replace that generic summary.

## Related

[concepts/informers-reflectors-and-workqueues](../concepts/informers-reflectors-and-workqueues.md), [concepts/idempotency](../concepts/idempotency.md), [concepts/level-triggered-vs-edge-triggered](../concepts/level-triggered-vs-edge-triggered.md)

## Cache-backed client reads in the informers dossier

The controller-runtime cache blog says the cache-backed client reads from the cache and writes go to the API server, so a read right after a write can return old data. The remedies it and the pitfalls blog give are the expectations pattern and explicit uncached reads where authority is required. [sources/research-informers-reflectors-and-workqueues](../sources/research-informers-reflectors-and-workqueues.md) See [concepts/informers-reflectors-and-workqueues](../concepts/informers-reflectors-and-workqueues.md).

Correction 2026-11-26: for controller-runtime operators, the v0.25.0 release added an experimental, opt-in read-your-writes client option (`Client.EnableReadYourWritesConsistency`). It is not on by default and is labelled experimental, so the defenses above still apply. See [findings/controller-runtime-v0-25-0-ships-an-experimental-opt-in-read-your-writes-client](controller-runtime-v0-25-0-ships-an-experimental-opt-in-read-your-writes-client.md) and [sources/research-gap-b1-unverified-claims](../sources/research-gap-b1-unverified-claims.md).

## Update from the Flux and Kubernetes recheck

Update 2026-11-26: on v1.36.0 the StatefulSet skip counter was not registered, so an absent counter does not prove that no syncs were skipped ([findings/the-statefulset-stale-sync-skip-metric-was-defined-but-not-registered-in-v1-36-0-and-registered-in-v1-37](the-statefulset-stale-sync-skip-metric-was-defined-but-not-registered-in-v1-36-0-and-registered-in-v1-37.md)). `MonitorInformerStaleness` and `BookmarkFunc` are described by the KEP and blog but were not found in shipped code (confirmed absent at v1.36.0, v1.37.0 and master by the o9 dossier, see [findings/monitorinformerstaleness-and-the-handler-bookmarkfunc-are-absent-from-kubernetes-v1-36-0-v1-37-0-and-master-source](monitorinformerstaleness-and-the-handler-bookmarkfunc-are-absent-from-kubernetes-v1-36-0-v1-37-0-and-master-source.md)) ([findings/kep-5647-lists-a-different-gate-shape-from-the-shipped-code-and-monitorinformerstaleness-is-not-found-in-kubernetes-source](kep-5647-lists-a-different-gate-shape-from-the-shipped-code-and-monitorinformerstaleness-is-not-found-in-kubernetes-source.md)). Whether any controller-runtime release ships read-your-writes was not rechecked here. [sources/research-gap-b1-recheck-flux-k8s](../sources/research-gap-b1-recheck-flux-k8s.md)

## Update from the o9 dossier

Update 2026-11-26: the built-in read-your-writes gates are per controller and Beta, with the HPA gate already in v1.37.0 ([findings/kubernetes-v1-37-0-already-carries-the-horizontal-pod-autoscaler-staleness-gate-and-every-per-controller-gate-depends-on-atomicfifo](kubernetes-v1-37-0-already-carries-the-horizontal-pod-autoscaler-staleness-gate-and-every-per-controller-gate-depends-on-atomicfifo.md)). The monitoring gate and handler hook that the KEP describes are not in released source, so there is no built-in staleness monitor to enable ([findings/monitorinformerstaleness-and-the-handler-bookmarkfunc-are-absent-from-kubernetes-v1-36-0-v1-37-0-and-master-source](monitorinformerstaleness-and-the-handler-bookmarkfunc-are-absent-from-kubernetes-v1-36-0-v1-37-0-and-master-source.md)). [sources/research-gap-o9-cadence-and-staleness](../sources/research-gap-o9-cadence-and-staleness.md)

---
title: "Kubernetes v1.36 DaemonSet, StatefulSet, ReplicaSet, and Job controllers skip a sync until the cache catches up with their own write"
type: example
status: active
created: 2026-11-26
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
  - id: research-gap-b1-unverified-claims
    hash: d152f98abb04
    ingested: 2026-11-26
aliases: [Kubernetes stale controller consistency, KEP 5647 adopters]
tags: [kubernetes, v1-36, v1-37, staleness, informers, kube-controller-manager, read-your-writes]
---

# Kubernetes v1.36 DaemonSet, StatefulSet, ReplicaSet, and Job controllers skip a sync until the cache catches up with their own write

## Scenario

A controller writes an object and then reconciles again before its informer cache has seen that write. The cache still shows the old state, so the controller may repeat the work or act on stale data. Kubernetes v1.36 added a built-in answer in kube-controller-manager, tracked by KEP 5647 (Stale Controller Handling, author michaelasp, SIG API Machinery). [sources/research-gap-g3-k8s-and-controller-runtime](../sources/research-gap-g3-k8s-and-controller-runtime.md)

## What the four controllers do

The DaemonSet, StatefulSet, ReplicaSet, and Job controllers record the resource version of each write they make. Before syncing an object, a controller checks whether its cache has reached that resource version, and if the cache is behind, it does not take action and the object is retried later. The v1.36 blog says the changes are "on by default for these controllers", and an operator turns one off with `StaleControllerConsistency<API type>=false`. URL: https://kubernetes.io/blog/2026/04/28/kubernetes-v1-36-staleness-mitigation-for-controllers/

The mechanism has three layers. In client-go, the `AtomicFIFO` gate (Beta, default true from 1.36) makes the informer FIFO process list and relist batches atomically, and a `Store` can report `LastStoreSyncResourceVersion()`, the latest resource version the cache has seen. Each of the four controllers has its own gate, `StaleControllerConsistency<API type>`, which is Beta and on by default from 1.36 and depends on `AtomicFIFO` (tag v1.36.0 `pkg/features/kube_features.go`). A client-go helper called `ConsistencyStore`, with `WroteAt`, `EnsureReady`, and `Clear`, is described for authors of other informer-based controllers.

## Observability

When a DaemonSet or Job sync is deferred, the controller increments `daemonset_controller_stale_sync_skips_total` or `job_controller_stale_sync_skips_total` and logs a message (CHANGELOG-1.36, PRs 134937 and 137210). The informer lag itself is exposed by the client-go gauge `informer_store_resource_version`. The blog uses shorter names for both, which the finding [findings/the-kubernetes-v1-36-staleness-blog-names-metrics-differently-from-the-changelog-and-source](../findings/the-kubernetes-v1-36-staleness-blog-names-metrics-differently-from-the-changelog-and-source.md) records.

## Later extensions

Kubernetes v1.37 extends the same gating to the HorizontalPodAutoscaler controller (`StaleControllerConsistencyHPA`, Beta, default true) and adds `NodeControllerLeaseCircuitBreaker` (Beta, default true) for node lifecycle. The v1.37 kube-scheduler publishes `informer_store_resource_version`, `informer_queued_items`, and `informer_processing_latency_seconds` (CHANGELOG-1.37, PR 140511). The v1.37 release blog also describes a `BookmarkFunc` callback and an observation-only mode, `MonitorInformerStaleness`, that polls the apiserver every 5 seconds to show how far an informer cache is behind. Neither appears in the CHANGELOG or the v1.37.0 gate table, so their stage and default are not confirmed. URL: https://kubernetes.io/blog/2026/08/26/kubernetes-v1-37-release/

## What it shows

Upstream treats "my cache has not yet seen my own write" as a skip-and-retry condition keyed on resource version. The built-in fix is resource-version gating, and it is not a sleep or a time-based wait. It sits beside the older techniques in [examples/how-core-controllers-handle-cache-lag](how-core-controllers-handle-cache-lag.md), deterministic names and expectations, and it generalizes the expectations idea into the informer layer. See [findings/stale-cache-and-double-action](../findings/stale-cache-and-double-action.md) and [concepts/informers-reflectors-and-workqueues](../concepts/informers-reflectors-and-workqueues.md).

## Related

[entities/client-go](../entities/client-go.md), [examples/controller-runtime-merged-a-read-your-own-write-client-design-in-october-2026-but-no-release-is-confirmed-to-ship-it](controller-runtime-merged-a-read-your-own-write-client-design-in-october-2026-but-no-release-is-confirmed-to-ship-it.md), [findings/kubernetes-docs-pages-disagree-with-the-code-on-mutating-admission-policy-and-storage-version-migration-stage](../findings/kubernetes-docs-pages-disagree-with-the-code-on-mutating-admission-policy-and-storage-version-migration-stage.md)

Update 2026-11-26: master source defines `stale_sync_skips_total` for the ReplicaSet and StatefulSet controllers under the subsystems `replicaset_controller` and `statefulset_controller`. The release in which each shipped was not pinned. See [findings/the-kubernetes-v1-36-staleness-blog-names-metrics-differently-from-the-changelog-and-source](../findings/the-kubernetes-v1-36-staleness-blog-names-metrics-differently-from-the-changelog-and-source.md) and [sources/research-gap-b1-unverified-claims](../sources/research-gap-b1-unverified-claims.md).

## Update from the Flux and Kubernetes recheck

Update 2026-11-26: the earlier update that left the release of the ReplicaSet and StatefulSet metrics unpinned is superseded. Both counters are defined at v1.36.0 and v1.37.0, but the StatefulSet counter was only registered from v1.37 through pull request 138451 ([examples/kubernetes-pull-request-138451-registered-the-statefulset-stale-sync-skip-metric-in-v1-37](kubernetes-pull-request-138451-registered-the-statefulset-stale-sync-skip-metric-in-v1-37.md); [findings/the-statefulset-stale-sync-skip-metric-was-defined-but-not-registered-in-v1-36-0-and-registered-in-v1-37](../findings/the-statefulset-stale-sync-skip-metric-was-defined-but-not-registered-in-v1-36-0-and-registered-in-v1-37.md)). KEP 5647's `kep.yaml` lists a different gate shape ([findings/kep-5647-lists-a-different-gate-shape-from-the-shipped-code-and-monitorinformerstaleness-is-not-found-in-kubernetes-source](../findings/kep-5647-lists-a-different-gate-shape-from-the-shipped-code-and-monitorinformerstaleness-is-not-found-in-kubernetes-source.md)). [sources/research-gap-b1-recheck-flux-k8s](../sources/research-gap-b1-recheck-flux-k8s.md)

## Update from the o9 dossier

Update 2026-11-26: the four controller counters were read again under their subsystems, and the HPA gate was found in the v1.37.0 tag and not only on master ([findings/kubernetes-v1-37-0-already-carries-the-horizontal-pod-autoscaler-staleness-gate-and-every-per-controller-gate-depends-on-atomicfifo](../findings/kubernetes-v1-37-0-already-carries-the-horizontal-pod-autoscaler-staleness-gate-and-every-per-controller-gate-depends-on-atomicfifo.md)). The informer gauge fix in 1.38 is in [examples/kubernetes-pull-request-143314-fixed-the-informer-store-resource-version-gauge-reporting-zero-before-a-store-recorded-a-version](kubernetes-pull-request-143314-fixed-the-informer-store-resource-version-gauge-reporting-zero-before-a-store-recorded-a-version.md). [sources/research-gap-o9-cadence-and-staleness](../sources/research-gap-o9-cadence-and-staleness.md)

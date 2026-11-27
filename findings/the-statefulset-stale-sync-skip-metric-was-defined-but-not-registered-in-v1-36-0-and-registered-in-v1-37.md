---
title: "The StatefulSet stale sync skip metric was defined but not registered in v1.36.0 and registered in v1.37"
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-b1-recheck-flux-k8s
    hash: c78dc9a9635e
    ingested: 2026-11-26
aliases: [statefulset_controller_stale_sync_skips_total]
tags: [kubernetes, v1-36, v1-37, staleness, metrics, statefulset, kube-controller-manager, pitfall]
---

# The StatefulSet stale sync skip metric was defined but not registered in v1.36.0 and registered in v1.37

## Observation

The Kubernetes v1.36 staleness mitigation gives each gated controller a skip counter named `stale_sync_skips_total` (ALPHA, labels `group` and `resource`), with a different subsystem per controller. For the StatefulSet controller the counter was defined at v1.36.0 but the controller's `Register()` function registered only `MaxUnavailable` and `UnavailableReplicas`. A dashboard that expected `statefulset_controller_stale_sync_skips_total` on a v1.36.0 `/metrics` endpoint should not have found it. Pull request 138451, "Register Statefulset Metric for Reconcile skips" (merged 2026-04-23, milestone v1.37), fixed it, and CHANGELOG-1.37 says "Fixed an issue where the StatefulSet controller's skip metrics were not properly registered." [sources/research-gap-b1-recheck-flux-k8s](../sources/research-gap-b1-recheck-flux-k8s.md) https://github.com/kubernetes/kubernetes/pull/138451

The ReplicaSet controller's `Register` registered `ReplicaSetRequeueSkips` at both tags, so the ReplicaSet counter was emitted at v1.36.0. The conclusion about StatefulSet is an inference from reading the code at tags v1.36.0 and v1.37.0, and it was not tested on a running cluster. See [examples/kubernetes-pull-request-138451-registered-the-statefulset-stale-sync-skip-metric-in-v1-37](../examples/kubernetes-pull-request-138451-registered-the-statefulset-stale-sync-skip-metric-in-v1-37.md).

## Full names, pinned to tags

At both v1.36.0 and v1.37.0 the metric name and level are identical in the source. The documentation list at v1.37.0 lists `stale_sync_skips_total` for five subsystems: `daemonset_controller`, `horizontal_pod_autoscaler_controller`, `job_controller`, `replicaset_controller`, and `statefulset_controller`. The full names are therefore:

- `daemonset_controller_stale_sync_skips_total` and `job_controller_stale_sync_skips_total`, named in CHANGELOG-1.36.
- `replicaset_controller_stale_sync_skips_total` and `statefulset_controller_stale_sync_skips_total`, read from source at v1.36.0 and v1.37.0.
- `horizontal_pod_autoscaler_controller_stale_sync_skips_total`, from v1.37 when the HorizontalPodAutoscaler controller gains `StaleControllerConsistencyHPA`.

This pins the master-source reading that [findings/the-kubernetes-v1-36-staleness-blog-names-metrics-differently-from-the-changelog-and-source](the-kubernetes-v1-36-staleness-blog-names-metrics-differently-from-the-changelog-and-source.md) had marked as not tied to a release.

## The informer gauge

The informer-side gauge `informer_store_resource_version` (ALPHA, subsystem `informer`, labels name, group, version, resource, help "The 15 least significant digits of the resource version of the store.") is in `component-base/metrics/prometheus/clientgo/fifo/metrics.go` at v1.36.0. The blog's `store_resource_version` is the same name without the subsystem prefix. CHANGELOG-1.38 mentions a fix, pull request 143314, for the gauge reporting 0 before the store records a resource version.

## What to do

Alert on the skip counters from the CHANGELOG or source names at the release in use, check them against a live endpoint, and on v1.36.0 do not treat an absent StatefulSet counter as proof that no syncs were skipped. See [findings/stale-cache-and-double-action](stale-cache-and-double-action.md).

## Related

[examples/kubernetes-v1-36-daemonset-statefulset-replicaset-and-job-controllers-skip-a-sync-until-the-cache-catches-up-with-their-own-write](../examples/kubernetes-v1-36-daemonset-statefulset-replicaset-and-job-controllers-skip-a-sync-until-the-cache-catches-up-with-their-own-write.md), [concepts/informers-reflectors-and-workqueues](../concepts/informers-reflectors-and-workqueues.md), [findings/kep-5647-lists-a-different-gate-shape-from-the-shipped-code-and-monitorinformerstaleness-is-not-found-in-kubernetes-source](kep-5647-lists-a-different-gate-shape-from-the-shipped-code-and-monitorinformerstaleness-is-not-found-in-kubernetes-source.md)

---
title: "Kubernetes pull request 138451 registered the StatefulSet stale sync skip metric in v1.37"
type: example
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-b1-recheck-flux-k8s
    hash: c78dc9a9635e
    ingested: 2026-11-26
aliases: [Kubernetes PR 138451]
tags: [kubernetes, v1-36, v1-37, staleness, metrics, statefulset, pr-138451]
---

# Kubernetes pull request 138451 registered the StatefulSet stale sync skip metric in v1.37

## Scenario

Kubernetes v1.36 added resource-version gating so that the StatefulSet controller, like the DaemonSet, ReplicaSet, and Job controllers, skips a sync until its informer cache has caught up with its own write. Each controller counts skips in a metric named `stale_sync_skips_total` under its own subsystem. [[sources/research-gap-b1-recheck-flux-k8s]]

## What happened

At tag v1.36.0 the StatefulSet metrics file defined the counter, but the controller's `Register()` registered only `MaxUnavailable` and `UnavailableReplicas`. The counter was therefore not registered with the metrics endpoint. Pull request 138451, "Register Statefulset Metric for Reconcile skips", merged on 2026-04-23 under milestone v1.37, added the registration, and CHANGELOG-1.37 records "Fixed an issue where the StatefulSet controller's skip metrics were not properly registered." The ReplicaSet `Register` registered its counter at both tags. https://github.com/kubernetes/kubernetes/pull/138451

That the counter was missing from a v1.36.0 `/metrics` endpoint is the dossier's reading of the code, and it was not tested on a running cluster.

## What it shows

A new feature can ship with its behavior enabled and its observability only partly wired up. The metric that would have shown skipped StatefulSet syncs was absent in the first release, so the first release's data for that controller would read as "no skips". See [[findings/the-statefulset-stale-sync-skip-metric-was-defined-but-not-registered-in-v1-36-0-and-registered-in-v1-37]] and [[examples/kubernetes-v1-36-daemonset-statefulset-replicaset-and-job-controllers-skip-a-sync-until-the-cache-catches-up-with-their-own-write]].

## Related

[[findings/the-kubernetes-v1-36-staleness-blog-names-metrics-differently-from-the-changelog-and-source]], [[concepts/informers-reflectors-and-workqueues]]

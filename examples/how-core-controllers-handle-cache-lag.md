---
title: How core controllers handle cache lag
type: example
status: draft
created: 2026-11-25
updated: 2026-11-26
sources:
  - id: research-gap-g3-k8s-and-controller-runtime
    hash: 2b4e3378c119
    ingested: 2026-11-26
  - id: research-level-triggered-vs-edge-triggered
    hash: 27a34aa0de59
    ingested: 2026-11-25
aliases: []
tags: [controllers, replicaset, statefulset, deployment, cache]
---

# How core controllers handle cache lag

## Scenario

The ReplicaSet, StatefulSet, and Deployment controllers are the canonical level-triggered controllers. Each must create Pods to close a gap between desired and observed replicas, and each reads from an informer cache that can lag behind its own writes. [sources/research-level-triggered-vs-edge-triggered](../sources/research-level-triggered-vs-edge-triggered.md)

## How each one copes

According to the controller-runtime FAQ, StatefulSet appends ordinal numbers to Pod names and Deployment hashes the Pod template into names, so a duplicate create is rejected by the API server because the name already exists. ReplicaSet instead tracks its own actions (expectations) and requeues until the cache catches up. The FAQ also describes a requeue-after-timeout approach for cases that use generateName. See [findings/stale-cache-and-double-action](../findings/stale-cache-and-double-action.md).

## Why it matters

The same level-based loop is made safe by two different mechanisms, which shows that correctness here comes from design discipline and not from the trigger model alone. The HackerNoon article adds a remark attributed to Joe Beda that Kubernetes has shipped bugs that went unnoticed because the loop self-corrected, which is the level-triggered property working as intended. That quote was not verified against its cited book. See [concepts/level-triggered-vs-edge-triggered](../concepts/level-triggered-vs-edge-triggered.md) and [entities/controller-runtime](../entities/controller-runtime.md).

## Update for Kubernetes v1.36

Kubernetes v1.36 added a third mechanism beside deterministic names and expectations. The DaemonSet, StatefulSet, ReplicaSet, and Job controllers now record the resource version of their own writes and skip a sync until the informer cache has caught up, on by default behind the `StaleControllerConsistency<API type>` gates. [sources/research-gap-g3-k8s-and-controller-runtime](../sources/research-gap-g3-k8s-and-controller-runtime.md) See [examples/kubernetes-v1-36-daemonset-statefulset-replicaset-and-job-controllers-skip-a-sync-until-the-cache-catches-up-with-their-own-write](kubernetes-v1-36-daemonset-statefulset-replicaset-and-job-controllers-skip-a-sync-until-the-cache-catches-up-with-their-own-write.md).

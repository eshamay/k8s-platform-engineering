---
title: "Kubernetes v1.37.0 already carries the HorizontalPodAutoscaler staleness gate, and every per-controller gate depends on AtomicFIFO"
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-o9-cadence-and-staleness
    hash: eb353fed45cd
    ingested: 2026-11-26
aliases: [StaleControllerConsistencyHPA, per-controller staleness gates]
tags: [kubernetes, staleness, feature-gates, atomicfifo, v1-36, v1-37, hpa]
---

# Kubernetes v1.37.0 already carries the HorizontalPodAutoscaler staleness gate, and every per-controller gate depends on AtomicFIFO

## Observation

At tag v1.36.0 `pkg/features/kube_features.go` defines four per-controller gates, `StaleControllerConsistencyDaemonSet`, `StaleControllerConsistencyJob`, `StaleControllerConsistencyReplicaSet` and `StaleControllerConsistencyStatefulSet`. Each is Beta and default true from 1.36 (`{Version: version.MustParse("1.36"), Default: true, PreRelease: Beta}`), and each depends on the client-go gate `AtomicFIFO`. In client-go `known_features.go`, `AtomicFIFO` and `UnlockWhileProcessingFIFO` are both Beta and default true from 1.36, the same at v1.36.0, v1.37.0 and master. [[sources/research-gap-o9-cadence-and-staleness]] https://github.com/kubernetes/kubernetes/blob/v1.36.0/pkg/features/kube_features.go

## The HPA gate is in v1.37.0

The dossier first read `StaleControllerConsistencyHPA` as a master-only addition, and its verification pass corrected that. The gate is already in the v1.37.0 `kube_features.go` as Beta, default true from 1.37, depends on `AtomicFIFO`, and is absent at v1.36.0. `NodeControllerLeaseCircuitBreaker` also depends on `AtomicFIFO` at v1.37.0. This agrees with the wiki's earlier statement that v1.37 added the HorizontalPodAutoscaler controller, see [[examples/kubernetes-v1-36-daemonset-statefulset-replicaset-and-job-controllers-skip-a-sync-until-the-cache-catches-up-with-their-own-write]]. https://github.com/kubernetes/kubernetes/blob/v1.37.0/pkg/features/kube_features.go

## The shape differs from the KEP

KEP 5647 names one umbrella gate, `StaleControllerConsistency`, while the code ships one gate per controller. See [[findings/kep-5647-lists-a-different-gate-shape-from-the-shipped-code-and-monitorinformerstaleness-is-not-found-in-kubernetes-source]].

## Practical effect

Because each per-controller gate needs `AtomicFIFO`, turning `AtomicFIFO` off in client-go leaves the dependent controller gates without their prerequisite. The dossier read the dependency declarations and did not test a gate combination on a running cluster.

## Related

[[findings/stale-cache-and-double-action]], [[concepts/informers-reflectors-and-workqueues]], [[entities/client-go]]

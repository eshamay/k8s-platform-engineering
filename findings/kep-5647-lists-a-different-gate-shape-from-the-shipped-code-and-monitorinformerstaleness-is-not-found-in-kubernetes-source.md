---
title: "KEP 5647 lists a different gate shape from the shipped code, and MonitorInformerStaleness is not found in Kubernetes source"
type: finding
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
aliases: [KEP 5647 versus code, MonitorInformerStaleness unverified]
tags: [kubernetes, kep-5647, staleness, feature-gates, v1-36, v1-37, documentation-conflict]
---

# KEP 5647 lists a different gate shape from the shipped code, and MonitorInformerStaleness is not found in Kubernetes source

## Observation

The KEP for Kubernetes v1.36 staleness mitigation and the code that shipped do not match in structure. The KEP 5647 `kep.yaml` (read 2026-11-26) reads stage beta, latest milestone v1.37, beta milestone v1.37 with no alpha entry, and four gates for kube-controller-manager: `StaleControllerConsistency`, `MonitorInformerStaleness`, `AtomicFIFO`, and `UnlockWhileProcessingFIFO`. The code at tag v1.36.0 has a separate gate per controller (`StaleControllerConsistencyDaemonSet`, `...Job`, `...ReplicaSet`, `...StatefulSet`), each Beta and default true from 1.36, each depending on client-go `AtomicFIFO` (Beta, default true from 1.36), with `UnlockWhileProcessingFIFO` Beta from 1.36. Version v1.37.0 adds `StaleControllerConsistencyHPA` (Beta, default true from 1.37). [sources/research-gap-b1-recheck-flux-k8s](../sources/research-gap-b1-recheck-flux-k8s.md) https://github.com/kubernetes/enhancements/blob/master/keps/sig-api-machinery/5647-stale-controller-handling/kep.yaml

The KEP names its README title as "Stale Controller Detection and Mitigation", while the `kep.yaml` title is "Stale Controller Handling" and its status is implementable.

## What the KEP text says

The README (858 lines, last commit 2026-04-30, read in full) adds a `BookmarkFunc func(resourceVersion string)` to `ResourceEventHandlerFuncs`. It tracks the last-written resource version for each reconciled object and skips and requeues until the cache passes it. The skipped object is requeued "the same way as if an error occurred", with exponential backoff. It proposes a circuit-breaking pattern for controllers such as node-lifecycle, using live GETs of node leases, and lists GA criteria: analysis of onboarded controllers, more tests, and "Implementation of circuit breaking". The monitoring and SLI sections are unfilled template text (for example "- [ ] Metrics   - Metric name:"), so the KEP does not itself name the metrics.

## What is not found in code

A code search for `MonitorInformerStaleness` in kubernetes/kubernetes returned no match, so the name appears only in the KEP `kep.yaml` and in blog-derived material. Whether `MonitorInformerStaleness` and `BookmarkFunc` exist in shipped code at v1.36.0 is unverified, and the verification search itself was limited because gh code search returned 404 when retried. Correction note 2026-11-26: both are now confirmed absent from v1.36.0, v1.37.0 and master source, see [findings/monitorinformerstaleness-and-the-handler-bookmarkfunc-are-absent-from-kubernetes-v1-36-0-v1-37-0-and-master-source](monitorinformerstaleness-and-the-handler-bookmarkfunc-are-absent-from-kubernetes-v1-36-0-v1-37-0-and-master-source.md). The wiki therefore treats both as described by the KEP and the v1.37 release blog and not as confirmed features.

## What to do

Cite the per-controller gates from the feature-gate table at the release tag, cite the KEP for design intent only, and treat the KEP's single umbrella gate and its beta v1.37 milestone as lagging the code. This matches the general advice in [findings/kubernetes-docs-pages-disagree-with-the-code-on-mutating-admission-policy-and-storage-version-migration-stage](kubernetes-docs-pages-disagree-with-the-code-on-mutating-admission-policy-and-storage-version-migration-stage.md).

## Related

[findings/the-kubernetes-v1-36-staleness-blog-names-metrics-differently-from-the-changelog-and-source](the-kubernetes-v1-36-staleness-blog-names-metrics-differently-from-the-changelog-and-source.md), [findings/the-statefulset-stale-sync-skip-metric-was-defined-but-not-registered-in-v1-36-0-and-registered-in-v1-37](the-statefulset-stale-sync-skip-metric-was-defined-but-not-registered-in-v1-36-0-and-registered-in-v1-37.md), [examples/kubernetes-v1-36-daemonset-statefulset-replicaset-and-job-controllers-skip-a-sync-until-the-cache-catches-up-with-their-own-write](../examples/kubernetes-v1-36-daemonset-statefulset-replicaset-and-job-controllers-skip-a-sync-until-the-cache-catches-up-with-their-own-write.md), [concepts/informers-reflectors-and-workqueues](../concepts/informers-reflectors-and-workqueues.md)

## Update from the o9 dossier

Update 2026-11-26: file reads at v1.36.0, v1.37.0 and master confirm that `MonitorInformerStaleness` is not in `kube_features.go` and that the handler `BookmarkFunc` is not in `ResourceEventHandlerFuncs` ([findings/monitorinformerstaleness-and-the-handler-bookmarkfunc-are-absent-from-kubernetes-v1-36-0-v1-37-0-and-master-source](monitorinformerstaleness-and-the-handler-bookmarkfunc-are-absent-from-kubernetes-v1-36-0-v1-37-0-and-master-source.md)). The KEP file status and the tracking issue are in [findings/kep-5647-is-implementable-with-a-beta-v1-37-target-and-an-open-tracking-issue-labelled-lifecycle-stale](kep-5647-is-implementable-with-a-beta-v1-37-target-and-an-open-tracking-issue-labelled-lifecycle-stale.md), and the HPA gate is already in v1.37.0 ([findings/kubernetes-v1-37-0-already-carries-the-horizontal-pod-autoscaler-staleness-gate-and-every-per-controller-gate-depends-on-atomicfifo](kubernetes-v1-37-0-already-carries-the-horizontal-pod-autoscaler-staleness-gate-and-every-per-controller-gate-depends-on-atomicfifo.md)). [sources/research-gap-o9-cadence-and-staleness](../sources/research-gap-o9-cadence-and-staleness.md)

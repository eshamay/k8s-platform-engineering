---
title: A delete that happens while a controller is down is never delivered so finalizers or resync must cover it
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-g1-operator-loop-failures
    hash: baca2cdf965d
    ingested: 2026-11-26
aliases: [Restart gap on delete]
tags: [informer, restart-gap, finalizers, lost-events, nvsentinel]
---

# A delete that happens while a controller is down is never delivered so finalizers or resync must cover it

## Observation

NVIDIA NVSentinel issue 1542 reports that if the kubernetes-object-monitor is down when a watched object is deleted, the new informer instance never receives the delete. The monitor sends no healthy event, and the node stays cordoned until someone manually unquarantines it. The report says most controllers avoid this with a finalizer, so the object still exists when the new informer starts. The issue was closed on 2026-10-21, and the fix was not read. [[sources/research-gap-g1-operator-loop-failures]] See [[examples/nvidia-nvsentinel-issue-1542-a-node-stayed-cordoned-after-an-object-was-deleted-while-the-monitor-was-down]].

## Interpretation

A fresh informer lists the objects that exist, so an absent object produces no event at all. Only a design that remembers what it should have seen, either through a finalizer that holds the object until cleanup or through a periodic comparison of its own records against the cluster, can notice the absence. The older finding on controllers that miss changes while down is the general rule, and this case is a dated instance of it.

## Mitigations

Add a finalizer to objects whose deletion must trigger cleanup, or reconcile the controller's own recorded state against the cluster on start. See [[concepts/finalizers]].

## Related

[[findings/a-controller-that-relies-on-seeing-every-event-misses-changes-made-while-it-is-down]], [[findings/finalizers-strand-objects-in-terminating-when-the-controller-is-missing-or-failing]], [[concepts/level-triggered-vs-edge-triggered]]

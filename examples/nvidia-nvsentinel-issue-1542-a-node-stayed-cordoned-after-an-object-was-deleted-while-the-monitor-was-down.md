---
title: NVIDIA NVSentinel issue 1542 a node stayed cordoned after an object was deleted while the monitor was down
type: example
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-g1-operator-loop-failures
    hash: baca2cdf965d
    ingested: 2026-11-26
aliases: [NVSentinel issue 1542]
tags: [nvidia, nvsentinel, informer, restart-gap, finalizers, lost-events]
---

# NVIDIA NVSentinel issue 1542 a node stayed cordoned after an object was deleted while the monitor was down

## Scenario

NVIDIA's NVSentinel project received issue 1542 on 2026-07-27, and it was closed on 2026-10-21. The fix was not read. [[sources/research-gap-g1-operator-loop-failures]] URL: https://github.com/NVIDIA/NVSentinel/issues/1542

## What happened

The kubernetes-object-monitor watches objects and sends health events. If the monitor is down when a watched object is deleted, a new informer instance never receives the delete. No healthy event is sent, so the node stays cordoned until someone manually unquarantines it. The report notes that the usual workaround is a finalizer: "Most controllers workaround this issue by leveraging a finalizer to ensure that the object exists when the new instance of the informer starts." This is the restart-gap variant of a lost event, because a fresh informer lists current state and so cannot see an object that is already gone.

## Why it belongs here

It is the named case for [[findings/a-delete-that-happens-while-a-controller-is-down-is-never-delivered-so-finalizers-or-resync-must-cover-it]], and it shows an event-keyed design failing where a state-keyed one would have noticed the absence.

## Related

[[findings/a-controller-that-relies-on-seeing-every-event-misses-changes-made-while-it-is-down]], [[concepts/finalizers]], [[concepts/level-triggered-vs-edge-triggered]]

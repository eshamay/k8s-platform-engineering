---
title: A controller that relies on seeing every event misses changes made while it is down
type: finding
status: active
created: 2026-11-25
updated: 2026-11-26
sources:
  - id: research-operator-pattern
    hash: eab72eca2e1b
    ingested: 2026-11-25
  - id: research-gap-g1-operator-loop-failures
    hash: baca2cdf965d
    ingested: 2026-11-26
aliases: []
tags: [pitfall, level-triggered, controllers, restarts]
---

# A controller that relies on seeing every event misses changes made while it is down

## Observation

The sig-api-machinery guide says "Your controller may be off for an indeterminate amount of time before running again." A controller that keys its behavior on remembered events, such as "a Pod was deleted" or "a field changed from A to B," will miss whatever happened during the outage and will then act on a stale picture. The guide's rule is to be level-driven: reconcile from the current state of the world, not from a history of events. [sources/research-operator-pattern](../sources/research-operator-pattern.md)

## Mitigation

Frameworks such as controller-runtime supply the informer, cache, and workqueue plumbing that makes level-based reconciliation the default, and the Kubebuilder good-practices page requires an idempotent reconcile function so repeated or late runs are harmless. URL: https://github.com/kubernetes/community/blob/master/contributors/devel/sig-api-machinery/controllers.md and https://book.kubebuilder.io/reference/good-practices.

## Related

[concepts/level-triggered-vs-edge-triggered](../concepts/level-triggered-vs-edge-triggered.md), [findings/event-specific-logic-in-reconcilers](event-specific-logic-in-reconcilers.md), [concepts/idempotency](../concepts/idempotency.md), [concepts/operator-pattern](../concepts/operator-pattern.md)

## Dated incident evidence from the operator loop dossier

The 2026-11-26 dossier supplies two cases. NVIDIA NVSentinel issue 1542 shows a delete that happened while the monitor was down and was never delivered to the new informer, leaving a node cordoned ([examples/nvidia-nvsentinel-issue-1542-a-node-stayed-cordoned-after-an-object-was-deleted-while-the-monitor-was-down](../examples/nvidia-nvsentinel-issue-1542-a-node-stayed-cordoned-after-an-object-was-deleted-while-the-monitor-was-down.md)). Kubernetes issue 115658 shows a client-go relist dropping a DELETE for a short-lived object, fixed by pull requests 115620 and 116623 ([examples/kubernetes-issue-115658-a-client-go-relist-could-drop-the-delete-event-for-a-short-lived-object](../examples/kubernetes-issue-115658-a-client-go-relist-could-drop-the-delete-event-for-a-short-lived-object.md)). No named-company outage was found, and the impact figures are self-reported. See [findings/a-delete-that-happens-while-a-controller-is-down-is-never-delivered-so-finalizers-or-resync-must-cover-it](a-delete-that-happens-while-a-controller-is-down-is-never-delivered-so-finalizers-or-resync-must-cover-it.md) and [findings/an-informer-relist-that-races-a-queued-create-can-drop-the-delete-event-for-the-object](an-informer-relist-that-races-a-queued-create-can-drop-the-delete-event-for-the-object.md). Source: [sources/research-gap-g1-operator-loop-failures](../sources/research-gap-g1-operator-loop-failures.md).

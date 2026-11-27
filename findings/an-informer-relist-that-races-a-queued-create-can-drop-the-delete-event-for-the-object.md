---
title: An informer relist that races a queued create can drop the delete event for the object
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-g1-operator-loop-failures
    hash: baca2cdf965d
    ingested: 2026-11-26
aliases: [client-go missed DELETE]
tags: [client-go, informer, deltafifo, relist, lost-events, fixed-upstream]
---

# An informer relist that races a queued create can drop the delete event for the object

## Observation

Kubernetes issue 115658 shows that a consumer of a client-go informer could leak an object. If a watch ended and a relist ran while the CREATE for a short-lived object was still queued in DeltaFIFO, no DELETED event was generated, and the consumer never learned the object was gone. The reporter saw controllers drift out of sync in production, with queues over 1000 elements and resync disabled, and the state recovered only after a later relist. The fix is pull request 115620 (merged 2023-02-17), and a maintainer said pull request 116623 (merged 2023-03-16) resolved it for 1.27. [sources/research-gap-g1-operator-loop-failures](../sources/research-gap-g1-operator-loop-failures.md) See [examples/kubernetes-issue-115658-a-client-go-relist-could-drop-the-delete-event-for-a-short-lived-object](../examples/kubernetes-issue-115658-a-client-go-relist-could-drop-the-delete-event-for-a-short-lived-object.md).

## Interpretation

The wiki's level-triggered guidance says an event is only a hint and the reconciler re-reads state. This case is a bug in the layer that produces the hint, and it matters most for code that keeps its own state keyed by events, such as a map filled in by an add handler and emptied by a delete handler. A reconciler that lists current state and compares is not exposed in the same way. The evidence is a single issue with self-reported impact, and the reporter's employer is not named.

## Mitigations

Run a fixed client-go version, and avoid per-object state that only a delete handler can clean up. A periodic resync would also have bounded the leak, see [findings/projects-add-periodic-resync-as-a-safety-net-against-missed-events-and-bugs](projects-add-periodic-resync-as-a-safety-net-against-missed-events-and-bugs.md).

## Related

[concepts/informers-reflectors-and-workqueues](../concepts/informers-reflectors-and-workqueues.md), [concepts/level-triggered-vs-edge-triggered](../concepts/level-triggered-vs-edge-triggered.md), [findings/an-expired-resourceversion-forces-a-relist-and-synchronized-relists-can-storm](an-expired-resourceversion-forces-a-relist-and-synchronized-relists-can-storm.md), [findings/a-controller-that-relies-on-seeing-every-event-misses-changes-made-while-it-is-down](a-controller-that-relies-on-seeing-every-event-misses-changes-made-while-it-is-down.md)

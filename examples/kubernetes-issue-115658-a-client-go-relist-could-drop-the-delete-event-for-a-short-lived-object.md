---
title: Kubernetes issue 115658 a client-go relist could drop the delete event for a short-lived object
type: example
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-g1-operator-loop-failures
    hash: baca2cdf965d
    ingested: 2026-11-26
aliases: [Kubernetes issue 115658, client-go missed DELETE]
tags: [client-go, informer, deltafifo, relist, lost-events, fixed-upstream]
---

# Kubernetes issue 115658 a client-go relist could drop the delete event for a short-lived object

## Scenario

Reporter odinuge opened kubernetes/kubernetes issue 115658 on 2023-02-09 after noticing production controllers drifting out of sync with the cluster. The reporter's employer is not stated. The issue was triaged by api-machinery and closed on 2023-03-20. [[sources/research-gap-g1-operator-loop-failures]] URL: https://github.com/kubernetes/kubernetes/issues/115658

## What happened

If a watch ends and a relist runs while a CREATE for a short-lived object is still queued in DeltaFIFO, no DELETED event is generated. The consumer then keeps the object forever in its own state. The issue describes it as an "informer having a queue of events while a relist occur, and for some objects, we never see the `DELETED` event". The reporter saw queues over 1000 elements with resync disabled, and the leak cleared only after a later relist. The impact figures are self-reported.

## The fix

Pull request 115620, "client-go/cache: fix missing delete event on replace", was merged on 2023-02-17 and "fixes a race condition when a "short lived" object is created and the create event is still present on the queue". A maintainer, liggitt, said pull request 116623 (merged 2023-03-16, "change where transformers are called") resolved the issue for 1.27. Backports were held from 2023-03-01 to 2023-03-20 over a transformer-related regression concern, and lavalamp confirmed backports could proceed. URL: https://github.com/kubernetes/kubernetes/pull/115620

## Why it belongs here

It is the best primary case of a lost event in the library layer that most controllers trust, and it is the named case for [[findings/an-informer-relist-that-races-a-queued-create-can-drop-the-delete-event-for-the-object]].

## Related

[[concepts/informers-reflectors-and-workqueues]], [[entities/client-go]], [[concepts/level-triggered-vs-edge-triggered]]

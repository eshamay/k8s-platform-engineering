---
title: The word resync names three different mechanisms in client-go, kro, and ACK
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-m5-informers-caches
    hash: 1a6a4969c0c2
    ingested: 2026-11-26
aliases: []
tags: [pitfall, resync, terminology, kro, ack, cluster-api]
---

# The word resync names three different mechanisms in client-go, kro, and ACK

## Observation

Three tools use "resync" or a near neighbor for different things.

In client-go and controller-runtime, a resync is a replay of the informer's local cache to the event handlers, with no call to the API server ([findings/a-resync-replays-the-informers-local-cache-to-the-handlers-and-never-contacts-the-api-server](a-resync-replays-the-informers-local-cache-to-the-handlers-and-never-contacts-the-api-server.md)).

In kro, the flag `dynamic-controller-default-resync-period` defaults to 36000 seconds and its help text says it is the "interval at which the controller will re list resources even with no changes, in seconds." The dossier read the mechanism as the resync argument of the metadata informer that kro builds per GVR, so the help text's "re list" describes a replay of cached state and not a fresh LIST. The dossier marks this VERIFIED for the flag text and states the mechanism as its reading. https://github.com/kubernetes-sigs/kro/blob/main/cmd/controller/main.go (main; latest release v0.10.0)

In ACK, the per-resource "resync" is not an informer resync at all. After a successful reconcile the runtime returns `requeue.NeededAfter(nil, r.resyncPeriod)` with `defaultResyncPeriod = 10 * time.Hour`, which is a `RequeueAfter` and therefore a real re-read of the AWS resource on each pass. https://github.com/aws-controllers-k8s/runtime/blob/main/pkg/runtime/reconciler.go (main). [sources/research-gap-m5-informers-caches](../sources/research-gap-m5-informers-caches.md)

Cluster API's `--sync-period` of 10 minutes is the controller-runtime `SyncPeriod`, so it is the cache replay and not an infrastructure poll ([findings/the-cluster-api-sync-period-flag-is-a-cache-resync-and-not-a-poll-of-the-cloud-infrastructure](the-cluster-api-sync-period-flag-is-a-cache-resync-and-not-a-poll-of-the-cloud-infrastructure.md)).

## Consequences

Two tools that both show "10 hours" in a cadence table do different work at that interval. ACK's ten hours bounds how long an out-of-band AWS change can go unnoticed, while kro's ten hours is a replay of cached instances through the handlers. Tables that line up "resync" across tools should name the mechanism in each cell. See [comparisons/reconcile-cadence-and-off-switches-across-tools](../comparisons/reconcile-cadence-and-off-switches-across-tools.md), [examples/ack-resync-period-tuning-for-stateful-resources](../examples/ack-resync-period-tuning-for-stateful-resources.md), and [entities/kro](../entities/kro.md).

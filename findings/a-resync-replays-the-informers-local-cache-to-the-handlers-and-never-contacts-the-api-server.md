---
title: A resync replays the informer's local cache to the handlers and never contacts the API server
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-m5-informers-caches
    hash: 1a6a4969c0c2
    ingested: 2026-11-26
aliases: [Informer resync semantics]
tags: [informers, resync, client-go, controller-runtime, mechanism]
---

# A resync replays the informer's local cache to the handlers and never contacts the API server

## Observation

The client-go `SharedInformer` interface comment says a resync "consists of delivering to the handler an update notification for every object in the informer's local cache; it does not add any interactions with the authoritative storage." In the source, the reflector calls `store.Resync()` on a timer when `ShouldResync` allows, and `DeltaFIFO.Resync` "adds, with a Sync type of Delta, every object listed by `f.knownObjects` whose key is not already queued for processing." The known-objects store is the informer's own indexer, so a resync is a local replay. A zero period means "informers do no resyncs at all, not even for handlers added with a non-zero resyncPeriod." [sources/research-gap-m5-informers-caches](../sources/research-gap-m5-informers-caches.md) https://github.com/kubernetes/client-go/blob/master/tools/cache/shared_informer.go (master, read 2026-11-26)

`HasSynced` is a different thing. The same comment says it reports that the informer has been "informed by at least one full LIST of the authoritative state" and calls this "unrelated to \"resync\"". A relist after a watch failure is also a separate mechanism, and it does contact the API server. See [findings/an-expired-resourceversion-forces-a-relist-and-synchronized-relists-can-storm](an-expired-resourceversion-forces-a-relist-and-synchronized-relists-can-storm.md).

## What controller-runtime adds

controller-runtime's `SyncPeriod` is built on this replay. Its documentation says the period defaults to 10 hours with jitter, that it "does not sync between the local cache and the server", and that it triggers "an artificial Update event with the same object in both ObjectOld and ObjectNew". Predicates such as `GenerationChangedPredicate` therefore filter the replayed event out. The documentation recommends that `Reconcile` return `reconcile.Result{RequeueAfter: t}` to cover missed watch events, and does not recommend shortening `SyncPeriod` for that purpose. https://github.com/kubernetes-sigs/controller-runtime/blob/main/pkg/cache/cache.go (main; latest release tag read was v0.25.3)

## Consequences

A resync cannot repair a cache that is itself wrong, because it replays what the cache already holds. It does give every handler another chance to enqueue each key, which protects against a handler bug or a dropped enqueue, and it does nothing about a change the informer never received. A controller that needs to notice drift in an external system needs a `RequeueAfter` or a poll, not a resync. See [decisions/keep-informer-resync-disabled-or-set-a-periodic-resync](../decisions/keep-informer-resync-disabled-or-set-a-periodic-resync.md), [findings/the-word-resync-names-three-different-mechanisms-in-client-go-kro-and-ack](the-word-resync-names-three-different-mechanisms-in-client-go-kro-and-ack.md), [findings/projects-add-periodic-resync-as-a-safety-net-against-missed-events-and-bugs](projects-add-periodic-resync-as-a-safety-net-against-missed-events-and-bugs.md), and [concepts/informers-reflectors-and-workqueues](../concepts/informers-reflectors-and-workqueues.md).

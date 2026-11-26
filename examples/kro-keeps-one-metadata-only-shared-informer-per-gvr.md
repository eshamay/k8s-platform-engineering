---
title: kro keeps one metadata-only shared informer per GVR
type: example
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-m5-informers-caches
    hash: 1a6a4969c0c2
    ingested: 2026-11-26
aliases: []
tags: [kro, informers, cache, gvr, metadata-only]
---

# kro keeps one metadata-only shared informer per GVR

## Scenario

kro's dynamic controller watches the instances and children of every ResourceGraphDefinition it serves. Its watch manager "owns the lifecycle of one shared informer per GVR" and builds each informer from the metadata client, so "only object metadata is retrieved -- memory stays bounded as the set of watched GVRs grows." https://github.com/kubernetes-sigs/kro/blob/main/pkg/watch/manager.go (main, release v0.10.0 read 2026-11-26) [[sources/research-gap-m5-informers-caches]]

## Settings read from source

The controller `main.go` defaults to a resync of 36000 seconds, a rate limiter of 10 per second with burst 100, client QPS 100 with burst 150, controller concurrency flags of 1 each, and apply concurrency of 20. An optional warmup pre-populates the caches before leader election, and the code comment says this "improves leader failover time." https://github.com/kubernetes-sigs/kro/blob/main/cmd/controller/main.go

kro is the clearest of the four tools in [[comparisons/informer-and-cache-choices-across-kro-config-connector-ack-and-cluster-api]] for keying by GVR, in contrast to controller-runtime's GVK keys ([[findings/controller-runtime-tracks-informers-by-gvk-while-client-go-factories-key-by-go-type-or-gvr]]). Its "re list" flag text is explained in [[findings/the-word-resync-names-three-different-mechanisms-in-client-go-kro-and-ack]]. See also [[entities/kro]] and [[examples/kro-shared-queue-tunes-throughput]].

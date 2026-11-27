---
title: Flux controllers expose worker concurrency and Helm cache size as tuning knobs
type: example
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-informers-reflectors-and-workqueues
    hash: f9de5ca73ab6
    ingested: 2026-11-25
aliases: []
tags: [flux, workqueue, concurrency, cache, scale]
---

# Flux controllers expose worker concurrency and Helm cache size as tuning knobs

## Scenario

A platform team runs Flux against a growing number of Kustomizations and HelmReleases and finds that reconciles queue up or that the source controller runs short of memory. The Flux vertical scaling page describes what the operator can change. [sources/research-informers-reflectors-and-workqueues](../sources/research-informers-reflectors-and-workqueues.md)

## What the page describes

The `--concurrent` flags raise the number of parallel reconciles, which are the workqueue workers of each controller. The source controller can cache Helm repository indexes, bounded by `--helm-cache-max-size` and `--helm-cache-ttl`. The page recommends persistent volumes in place of EmptyDir for artifact storage, and it warns that "tmpfs will count against the controller's pod memory usage," so an in-memory artifact store raises the memory the pod needs. URL: https://fluxcd.io/flux/installation/configuration/vertical-scaling/.

## Lesson

Flux does not hide the queue. Worker concurrency and cache size are operator decisions, and raising one shifts load onto the API server or onto pod memory. The page describes the knobs but not the informer implementation behind them, and it gives no sharding guidance. See [entities/flux](../entities/flux.md), [comparisons/concurrency-and-cache-memory-controls-across-flux-argo-cd-and-crossplane](../comparisons/concurrency-and-cache-memory-controls-across-flux-argo-cd-and-crossplane.md), and [concepts/informers-reflectors-and-workqueues](../concepts/informers-reflectors-and-workqueues.md).

---
title: Objects that leave a Flux shard keep stale artifacts on the old source-controller
type: finding
status: draft
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-g1-named-adopters
    hash: 9f6a50098233
    ingested: 2026-11-26
aliases: [source-controller issue 2150]
tags: [pitfall, flux, sharding, source-controller, artifacts]
---

# Objects that leave a Flux shard keep stale artifacts on the old source-controller

## Observation

Source-controller issue 2150 (opened 2026-09-07, still open at read time) reports that when an object moves from one shard to another, its artifacts stay on the old shard's source-controller. The reporter is anonymous and says "we also hit it in production". [sources/research-gap-g1-named-adopters](../sources/research-gap-g1-named-adopters.md) URL: https://github.com/fluxcd/source-controller/issues/2150.

## Confidence

The finding is a self-report from an unnamed reporter. The code-level cause in the issue is the reporter's hypothesis, and no maintainer confirmation was read. The page stays a draft for that reason.

## Why it matters

Re-labeling objects to rebalance shards is the natural way to adjust a sharded setup, and this report says it leaves storage behind on the old shard. It is a second shard-move hazard alongside the label consistency rule in [findings/sharded-flux-dependents-must-carry-the-same-shard-label-as-their-parents](sharded-flux-dependents-must-carry-the-same-shard-label-as-their-parents.md).

## Related

[examples/flux-sharding-splits-reconciliation-across-label-selected-controller-instances](../examples/flux-sharding-splits-reconciliation-across-label-selected-controller-instances.md), [entities/flux](../entities/flux.md)

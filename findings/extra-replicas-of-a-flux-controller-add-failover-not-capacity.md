---
title: Extra replicas of a Flux controller add failover, not capacity
type: finding
status: active
created: 2026-11-25
updated: 2026-11-26
sources:
  - id: research-flux-deep-dive
    hash: e640ec8046bc
    ingested: 2026-11-25
  - id: research-gap-o2-flux-internals
    hash: 866650ffd3aa
    ingested: 2026-11-26
aliases: []
tags: [pitfall, flux, scale, leader-election, sharding]
---

# Extra replicas of a Flux controller add failover, not capacity

## Observation

The Flux sharding page says that extra replicas of a Flux controller are failover standbys and that only the elected leader reconciles. Scaling a deployment from one replica to three therefore does not triple throughput. Capacity grows only by raising concurrency and limits on the one active instance, or by sharding, which runs separately named controllers that watch disjoint sets of labeled objects. [sources/research-flux-deep-dive](../sources/research-flux-deep-dive.md)

## Why it matters

A team that sees slow reconciliation may reach for replicas first, which costs memory and changes nothing about the backlog. This is the same trade-off as in other controllers, where leader election prevents duplicate work at the price of a single active worker pool.

## Mitigations

Tune `--concurrent`, the intervals, and the resource limits first, and shard when one instance cannot keep up. See the decision page for the order.

## Related

[decisions/shard-flux-controllers-or-tune-intervals-and-concurrency-first](../decisions/shard-flux-controllers-or-tune-intervals-and-concurrency-first.md), [decisions/single-replica-versus-leader-election](../decisions/single-replica-versus-leader-election.md), [findings/duplicate-work-from-replicas-without-leader-election](duplicate-work-from-replicas-without-leader-election.md), [examples/flux-sharding-splits-reconciliation-across-label-selected-controller-instances](../examples/flux-sharding-splits-reconciliation-across-label-selected-controller-instances.md), [entities/flux](../entities/flux.md)

## Mechanism confirmed in source

The 2026-11-26 o2 dossier read the code behind this claim. Source-controller starts its artifact server only after `mgr.Elected()`, and non-leaders fail a readiness check that returns "manager is not the leader", so the sharding page can say standbys "stay not ready by design". The page is promoted to active. See [findings/flux-source-controller-starts-its-artifact-server-only-after-winning-leader-election-and-standbys-fail-readiness](flux-source-controller-starts-its-artifact-server-only-after-winning-leader-election-and-standbys-fail-readiness.md). [sources/research-gap-o2-flux-internals](../sources/research-gap-o2-flux-internals.md)

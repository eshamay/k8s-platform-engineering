---
title: Shard Flux controllers or tune intervals and concurrency first
type: decision
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-flux-deep-dive
    hash: e640ec8046bc
    ingested: 2026-11-25
aliases: []
tags: [decision, flux, scale, sharding]
---

# Shard Flux controllers or tune intervals and concurrency first

## Status

Open question framed by the sources, not an ADR authored by this wiki. No source states a threshold at which sharding becomes necessary.

## Context

A platform team sees Flux reconciliation falling behind as the number of Kustomizations and HelmReleases grows. Adding replicas does not help, since only the elected leader reconciles. The remaining choices are to tune the existing instance or to split the work across shards. [[sources/research-flux-deep-dive]]

## Options

Tuning means raising `--concurrent`, lengthening intervals, and adjusting resource limits. It needs no label discipline, and Morgan Stanley did exactly this at more than 500 clusters. Sharding runs extra controller instances that each watch a labeled subset of objects, which spreads the load across processes but requires every dependent object to carry matching labels, and the Flux Operator can automate the controller setup. Morgan Stanley lists sharding as future work, so there are no production numbers for it in the dossier.

## Consequences

Tuning first keeps the system simple and delays label bookkeeping, at the price of slower drift correction and higher memory per instance. Sharding adds operational structure and a new failure class, which is a child object on the wrong shard. A reasonable reading of the sources is to tune first and shard when a single instance reaches its limits, but no source states this as a rule.

## Related

[[comparisons/flux-scaling-options-intervals-concurrency-sharding-and-source-choice]], [[findings/extra-replicas-of-a-flux-controller-add-failover-not-capacity]], [[findings/sharded-flux-dependents-must-carry-the-same-shard-label-as-their-parents]], [[decisions/choosing-a-drift-check-interval-for-external-resources]], [[entities/flux]]

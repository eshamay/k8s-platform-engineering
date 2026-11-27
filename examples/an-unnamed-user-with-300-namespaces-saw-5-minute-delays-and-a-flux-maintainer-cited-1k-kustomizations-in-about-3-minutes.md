---
title: An unnamed user with 300 namespaces saw 5-minute delays and a Flux maintainer cited 1K Kustomizations in about 3 minutes
type: example
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-g1-named-adopters
    hash: 9f6a50098233
    ingested: 2026-11-26
aliases: [kustomize-controller issue 1174]
tags: [flux, kustomize-controller, scale, sharding, issue-report]
---

# An unnamed user with 300 namespaces saw 5-minute delays and a Flux maintainer cited 1K Kustomizations in about 3 minutes

## Scenario

On 2024-05-29 a user with more than 300 namespaces, each with one Kustomization, opened kustomize-controller issue 1174 about reconciliation delays of about five minutes. The user is anonymous and the employer is not named. [sources/research-gap-g1-named-adopters](../sources/research-gap-g1-named-adopters.md) URL: https://github.com/fluxcd/kustomize-controller/issues/1174.

## What the maintainer said

A maintainer replied that "A single kustomize-controller instance can do 1K reconciliation in about 3m", pointing at the flux-benchmark repository, and suggested tuning before sharding. See [examples/the-flux-benchmark-reconciles-1000-kustomizations-in-4-minutes-13-seconds-on-flux-v2-10-0](the-flux-benchmark-reconciles-1000-kustomizations-in-4-minutes-13-seconds-on-flux-v2-10-0.md) for the benchmark table.

## Why it belongs here

It is a documented case where a scale complaint was answered with tuning advice and not a shard recommendation, which supports the wiki's reading that most users should tune first. See [decisions/shard-flux-controllers-or-tune-intervals-and-concurrency-first](../decisions/shard-flux-controllers-or-tune-intervals-and-concurrency-first.md). It also names no organization, so it does not answer the gap about named sharding adopters.

## Related

[entities/flux](../entities/flux.md), [comparisons/flux-scaling-options-intervals-concurrency-sharding-and-source-choice](../comparisons/flux-scaling-options-intervals-concurrency-sharding-and-source-choice.md)

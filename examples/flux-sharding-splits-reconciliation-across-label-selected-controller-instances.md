---
title: Flux sharding splits reconciliation across label-selected controller instances
type: example
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-flux-deep-dive
    hash: e640ec8046bc
    ingested: 2026-11-25
aliases: []
tags: [use-case, flux, sharding, scale, flux-operator]
---

# Flux sharding splits reconciliation across label-selected controller instances

## Scenario

A single set of Flux controllers is reconciling so many objects that one instance cannot keep up. Running more replicas of the same controller does not help, because leader election means only one replica reconciles. [[sources/research-flux-deep-dive]]

## How it works

Sharding runs additional controller deployments under unique names, for example `source-controller-shard1`. Each shard starts with `--watch-label-selector` set to its own value of the label `sharding.fluxcd.io/key`, so it reconciles only objects that carry that label. The default controllers are configured to skip labeled objects, so no object is handled twice.

The label must be applied consistently. A HelmRepository, the HelmChart generated from it, and the HelmRelease that uses the chart all need matching labels, otherwise the pieces land on different controllers. A parent Kustomization can bulk-label the children it applies through `commonMetadata` and patches. The Flux Operator removes the manual work, since the shards are declared in the `FluxInstance` spec and the operator creates the extra controller sets and selectors.

The Morgan Stanley write-up lists sharding only as future work, so the dossier has no production numbers for it.

## Related

[[entities/flux]], [[entities/flux-operator]], [[findings/extra-replicas-of-a-flux-controller-add-failover-not-capacity]], [[findings/sharded-flux-dependents-must-carry-the-same-shard-label-as-their-parents]], [[examples/argo-cd-application-controller-shards-clusters-and-tunes-processor-counts]], [[decisions/shard-flux-controllers-or-tune-intervals-and-concurrency-first]]

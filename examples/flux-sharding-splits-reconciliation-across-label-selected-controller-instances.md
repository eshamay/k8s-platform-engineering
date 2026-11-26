---
title: Flux sharding splits reconciliation across label-selected controller instances
type: example
status: active
created: 2026-11-25
updated: 2026-11-26
sources:
  - id: research-flux-deep-dive
    hash: e640ec8046bc
    ingested: 2026-11-25
  - id: research-gap-g1-named-adopters
    hash: 9f6a50098233
    ingested: 2026-11-26
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

## Named adopters and documented incidents

The 2026-11-26 dossier searched adopter lists, the sharding docs, the Morgan Stanley write-up, and GitHub issues and found no organization that publicly says it runs sharded Flux at a stated scale. The sharding page advises the strategy "when Flux is managing tens of thousands of applications", and Stefan Prodan proposed the `--watch-label-selector` mechanism in flux2 issue 3731 on 2023-03-29. The only sharding users are anonymous issue reporters, covered in [[findings/a-flux-dependson-across-shards-failed-with-dependency-not-found-until-a-2024-fix]], [[findings/objects-that-leave-a-flux-shard-keep-stale-artifacts-on-the-old-source-controller]], and [[examples/a-hub-and-spoke-flux-user-reported-nightly-reconciliation-storms-and-was-told-to-shard-or-tune]]. No incident ties sharded Flux to API Priority and Fairness throttling, see [[findings/flux-turns-off-client-side-throttling-when-apf-is-enabled-but-a-custom-kubeconfig-path-kept-it-until-2026]]. [[sources/research-gap-g1-named-adopters]]

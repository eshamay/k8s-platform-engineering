---
title: Flux notification-controller and source-watcher do not support sharding and the documented recipe leaves image automation unsharded
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-o2-flux-internals
    hash: 866650ffd3aa
    ingested: 2026-11-26
aliases: []
tags: [flux, sharding, notification-controller, image-automation, limits]
---

# Flux notification-controller and source-watcher do not support sharding and the documented recipe leaves image automation unsharded

## Observation

The Flux sharding page says of notification-controller and source-watcher that "these controllers do not support sharding". Its example also deletes the image-reflector and image-automation Deployments from the shard sets, so the documented recipe shards the source, kustomize, and helm controllers and leaves image automation to the default instance. The page advises sharding "when Flux is managing tens of thousands of applications". [sources/research-gap-o2-flux-internals](../sources/research-gap-o2-flux-internals.md)

URL: https://github.com/fluxcd/website/blob/main/content/en/flux/installation/configuration/sharding.md, read on `main` on 2026-11-26.

## Reading with care

That image automation is not sharded in the recipe is an observation about the example, and the dossier does not say whether the image controllers can be sharded. The flux-operator sharding guide (docs/guides/instance/instance-sharding.md in controlplaneio-fluxcd/flux-operator) was found by code search and not read, so it may add detail.

## Why it matters

A sharding plan that targets load from notifications or image scanning will not be relieved by adding shards, because those controllers stay single instances.

## Related

[findings/a-flux-helmchart-generated-from-a-helmrelease-takes-its-shard-label-from-spec-chart-metadata-labels](a-flux-helmchart-generated-from-a-helmrelease-takes-its-shard-label-from-spec-chart-metadata-labels.md), [examples/flux-sharding-splits-reconciliation-across-label-selected-controller-instances](../examples/flux-sharding-splits-reconciliation-across-label-selected-controller-instances.md), [entities/flux-operator](../entities/flux-operator.md), [entities/flux](../entities/flux.md)

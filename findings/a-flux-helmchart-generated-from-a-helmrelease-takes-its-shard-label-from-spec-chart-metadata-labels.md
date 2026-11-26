---
title: A Flux HelmChart generated from a HelmRelease takes its shard label from spec.chart.metadata.labels
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-o2-flux-internals
    hash: 866650ffd3aa
    ingested: 2026-11-26
aliases: []
tags: [flux, sharding, helm, labels, mechanism]
---

# A Flux HelmChart generated from a HelmRelease takes its shard label from spec.chart.metadata.labels

## Observation

The Flux sharding page states the rule: "Source object kinds which have a dependency on another kind (i.e. `HelmChart` on a `HelmRepository`) need to have the same labels." Because a HelmChart is generated from a HelmRelease and not written by hand, the label is set through the HelmRelease's `.spec.chart.metadata.labels`, and the page describes this as setting "the sharding key on the generated Flux `HelmChart` object". For bulk assignment, a parent Kustomization applies `commonMetadata.labels` and a patch that adds the chart label on every HelmRelease. [[sources/research-gap-o2-flux-internals]]

URL: https://github.com/fluxcd/website/blob/main/content/en/flux/installation/configuration/sharding.md, read on `main` on 2026-11-26.

## What happens when the label is missing

The main controllers are told to ignore any keyed object with `--watch-label-selector=!sharding.fluxcd.io/key`. If a HelmRelease carries the shard key but its chart does not, the chart is handled by a different controller than the one that needs its artifact. The docs do not spell out the failure symptom, so the exact error a user would see is not verified.

## Related

[[findings/sharded-flux-dependents-must-carry-the-same-shard-label-as-their-parents]], [[findings/flux-notification-controller-and-source-watcher-do-not-support-sharding-and-the-documented-recipe-leaves-image-automation-unsharded]], [[examples/flux-sharding-splits-reconciliation-across-label-selected-controller-instances]], [[entities/flux]]

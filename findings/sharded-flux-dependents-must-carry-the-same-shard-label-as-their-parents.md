---
title: Sharded Flux dependents must carry the same shard label as their parents
type: finding
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-flux-deep-dive
    hash: e640ec8046bc
    ingested: 2026-11-25
aliases: []
tags: [pitfall, flux, sharding, labels, helm]
---

# Sharded Flux dependents must carry the same shard label as their parents

## Observation

A Flux shard reconciles only objects labeled with its `sharding.fluxcd.io/key` value, and the default controllers skip labeled objects. The sharding page says dependent objects must carry matching labels, for example the HelmRepository, the HelmChart, and the HelmRelease that uses them. An unlabeled child is picked up by the default controller while its parent sits on a shard, or by no controller that can serve it. Parent Kustomizations can label their children in bulk through `commonMetadata` and patches. The dossier notes a caveat about HelmChart labeling whose exact rule was not verified. [[sources/research-flux-deep-dive]]

## Mitigations

Label the whole chain from one parent, and verify each shard's objects after the change. The Flux Operator creates the selectors automatically but the labels still have to be applied.

## Related

[[examples/flux-sharding-splits-reconciliation-across-label-selected-controller-instances]], [[entities/flux-operator]], [[findings/extra-replicas-of-a-flux-controller-add-failover-not-capacity]], [[entities/flux]]

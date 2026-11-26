---
title: Sharded Flux dependents must carry the same shard label as their parents
type: finding
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
  - id: research-gap-o2-flux-internals
    hash: 866650ffd3aa
    ingested: 2026-11-26
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

## Reported failure with dependsOn

The label rule applies to `dependsOn` targets too. kustomize-controller issue 1175 (2024-05-30) reports "dependency 'application2-namespace/app' not found" in a sharded setup, fixed by PR 1248 on 2024-09-26. See [[findings/a-flux-dependson-across-shards-failed-with-dependency-not-found-until-a-2024-fix]]. [[sources/research-gap-g1-named-adopters]]

## Correction: the HelmChart labeling rule is now verified

Correction note, 2026-11-26: the Observation section above says the exact HelmChart labeling rule was not verified. The o2 dossier read it. A HelmChart is generated from a HelmRelease, so its shard label is set through `.spec.chart.metadata.labels` on the HelmRelease, and the docs say source kinds with a dependency on another kind "need to have the same labels". See [[findings/a-flux-helmchart-generated-from-a-helmrelease-takes-its-shard-label-from-spec-chart-metadata-labels]]. The docs still do not state the failure symptom of a mismatch. [[sources/research-gap-o2-flux-internals]]

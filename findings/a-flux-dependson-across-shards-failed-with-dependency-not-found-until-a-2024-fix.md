---
title: A Flux dependsOn across shards failed with dependency not found until a 2024 fix
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-g1-named-adopters
    hash: 9f6a50098233
    ingested: 2026-11-26
aliases: [kustomize-controller issue 1175]
tags: [pitfall, flux, sharding, dependson, kustomize-controller]
---

# A Flux dependsOn across shards failed with dependency not found until a 2024 fix

## Observation

On 2024-05-30 the user jordiclariana opened kustomize-controller issue 1175. They ran sharded Flux (Flux v2.2.3, kustomize-controller v1.2.2) with a mutating webhook that assigns shard labels, and a Kustomization that used `dependsOn` on an object in another shard failed with "dependency 'application2-namespace/app' not found". The issue was closed on 2024-09-26 through PR 1248. [[sources/research-gap-g1-named-adopters]] URL: https://github.com/fluxcd/kustomize-controller/issues/1175.

## Mechanism

Each shard watches only objects that carry its own label value, so a shard that cannot see the dependency's object reports it as missing. The label discipline described in [[findings/sharded-flux-dependents-must-carry-the-same-shard-label-as-their-parents]] therefore covers `dependsOn` targets as well as Helm chains.

## Mitigation

Keep dependency pairs on one shard, or run a Flux version that includes the fix from PR 1248. The reporter is a named GitHub user, but the dossier does not name an employer, so this is not an organizational adopter.

## Related

[[examples/flux-sharding-splits-reconciliation-across-label-selected-controller-instances]], [[entities/flux]]

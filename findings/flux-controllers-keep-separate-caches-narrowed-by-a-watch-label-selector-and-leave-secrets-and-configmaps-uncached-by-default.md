---
title: Flux controllers keep separate caches narrowed by a watch label selector and leave Secrets and ConfigMaps uncached by default
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-m5-informers-caches
    hash: 1a6a4969c0c2
    ingested: 2026-11-26
aliases: [Flux shared caches]
tags: [flux, cache, sharding, controller-runtime, mechanism]
---

# Flux controllers keep separate caches narrowed by a watch label selector and leave Secrets and ConfigMaps uncached by default

## Observation

The source-, kustomize- and helm-controller each build their own controller-runtime manager, so each is a separate process with its own informer cache. No source states this explicitly, and the dossier marks "not shared across controllers" as UNVERIFIED as a statement and inferred from each `main.go`; it searched the three mains and the Flux docs and found no cross-controller cache. [[sources/research-gap-m5-informers-caches]]

Each controller narrows its cache for its own custom kinds with `ByObject` and `Label: watchSelector`, for example `&kustomizev1.Kustomization{}: {Label: watchSelector}` in kustomize-controller and `&sourcev1.GitRepository{}:  {Label: watchSelector}` in source-controller. The selector comes from `--watch-label-selector`, and a `--watch-namespace` flag can limit the cache to one namespace. Each controller also appends Secret and ConfigMap to the client's `DisableFor` list, so reads of them go to the API server, unless the `CacheSecretsAndConfigMaps` feature gate is on. The Flux runtime package comment says the gate results in "increased memory usage and cluster-wide RBAC permissions (list and watch)." https://github.com/fluxcd/kustomize-controller/blob/main/main.go and https://github.com/fluxcd/pkg/blob/main/runtime/controller/features.go (main, read 2026-11-26)

## Scaling guidance from the Flux docs

The sharding page says "Extra replicas of a Flux controller are failover standbys. Only the elected leader reconciles, so they don't add capacity", and that "each controller can be deployed multiple times with a unique label selector which is used as the sharding key." It advises sharding "when Flux is managing tens of thousands of applications", and the vertical-scaling page advises more workers at hundreds of applications and a Helm index cache in source-controller to reduce its memory. Defaults read from source are `--concurrent` 4 for kustomize-controller and helm-controller and 2 for source-controller. https://fluxcd.io/flux/installation/configuration/sharding/ and https://fluxcd.io/flux/installation/configuration/vertical-scaling/

## Why it matters

The watch label selector is both a cache-narrowing option and the sharding key, so one mechanism serves two purposes. See [[comparisons/flux-label-sharding-versus-argo-cd-cluster-sharding]], [[findings/extra-replicas-of-a-flux-controller-add-failover-not-capacity]], [[findings/controller-runtime-narrows-its-cache-with-selectors-transforms-metadata-only-informers-and-disable-for-and-each-option-has-a-cost]], and [[entities/flux]].

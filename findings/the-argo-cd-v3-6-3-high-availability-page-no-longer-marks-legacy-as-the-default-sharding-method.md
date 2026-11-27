---
title: The Argo CD v3.6.3 high-availability page no longer marks legacy as the default sharding method
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-g3-argocd-capi
    hash: c3d485fa58ae
    ingested: 2026-11-26
  - id: research-gap-b1-unverified-claims
    hash: d152f98abb04
    ingested: 2026-11-26
aliases: []
tags: [pitfall, argo-cd, sharding, defaults, documentation]
---

# The Argo CD v3.6.3 high-availability page no longer marks legacy as the default sharding method

## Observation

At v2.8.0 the high-availability page read "Supported sharding methods are : [legacy (default), round-robin]." At v2.14.0 and v3.0.0 the list still showed "legacy (default)". The v3.6.3 page (released 2026-11-24) lists three methods, `legacy`, `round-robin`, and `consistent-hashing`, without the "(default)" marker. Nothing read says the default changed. The dossier did not read the `argocd-cmd-params-cm` reference or the v3.x upgrade notes, so whether `legacy` is still the default in v3.6.3 was UNVERIFIED when this page was written. Correction 2026-11-26: the default is `legacy`, confirmed in source, see the section below. [sources/research-gap-g3-argocd-capi](../sources/research-gap-g3-argocd-capi.md) URL: https://github.com/argoproj/argo-cd/blob/v3.6.3/docs/operator-manual/high_availability.md.

## Correction 2026-11-26

`common/common.go` sets `DefaultShardingAlgorithm = LegacyShardingAlgorithm` at v3.0.0 and v3.6.3, so the default did not change and only the docs marker was dropped. See [findings/argo-cd-v3-6-3-still-defaults-to-legacy-sharding-because-the-source-says-so-even-though-the-docs-page-dropped-the-marker](argo-cd-v3-6-3-still-defaults-to-legacy-sharding-because-the-source-says-so-even-though-the-docs-page-dropped-the-marker.md) and [sources/research-gap-b1-unverified-claims](../sources/research-gap-b1-unverified-claims.md).

## Why it matters

The legacy method is "uid based distribution (non-uniform)", and the other two are labelled experimental at v3.6.3. A team that wants to know what it runs today cannot learn the default from the current page. The source says it is `legacy`, and a team that changed it has to check the controller's `--sharding-method` setting or the parameters config map.

## Related

[findings/argo-cd-legacy-sharding-can-be-uneven-and-the-other-algorithms-were-labelled-experimental](argo-cd-legacy-sharding-can-be-uneven-and-the-other-algorithms-were-labelled-experimental.md), [comparisons/flux-label-sharding-versus-argo-cd-cluster-sharding](../comparisons/flux-label-sharding-versus-argo-cd-cluster-sharding.md), [entities/argo-cd](../entities/argo-cd.md), [concepts/scale-and-sharding](../concepts/scale-and-sharding.md)

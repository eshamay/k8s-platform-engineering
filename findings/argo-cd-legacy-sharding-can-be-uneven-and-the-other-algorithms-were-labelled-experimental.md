---
title: Argo CD legacy sharding can be uneven and the other algorithms were labelled experimental
type: finding
status: active
created: 2026-11-25
updated: 2026-11-26
sources:
  - id: research-scale-and-sharding
    hash: d082d1d36d7e
    ingested: 2026-11-25
  - id: research-gap-g3-argocd-capi
    hash: c3d485fa58ae
    ingested: 2026-11-26
  - id: research-gap-b1-unverified-claims
    hash: d152f98abb04
    ingested: 2026-11-26
  - id: research-gap-b1-recheck-capi-argocd
    hash: 832b86e20750
    ingested: 2026-11-26
aliases: []
tags: [pitfall, argo-cd, sharding, scale, algorithm]
---

# Argo CD legacy sharding can be uneven and the other algorithms were labelled experimental

## Observation

Argo CD assigns each destination cluster to one application-controller replica. The `ARGOCD_CONTROLLER_REPLICAS` setting tells each replica the total, and the assignment algorithm is selectable. The legacy algorithm is based on the cluster UID and can distribute clusters unevenly, while round-robin and consistent-hashing were described as experimental in the digest of the high-availability page. A cluster can also be pinned to a shard through a field on its cluster secret. https://argo-cd.readthedocs.io/en/stable/operator-manual/high_availability/ [[sources/research-scale-and-sharding]]

## Why it matters

Because the unit of sharding is a whole cluster, one very large cluster cannot be split, and an uneven assignment leaves one replica with most of the load while others idle. The experimental label means a team choosing a better distribution accepts maturity risk. Correction 2026-11-26: the label is not out of date. The v3.6.3 docs still call both algorithms experimental, as described below. The remaining gap is tracked in [[open-knowledge-gaps]].

## Related pages

[[examples/argo-cd-application-controller-shards-clusters-and-tunes-processor-counts]], [[comparisons/flux-label-sharding-versus-argo-cd-cluster-sharding]], [[entities/argo-cd]], [[concepts/scale-and-sharding]].

## Recheck at v3.6.3

The 2026-11-26 dossier read the docs source at Argo CD v3.6.3 (released 2026-11-24). "The `round-robin` shard distribution algorithm is an experimental feature." and "The `consistent-hashing` shard distribution algorithm is an experimental feature." The feature-maturity page lists "Cluster Sharding: consistent-hashing | v2.12.0 | Alpha" and round-robin as introduced in v2.8.0. The same warning appears at v2.14.0 and v3.0.0, and nothing read says either algorithm graduated or that the default changed. The docs cite a CNOE benchmark blog with encouraging results for consistent hashing, which the dossier did not read. See [[findings/the-argo-cd-v3-6-3-high-availability-page-no-longer-marks-legacy-as-the-default-sharding-method]] and [[sources/research-gap-g3-argocd-capi]].

## Default confirmed 2026-11-26

The default method is `legacy`: `DefaultShardingAlgorithm = LegacyShardingAlgorithm` in `common/common.go` at v3.0.0 and v3.6.3. The CNOE blog the docs cite (2023-11-21) was read and reports 3x better CPU utilization and 5x fewer rebalancings from the new algorithms, as the authors' own benchmark. See [[findings/argo-cd-v3-6-3-still-defaults-to-legacy-sharding-because-the-source-says-so-even-though-the-docs-page-dropped-the-marker]] and [[sources/research-gap-b1-unverified-claims]].

## Recheck on 2026-11-26

At v3.6.3 the high-availability page still says "The `round-robin` shard distribution algorithm is an experimental feature", says the same of `consistent-hashing`, and describes legacy as "`uid` based distribution (non-uniform)". The default is legacy, confirmed in code. See [[findings/argo-cd-v3-6-3-still-defaults-to-legacy-sharding-because-the-source-says-so-even-though-the-docs-page-dropped-the-marker]] and [[sources/research-gap-b1-recheck-capi-argocd]].

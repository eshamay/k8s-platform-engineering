---
title: "Argo CD v3.6.3 still defaults to legacy sharding because the source says so, even though the docs page dropped the marker"
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-b1-unverified-claims
    hash: d152f98abb04
    ingested: 2026-11-26
aliases: [argo cd default sharding]
tags: [argo-cd, sharding, defaults, documentation-conflict, verified]
---

# Argo CD v3.6.3 still defaults to legacy sharding because the source says so, even though the docs page dropped the marker

## Observation

`common/common.go` sets `DefaultShardingAlgorithm = LegacyShardingAlgorithm` at both v3.0.0 and v3.6.3, and the application controller's `--sharding-method` flag takes its default from that constant. The default is therefore `legacy`. Only the documentation changed: v3.0.0's high-availability page read "legacy (default)", while the v3.6.3 page lists `legacy`, `round-robin`, and `consistent-hashing` with no marker. [[sources/research-gap-b1-unverified-claims]] URL: https://github.com/argoproj/argo-cd/blob/v3.6.3/common/common.go

The v3.6.3 page still says "`legacy` mode uses an `uid` based distribution (non-uniform)", and it cites a CNOE blog dated 2023-11-21. That blog, read in this pass, reports that the new algorithms "improve CPU utilization by a factor of 3 and reduce application-to-shard rebalancing by a factor of 5". Those figures are the authors' own benchmarks, and the algorithms are developed with Red Hat. They do not change the Alpha label on round-robin and consistent-hashing.

## Why it matters

A team that reads only the v3.6.3 docs cannot learn the default and may assume a newer algorithm is active. The source default is legacy unless the team sets `--sharding-method` itself. The uneven distribution in [[findings/argo-cd-legacy-sharding-can-be-uneven-and-the-other-algorithms-were-labelled-experimental]] therefore applies to a default install. This supersedes the "unconfirmed" statement in [[findings/the-argo-cd-v3-6-3-high-availability-page-no-longer-marks-legacy-as-the-default-sharding-method]]. See [[entities/argo-cd]] and [[comparisons/flux-label-sharding-versus-argo-cd-cluster-sharding]].

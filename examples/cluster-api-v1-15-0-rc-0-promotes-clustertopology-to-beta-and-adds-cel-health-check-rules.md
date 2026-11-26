---
title: Cluster API v1.15.0-rc.0 promotes ClusterTopology to Beta and adds CEL health check rules
type: example
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-g3-argocd-capi
    hash: c3d485fa58ae
    ingested: 2026-11-26
  - id: research-gap-b1-recheck-capi-argocd
    hash: 832b86e20750
    ingested: 2026-11-26
aliases: []
tags: [cluster-api, clusterclass, release, feature-gates, pre-release]
---

# Cluster API v1.15.0-rc.0 promotes ClusterTopology to Beta and adds CEL health check rules

## Scenario

On 2026-11-24 the Cluster API project published v1.15.0-rc.0, the first release candidate of v1.15. Its release notes list "ClusterTopology to beta and enabled per default (#14398)" and "MHC now supports CEL-based health check rules". The v1.15.0 final release had not shipped on the research date, so everything on this page is a pre-release claim to recheck at release. [[sources/research-gap-g3-argocd-capi]] URL: https://github.com/kubernetes-sigs/cluster-api/releases/tag/v1.15.0-rc.0.

## How it works

The ClusterClass guide at the tag states "The `ClusterTopology` feature flag is enabled by default (Beta since CAPI v1.15)", and the feature-gates table lists `ClusterTopology` as Beta with the environment variable `CLUSTER_TOPOLOGY`. The same release adds two Alpha gates: `ClusterClassInlineTemplates`, which allows a ClusterClass without separate template objects, and a gate for worker version pinning whose proposal is dated 2026-07-06. The MachineHealthCheck addition is the `spec.checks.unhealthyExpressions` field listed in the v1.14-to-v1.15 migration notes. The v1.14.4 docs still carried the heading "Experimental Feature: ClusterClass (alpha)".

## Lesson

A feature label in a doc page is tied to a release. The wiki's earlier alpha label for ClusterClass reflected pre-v1.15 docs and is now out of date for the release candidate, while Beta is still short of GA. See [[findings/cluster-api-clusterclass-maturity-labels-disagree-across-doc-versions-and-the-original-proposal-still-says-provisional]], [[examples/cluster-api-clusterclass-expands-a-small-topology-into-many-machine-and-infrastructure-objects]], [[examples/cluster-api-v1beta2-machine-health-check-short-circuits-remediation-and-hands-off-to-external-controllers]], and [[entities/cluster-api]].

## Recheck on 2026-11-26

A later pass confirmed that v1.15.0 final is still unreleased, that newest stable is v1.14.4, and that `main` carries the same Beta, default-true `ClusterTopology` gate and the same MachineHealthCheck fields as rc.0. The worker version pinning gate is `ClusterTopologyWorkerVersionPinning`, Alpha, and requires `ClusterTopology`. No source says ClusterClass is GA. See [[findings/cluster-api-v1-15-0-final-was-not-released-on-2026-11-26-so-every-v1-15-statement-is-a-release-candidate-claim]] and [[sources/research-gap-b1-recheck-capi-argocd]].

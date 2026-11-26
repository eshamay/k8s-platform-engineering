---
title: Cluster API ClusterClass maturity labels disagree across doc versions and the original proposal still says provisional
type: finding
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
tags: [pitfall, cluster-api, clusterclass, maturity, documentation]
---

# Cluster API ClusterClass maturity labels disagree across doc versions and the original proposal still says provisional

## Observation

Three places give three labels. The v1.14.4 docs head the page "Experimental Feature: ClusterClass (alpha)". The v1.15.0-rc.0 docs say "The `ClusterTopology` feature flag is enabled by default (Beta since CAPI v1.15)", and the feature-gates table lists Beta. The original proposal "ClusterClass and Managed Topologies" (created 2021-05-26) still carries `status: provisional` in its frontmatter, although its implementation history records later additions: MachineHealthCheck support on 2022-01-10 and upgrade plans on 2025-05-13. The proposal also describes the first rollout "under a feature flag which would be unset by default". [[sources/research-gap-g3-argocd-capi]] URL: https://github.com/kubernetes-sigs/cluster-api/blob/v1.15.0-rc.0/docs/proposals/20210526-cluster-class-and-managed-topologies.md.

## Why it matters

Any statement of ClusterClass maturity needs a release number. The Beta label is a release candidate claim, since v1.15.0 final had not shipped on 2026-11-26, and Beta is not GA. The proposal's frontmatter is a poor guide to maturity because it was not updated as the feature grew.

## Mitigations

Cite the feature-gates table for the release in use, and recheck when v1.15.0 final is out. See [[examples/cluster-api-v1-15-0-rc-0-promotes-clustertopology-to-beta-and-adds-cel-health-check-rules]], [[examples/cluster-api-clusterclass-expands-a-small-topology-into-many-machine-and-infrastructure-objects]], [[findings/crossplane-v2-5-docs-and-source-disagree-on-stage-labels-condition-status-and-group-suffixes]] for a parallel docs-versus-code mismatch, and [[entities/cluster-api]].

## Recheck on 2026-11-26

The Beta label now holds at both v1.15.0-rc.0 and `main` (`ClusterTopology: {Default: true, PreRelease: featuregate.Beta}`, with code comments "alpha: v0.4" and "beta: v1.15"). It is still the label of a release candidate and a branch, not of a final release, and no source read calls ClusterClass GA. The proposal's `provisional` status line was not re-read in this pass. See [[findings/cluster-api-v1-15-0-final-was-not-released-on-2026-11-26-so-every-v1-15-statement-is-a-release-candidate-claim]] and [[sources/research-gap-b1-recheck-capi-argocd]].

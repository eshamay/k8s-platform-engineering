---
title: "Cluster API v1.15.0 final was not released on 2026-11-26, so every v1.15 statement is a release candidate claim"
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-b1-recheck-capi-argocd
    hash: 832b86e20750
    ingested: 2026-11-26
aliases: [cluster api v1.15 not released]
tags: [pitfall, cluster-api, release, pre-release, clusterclass, machinehealthcheck, verified]
---

# Cluster API v1.15.0 final was not released on 2026-11-26, so every v1.15 statement is a release candidate claim

## Observation

On 2026-11-26 the newest Cluster API tag and GitHub release was v1.15.0-rc.0, published 2026-11-24 and flagged as a prerelease. No v1.15.0 final existed, and the newest stable release was v1.14.4 (2026-11-03). The release listing read "v1.15.0-rc.0 2026-11-24T15:10:47Z true". [sources/research-gap-b1-recheck-capi-argocd](../sources/research-gap-b1-recheck-capi-argocd.md) URL: https://api.github.com/repos/kubernetes-sigs/cluster-api/releases

The recheck read the v1.15.0-rc.0 tag and `main`, and they agree on what was checked. The v1beta2 MachineHealthCheck keeps `unhealthyExpressions` (CEL, at most 10 items), `remediation.templateRef`, and `remediation.triggerIf.unhealthyLessThanOrEqualTo`, with `unhealthyInRange` taking precedence. The `ClusterTopology` gate is `{Default: true, PreRelease: featuregate.Beta}` on both, with code comments "alpha: v0.4" and "beta: v1.15". A new Alpha gate, `ClusterTopologyWorkerVersionPinning`, requires `ClusterTopology`. Nothing read says ClusterClass is GA.

## Why it matters

The wiki's MachineHealthCheck and ClusterClass maturity statements carry the note "recheck at v1.15.0 final". That recheck cannot be completed until the final release exists. What the pass did add is that `main` has not drifted from rc.0 on those points, which lowers the chance that the release candidate text changes before release. It does not turn the Beta label into a final-release label.

## Mitigations

Quote the release number with any v1.15 claim, and name v1.14.4 as the newest stable release when giving production guidance. Rerun the recheck when v1.15.0 final is published. The 100 percent default, the rounding rule, the KubeadmControlPlane retry fields, and the v1beta1 to v1beta2 mapping were not re-read in this pass, so they rest on the earlier dossier. See [findings/cluster-api-clusterclass-maturity-labels-disagree-across-doc-versions-and-the-original-proposal-still-says-provisional](cluster-api-clusterclass-maturity-labels-disagree-across-doc-versions-and-the-original-proposal-still-says-provisional.md), [examples/cluster-api-v1-15-0-rc-0-promotes-clustertopology-to-beta-and-adds-cel-health-check-rules](../examples/cluster-api-v1-15-0-rc-0-promotes-clustertopology-to-beta-and-adds-cel-health-check-rules.md), [examples/cluster-api-v1beta2-machine-health-check-short-circuits-remediation-and-hands-off-to-external-controllers](../examples/cluster-api-v1beta2-machine-health-check-short-circuits-remediation-and-hands-off-to-external-controllers.md), and [entities/cluster-api](../entities/cluster-api.md).

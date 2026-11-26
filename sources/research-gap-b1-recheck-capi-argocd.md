---
title: "Research dossier: recheck of Cluster API and Argo CD gaps (b1-recheck-capi-argocd)"
type: source
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-b1-recheck-capi-argocd
    hash: 8ddfe827b22b
    ingested: 2026-11-26
aliases: []
tags: [cluster-api, argo-cd, kstatus, research-dossier, gap-closing, targeted-pass, verification]
---

# Research dossier: recheck of Cluster API and Argo CD gaps (b1-recheck-capi-argocd)

> [!NOTE]
> **Raw file:** `raw/research-gap-b1-recheck-capi-argocd.md` (sha256 prefix 8ddfe827b22b; revised from 832b86e20750, see Revision note)<br>
> **Kind:** Verified research dossier for gap cluster b1-recheck-capi-argocd, dated 2026-11-26<br>
> **Ingested:** 2026-11-26 as a targeted pass over the Cluster API and Argo CD pages that rested on a release candidate or an older page<br>
> **Caveat:** All evidence came from `gh api` reads of source and documentation files at named tags. No web search was run, the CNOE sharding blog was not read in this pass, and the kstatus-on-Cluster conclusion is an inference.

## Summary

The dossier rechecked five items. Its main result for Cluster API is negative: v1.15.0 final does not exist on 2026-11-26. The newest tag and GitHub release is v1.15.0-rc.0 (2026-11-24, prerelease) and the newest stable release is v1.14.4 (2026-11-03), so a recheck "at v1.15.0 final" cannot be completed yet. The v1.15.0-rc.0 source and `main` agree on every MachineHealthCheck field and on the `ClusterTopology` gate that were checked.

For Argo CD, `legacy` is the default sharding algorithm at v3.6.3 in both the code constant and the controller flag default, and round-robin and consistent-hashing are still labelled experimental. The `timeout.reconciliation` default was 180 seconds at v2.1.0, v2.2.0, v2.3.0, and v2.4.0, which fills the version range that the earlier sample skipped.

## Key claims

- The newest Cluster API tag and release is v1.15.0-rc.0 (prerelease, 2026-11-24). v1.15.0 final does not exist. The newest stable release is v1.14.4. VERIFIED. https://api.github.com/repos/kubernetes-sigs/cluster-api/releases
- At v1.15.0-rc.0 and on `main`, the v1beta2 MachineHealthCheck has CEL `unhealthyExpressions` limited to 10 items, `remediation.templateRef` for external remediation, and `remediation.triggerIf.unhealthyLessThanOrEqualTo` with `unhealthyInRange` taking precedence. VERIFIED for field names and the precedence comment only. https://github.com/kubernetes-sigs/cluster-api/blob/main/api/core/v1beta2/machinehealthcheck_types.go
- The dossier did not re-read the 100 percent default, the rounding rule, the KubeadmControlPlane retry fields, or the v1beta1 to v1beta2 mapping, so those stay as earlier passes recorded them.
- `ClusterTopology` is Beta and default true at v1.15.0-rc.0 and on `main`, with code comments "alpha: v0.4" and "beta: v1.15" in `pkg/features/features.go`. VERIFIED. https://github.com/kubernetes-sigs/cluster-api/blob/v1.15.0-rc.0/pkg/features/features.go
- A new Alpha gate `ClusterTopologyWorkerVersionPinning` is new in v1.15 and requires `ClusterTopology`. VERIFIED.
- That ClusterClass is GA is UNVERIFIED. Nothing read says so.
- The status proposal (status implementable, last updated 2025-01-30) drops `Ready` from higher-level objects and adds `Available`, while Machine `Ready` means "machine can host workloads". VERIFIED. https://github.com/kubernetes-sigs/cluster-api/blob/v1.15.0-rc.0/docs/proposals/20240916-improve-status-in-CAPI-resources.md
- The v1beta2 Cluster type defines `ClusterAvailableCondition = AvailableCondition`, and a grep found no Cluster `Ready` constant. VERIFIED.
- kstatus checks deletion, generation, and the `Reconciling` and `Stalled` conditions first, then type-specific rules, and for unknown kinds looks for `Ready`. Its README says a resource without a `Ready` condition falls back to "assume they are always reconciled". VERIFIED. https://github.com/kubernetes-sigs/cli-utils/blob/master/pkg/kstatus/README.md
- That a kstatus-style tool therefore reports a v1beta2 Cluster as Current regardless of `Available` is UNVERIFIED, an inference from the two sources above. Nobody ran kstatus against a v1beta2 Cluster.
- Argo CD v3.6.3 (2026-11-24) sets `DefaultShardingAlgorithm = LegacyShardingAlgorithm` and the controller flag default reads that constant. VERIFIED. https://github.com/argoproj/argo-cd/blob/v3.6.3/common/common.go
- v3.6.3 is the newest 3.6.x release. v3.5.9 was published later the same day on a maintenance branch. VERIFIED, with that qualification.
- round-robin and consistent-hashing are still "an experimental feature" at v3.6.3, and legacy is "uid based distribution (non-uniform)". VERIFIED. https://github.com/argoproj/argo-cd/blob/v3.6.3/docs/operator-manual/high_availability.md
- That consistent-hashing benchmark results are encouraging is SECONDARY-ONLY, because the docs cite the CNOE blog and this pass did not read it. https://cnoe.io/blog/argo-cd-application-scalability
- `timeout.reconciliation: 180s` appears in `argocd-cm.yaml` at v2.1.0, v2.2.0, v2.3.0, and v2.4.0, and `defaultAppResyncPeriod = 180` appears in the controller at v2.1.0 and v2.4.0. The v2.5.0 FAQ says "The default polling interval is 3 minutes (180 seconds)." VERIFIED.
- The v3.0.0 `argocd-cm.yaml` says "Two minutes by default with additional jitter" and adds `timeout.reconciliation.jitter: 60s`. Pull request 22342 (merged 2025-03-13) added the jitter and says "the maximum default is the same (at least every 3 minutes)." VERIFIED. https://github.com/argoproj/argo-cd/pull/22342
- Why the base value dropped from 180 to 120 seconds is UNVERIFIED. The linked issue and review comments of the pull request were not opened.

## Revision note

The raw file was revised on 2026-11-26 after a second adversarial verification pass that re-fetched the release listings, `features.go`, the MachineHealthCheck types, the feature-gates and ClusterClass pages, the status proposal, `cluster_types.go`, the kstatus README and `generic.go`, the Argo CD sharding constants and HA docs, `argocd-cm.yaml` at v2.1.0 to v2.4.0 and v3.0.0, the controller constants, the v2.5.0 FAQ, and pull request 22342. Every checked quote and version reproduced and no further corrections were needed. The pass did not re-check the "Alpha Features" note wording in the Argo CD HA page, the CNOE blog (still SECONDARY-ONLY), or the kstatus-on-Cluster inference (still UNVERIFIED). Pages written from the first revision (hash 832b86e20750) keep that hash in their `sources` entry, because no claim changed.

## Not found

- Cluster API v1.15.0 final, any ClusterClass GA announcement, and any source that states directly how kstatus handles a v1beta2 `Available` condition.
- Any primary text giving the reason the Argo CD base interval changed from 180 to 120 seconds.
- Flux CEL health-check documentation and real-world MachineHealthCheck remediation incidents were not searched in this pass.

## Relation to earlier dossiers

[[sources/research-gap-b1-unverified-claims]] read the CNOE blog and recorded the authors' own benchmark figures, which this dossier did not repeat. The two do not conflict, and the benchmark remains the authors' own measurement. [[sources/research-gap-g3-argocd-capi]] and [[sources/research-gap-g3-reconcile-defaults]] supplied the earlier Cluster API, sharding, and interval baselines that this dossier extends.

## Pages updated from this source

[[entities/cluster-api]], [[entities/argo-cd]], [[entities/kstatus]], [[findings/premature-readiness-in-kstatus-based-tools]], [[examples/cluster-api-adds-available-and-operation-conditions-beside-ready]], [[examples/cluster-api-v1-15-0-rc-0-promotes-clustertopology-to-beta-and-adds-cel-health-check-rules]], [[examples/cluster-api-v1beta2-machine-health-check-short-circuits-remediation-and-hands-off-to-external-controllers]], [[findings/cluster-api-clusterclass-maturity-labels-disagree-across-doc-versions-and-the-original-proposal-still-says-provisional]], [[findings/argo-cd-changed-its-default-polling-from-a-flat-180-seconds-to-120-seconds-plus-60-seconds-of-jitter-in-v3-0-and-some-docs-still-say-three-minutes]], [[findings/argo-cd-v3-6-3-still-defaults-to-legacy-sharding-because-the-source-says-so-even-though-the-docs-page-dropped-the-marker]], [[findings/argo-cd-legacy-sharding-can-be-uneven-and-the-other-algorithms-were-labelled-experimental]], [[comparisons/flux-label-sharding-versus-argo-cd-cluster-sharding]], [[comparisons/reconcile-cadence-and-off-switches-across-tools]].

## Pages created from this source

[[findings/cluster-api-v1-15-0-final-was-not-released-on-2026-11-26-so-every-v1-15-statement-is-a-release-candidate-claim]], [[findings/kstatus-treats-an-unknown-kind-without-a-ready-condition-as-always-reconciled]], [[examples/argo-cd-pull-request-22342-added-a-60-second-default-jitter-while-keeping-the-three-minute-maximum]].

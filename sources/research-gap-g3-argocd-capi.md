---
title: "Research dossier: Argo CD sharding and Cluster API gap cluster (g3-argocd-capi)"
type: source
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-g3-argocd-capi
    hash: c3d485fa58ae
    ingested: 2026-11-26
aliases: []
tags: [argo-cd, sharding, cluster-api, machinehealthcheck, clusterclass, research-dossier, gap-closing, targeted-pass]
---

# Research dossier: Argo CD sharding and Cluster API gap cluster (g3-argocd-capi)

> [!NOTE]
> **Raw file:** `raw/research-gap-g3-argocd-capi.md` (sha256 prefix c3d485fa58ae)<br>
> **Kind:** Verified research dossier for gap cluster g3-argocd-capi, dated 2026-11-26<br>
> **Ingested:** 2026-11-26 as a targeted pass over existing Argo CD, Cluster API, sharding, and readiness pages<br>
> **Caveat:** The dossier read raw source files from the upstream GitHub repositories at named tags, not the rendered docs sites. Cluster API v1.15.0 final was not released on the research date, so the v1.15 claims come from the first release candidate, v1.15.0-rc.0 (published 2026-11-24). The CNOE sharding benchmark blog was not read.

## Summary

The dossier answers four gaps from primary files. For Argo CD, the newest docs read (v3.6.3, released 2026-11-24) still call both `round-robin` and `consistent-hashing` "an experimental feature", and the feature-maturity page lists them as Alpha (introduced in v2.8.0 and v2.12.0). The warning text is the same as at v2.14.0 and v3.0.0, so the wiki's "experimental" label is not stale. The v3.6.3 page no longer carries the "(default)" marker that v2.14.0 and v3.0.0 showed beside `legacy`, so the current default was not confirmed.

For Cluster API, the v1beta2 API (introduced in v1.11.0 on 2025-08-19) reshaped MachineHealthCheck. The short-circuit field `maxUnhealthy` became `remediation.triggerIf.unhealthyLessThanOrEqualTo`, `unhealthyRange` became `unhealthyInRange`, the checks moved under `spec.checks`, and the external remediation reference became `remediation.templateRef`. The default threshold is 100 percent, which turns the guard off. v1.15 adds CEL `unhealthyExpressions`. The "Ready to Available" change is narrower than the gap title implies: higher-level objects such as Cluster drop `Ready` and gain `Available`, while Machine keeps `Ready` with a new meaning, and no Cluster API or Flux page gives a general rule for kstatus-style tools. The `ClusterTopology` feature gate is Beta and on by default in v1.15.0-rc.0, while v1.14.4 docs still say alpha, and the original ClusterClass proposal still declares `status: provisional`.

## Key claims

- Argo CD v3.6.3 supports three sharding methods, and the page states "`legacy` mode uses an `uid` based distribution (non-uniform)." URL: https://github.com/argoproj/argo-cd/blob/v3.6.3/docs/operator-manual/high_availability.md.
- The same page says "The `round-robin` shard distribution algorithm is an experimental feature." and "The `consistent-hashing` shard distribution algorithm is an experimental feature." It asks for community feedback before moving the feature "to a production ready state".
- The feature-maturity page at v3.6.3 lists "Cluster Sharding: consistent-hashing | v2.12.0 | Alpha", round-robin as introduced in v2.8.0, and "Dynamic Cluster Distribution | v2.9.0 | Alpha" as a separate Alpha feature. URL: https://github.com/argoproj/argo-cd/blob/v3.6.3/docs/operator-manual/feature-maturity.md.
- The experimental warning is the same at v3.0.0 and v2.14.0. At v2.8.0 only `legacy` and `round-robin` existed: "Supported sharding methods are : [legacy (default), round-robin]."
- Argo CD v3.6.3, v3.5.9, and v3.4.15 were all published on 2026-11-24.
- SECONDARY-ONLY: the Argo CD docs say consistent hashing is "documented on the CNOE blog with encouraging results". The blog at https://cnoe.io/blog/argo-cd-application-scalability was not read.
- Cluster API MachineHealthCheck in v1beta2 uses `checks` and `remediation.triggerIf.unhealthyLessThanOrEqualTo`. The guide says "short circuiting mechanism is **disabled by default** and Machines will be remediated no matter the state of the cluster." URL: https://github.com/kubernetes-sigs/cluster-api/blob/v1.15.0-rc.0/docs/book/src/user/guide/lifecycle/healthchecking.md.
- Remediation is skipped when the unhealthy count exceeds the limit, percentages round down, and "If both `unhealthyLessThanOrEqualTo` and `unhealthyInRange` are specified, `unhealthyInRange` takes precedence."
- v1beta1 `maxUnhealthy` is marked "Deprecated: This field is deprecated and is going to be removed in the next apiVersion." (issue 10722). The v1.11.0 docs (2025-08-19) still used `maxUnhealthy` and `unhealthyRange`.
- External remediation uses `remediation.templateRef`, and the controller "hands off remediation of the machine to a controller that lives outside of Cluster API."
- v1.15 adds CEL-based `checks.unhealthyExpressions`, OR-combined with a maximum of 10 entries, and the release notes say "MHC now supports CEL-based health check rules". URL: https://github.com/kubernetes-sigs/cluster-api/releases/tag/v1.15.0-rc.0.
- MachineHealthChecks "currently **only** support Machines that are owned by a `MachineDeployment`, a `MachineSet` or a `KubeadmControlPlane`."
- KubeadmControlPlane remediation "MUST preserve etcd quorum". A non-working kubelet on the etcd leader node blocks it (issue 8465), and the manual workaround is to forward etcd leadership and delete the Machine. Its retry controls are `maxRetry`, `retryPeriodSeconds`, and `minHealthyPeriodSeconds` (default 3600), and "If `maxRetry` is not set (default), remediation will be retried infinitely."
- Remediation is skipped for Machines with the `cluster.x-k8s.io/skip-remediation` annotation or paused clusters. With ClusterClass, MachineHealthChecks come from the class, can be overridden or disabled under `spec.topology`, and "direct changes to the `MachineHealthCheck` resources will be overridden".
- The proposal "Improving status in CAPI resources" (status implementable, last updated 2025-01-30) says "the `Ready` condition won't have to exist on all resources anymore" and introduces `Available`, motivated by consumers such as "Helm, Flux, Argo, and so on". Machine `Ready` is redefined to mean the "machine can host workloads". URL: https://github.com/kubernetes-sigs/cluster-api/blob/v1.15.0-rc.0/docs/proposals/20240916-improve-status-in-CAPI-resources.md.
- Cluster `Available` is true when RemoteConnectionProbe, InfrastructureReady, ControlPlaneAvailable, WorkersAvailable, and TopologyReconciled are true, plus any conditions listed in `spec.availabilityGates`.
- The v1beta2 Cluster type defines `ClusterAvailableCondition`, and a text search of `cluster_types.go` found no Cluster ready-condition constant. Machine defines both `MachineAvailableCondition` and `MachineReadyCondition`.
- v1beta1 is removed "tentatively in April 2027" per the v1.14-to-v1.15 migration notes.
- The kstatus README says a resource with no `Ready` condition falls back to the strategy for unknown resources, "which is to assume they are always reconciled." Flux's community CEL cheatsheet (last changed 2026-04-21) shows a `cluster.x-k8s.io/v1beta1` Cluster keyed on the `Ready` condition, and Kustomization and HelmRelease accept `.spec.healthCheckExprs`.
- The `ClusterTopology` gate is Beta and on by default from v1.15: "The `ClusterTopology` feature flag is enabled by default (Beta since CAPI v1.15)." The release notes list "ClusterTopology to beta and enabled per default (#14398)". The v1.14.4 docs still carried "Experimental Feature: ClusterClass (alpha)". `ClusterClassInlineTemplates` and worker version pinning are Alpha gates in v1.15.
- The ClusterClass CAEP (created 2021-05-26) describes a Cluster that "provides a single control point to manage the Kubernetes version, worker pools, labels, replicas", with continuous reconciliation of managed objects. Its frontmatter still says `status: provisional`, and its history records MachineHealthCheck support (2022-01-10) and upgrade plans (2025-05-13).
- Cluster API v1.15.0 final was not released on the research date. The latest tag was v1.15.0-rc.0 (2026-11-24). The support-table dates in the releases page are projected, so treat the support statuses as planned.

## Not found

- UNVERIFIED: `legacy` is the default sharding method in v3.6.3. The v3.6.3 list omits "(default)". The `argocd-cmd-params-cm` reference and the v3.x upgrade notes were not read, so the result is inconclusive.
- UNVERIFIED: a naive kstatus tool would see a v1beta2 Cluster as reconciled because it has no `Ready` condition. This is an inference from two verified claims and was not tested on a live cluster.
- No graduation of round-robin or consistent-hashing to Beta or stable was found in any Argo CD version read.
- No general rule for kstatus or Flux on judging v1beta2 Cluster API objects by `Available`, and no v1beta2 Cluster CEL expression in Flux community docs.
- No real-world incident reports for MachineHealthCheck remediation storms or Argo CD sharding adopters were found, and none were searched for beyond the primary docs.

## Pages updated from this source

[[entities/argo-cd]], [[entities/cluster-api]], [[concepts/scale-and-sharding]], [[comparisons/flux-label-sharding-versus-argo-cd-cluster-sharding]], [[examples/argo-cd-application-controller-shards-clusters-and-tunes-processor-counts]], [[findings/argo-cd-legacy-sharding-can-be-uneven-and-the-other-algorithms-were-labelled-experimental]], [[examples/cluster-api-machine-health-check-replaces-failed-nodes]], [[findings/remediation-can-amplify-an-outage]], [[comparisons/reconcile-cadence-and-off-switches-across-tools]], [[examples/cluster-api-clusterclass-expands-a-small-topology-into-many-machine-and-infrastructure-objects]], [[examples/cluster-api-adds-available-and-operation-conditions-beside-ready]], [[findings/one-mandatory-ready-condition-that-summarizes-everything-is-too-rigid]], [[findings/premature-readiness-in-kstatus-based-tools]], [[examples/cluster-api-readiness-gates-flux-dependents]]

## Pages created from this source

[[examples/cluster-api-v1beta2-machine-health-check-short-circuits-remediation-and-hands-off-to-external-controllers]], [[examples/cluster-api-kubeadm-control-plane-remediation-must-preserve-etcd-quorum-and-has-its-own-retry-controls]], [[examples/cluster-api-v1-15-0-rc-0-promotes-clustertopology-to-beta-and-adds-cel-health-check-rules]], [[findings/the-cluster-api-machine-health-check-short-circuit-is-off-by-default-so-remediation-is-unbounded-until-a-threshold-is-set]], [[findings/a-non-working-kubelet-on-the-etcd-leader-blocks-cluster-api-control-plane-remediation]], [[findings/the-flux-cel-cheatsheet-keys-cluster-api-health-on-ready-and-shows-no-v1beta2-available-variant]], [[findings/cluster-api-v1beta1-maxunhealthy-and-unhealthyrange-are-deprecated-and-older-material-uses-the-old-names]], [[findings/cluster-api-clusterclass-maturity-labels-disagree-across-doc-versions-and-the-original-proposal-still-says-provisional]], [[findings/the-argo-cd-v3-6-3-high-availability-page-no-longer-marks-legacy-as-the-default-sharding-method]]

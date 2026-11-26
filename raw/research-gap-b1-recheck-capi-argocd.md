# Research dossier: gap cluster b1-recheck-capi-argocd

Research date: 2026-11-26

## Overview

This pass rechecked five items that the wiki had settled from a release candidate or an older page. The main finding for Cluster API is that v1.15.0 final does not exist as of 2026-11-26. The newest tag and GitHub release is v1.15.0-rc.0 (2026-11-24, prerelease), and the newest stable release is v1.14.4 (2026-11-03). So "recheck at v1.15.0 final" cannot be completed. I read the v1.15.0-rc.0 source and the `main` branch for MachineHealthCheck types and the ClusterTopology feature gate. The two agree on every point checked.

For Argo CD, the newest release read is v3.6.3 (2026-11-24). In the source at v3.6.3, `legacy` is the default sharding algorithm (code constant and CLI flag default), which settles the question the wiki left open when the docs page dropped its "(default)" marker. Round-robin and consistent-hashing are still labelled experimental in the v3.6.3 docs. For the reconcile interval, `timeout.reconciliation: 180s` appears in `argocd-cm.yaml` at v2.1.0, v2.2.0, v2.3.0 and v2.4.0, and the controller constant `defaultAppResyncPeriod = 180` appears at v2.1.0 and v2.4.0. The v3.0 change (PR 22342, merged 2025-03-13) adds a 60 second default jitter. The PR body says the maximum default stays the same, at least every 3 minutes. No primary text states a motivation beyond the jitter comment in `argocd-cm.yaml`, which says periodic refresh of many applications can cause a spike in the refresh queue.

For readiness, the v1beta2 Cluster API Cluster type defines an `Available` condition constant and no `Ready` constant in the lines read. The status proposal says it drops `Ready` from higher-level objects. kstatus (cli-utils) reads `Ready` only for resources without type-specific rules, and treats unknown resources as always reconciled when no `Ready` condition exists. The conclusion that a kstatus-style tool sees a v1beta2 Cluster as reconciled is therefore a strong inference from two primary sources, but no source states it directly, so it is marked as inference.

## Gap: Current Cluster API MachineHealthCheck behavior

Findings: v1.15.0 final is not released. At v1.15.0-rc.0 and at `main` the v1beta2 MachineHealthCheck type is the same on every field I checked. It has `unhealthyExpressions` (CEL, max 10 items), `remediation.templateRef`, `remediation.triggerIf.unhealthyLessThanOrEqualTo` and `unhealthyInRange` (the latter takes precedence), and `DefaultNodeStartupTimeoutSeconds = 600`. I did not re-read the default-100-percent behavior, the rounding rule, or the KubeadmControlPlane retry fields in this pass; those remain as the wiki already records them from the earlier pass. Verified here is only that the field names and the precedence comment exist unchanged at rc.0 and `main`. The Cluster API v1beta1 to v1beta2 mapping (v1.11.0) was not re-read.

Claims:
- Claim: Newest Cluster API release tag is v1.15.0-rc.0 (prerelease, 2026-11-24); v1.15.0 final does not exist yet; newest stable is v1.14.4. Status: VERIFIED. URL: https://api.github.com/repos/kubernetes-sigs/cluster-api/releases (via `gh api repos/kubernetes-sigs/cluster-api/releases`). Version/date: read 2026-11-26. Quote: "v1.15.0-rc.0 2026-11-24T15:10:47Z true".
- Claim: At v1.15.0-rc.0 the v1beta2 MHC has CEL `unhealthyExpressions` limited to 10 items. Status: VERIFIED. URL: https://github.com/kubernetes-sigs/cluster-api/blob/v1.15.0-rc.0/api/core/v1beta2/machinehealthcheck_types.go. Version: v1.15.0-rc.0. Quote: "+kubebuilder:validation:MaxItems=10 ... UnhealthyExpressions []UnhealthyExpression".
- Claim: Same fields are present unchanged on `main`. Status: VERIFIED. URL: https://github.com/kubernetes-sigs/cluster-api/blob/main/api/core/v1beta2/machinehealthcheck_types.go. Version: main as read 2026-11-26. Quote: "UnhealthyExpressions []UnhealthyExpression `json:\"unhealthyExpressions,omitempty\"`".
- Claim: `remediation.triggerIf.unhealthyLessThanOrEqualTo` gates remediation and `unhealthyInRange` takes precedence. Status: VERIFIED. URL: https://github.com/kubernetes-sigs/cluster-api/blob/main/api/core/v1beta2/machinehealthcheck_types.go. Version: main. Quote: "unhealthyInRange takes precedence if set."
- Claim: External remediation is referenced through `remediation.templateRef`. Status: VERIFIED. URL: https://github.com/kubernetes-sigs/cluster-api/blob/v1.15.0-rc.0/api/core/v1beta2/machinehealthcheck_types.go. Version: v1.15.0-rc.0. Quote: "templateRef is a reference to a remediation template".
- Claim: Any v1.15 MHC statement is pre-release, since v1.15.0 final is unreleased. Status: VERIFIED (follows from the release listing above). URL: same as first claim.

## Gap: ClusterClass maturity and the managed topologies proposal

Findings: At v1.15.0-rc.0 and at `main`, `ClusterTopology` is `Beta`, default true. The code comment records "alpha: v0.4, beta: v1.15". The rc.0 book page for ClusterClass says Beta since CAPI v1.15 and links the CAEP. The feature-gates reference at rc.0 lists `ClusterTopology` as Beta. Because v1.15.0 final is not out, Beta is the label at the newest readable source, not a final-release label. The CAEP file is at `docs/proposals/20210526-cluster-class-and-managed-topologies.md` on `main`; I read only its header (title, authors, creation date 2021-05-26) in this pass and did not re-read the `provisional` status line or its body, so the wiki's earlier note about that stays as recorded.

Claims:
- Claim: `ClusterTopology` gate is Beta and default true at v1.15.0-rc.0. Status: VERIFIED. URL: https://github.com/kubernetes-sigs/cluster-api/blob/v1.15.0-rc.0/pkg/features/features.go. Version: v1.15.0-rc.0. Quote: "ClusterTopology: {Default: true, PreRelease: featuregate.Beta}".
- Claim: Same on `main`. Status: VERIFIED. URL: https://github.com/kubernetes-sigs/cluster-api/blob/main/pkg/features/features.go. Version: main. Quote: "ClusterTopology: {Default: true, PreRelease: featuregate.Beta}".
- Claim: Gate history in code is alpha v0.4, beta v1.15. Status: VERIFIED. URL: https://github.com/kubernetes-sigs/cluster-api/blob/v1.15.0-rc.0/pkg/features/features.go. Version: v1.15.0-rc.0. Quote: "// alpha: v0.4" and "// beta: v1.15" (two comment lines above `ClusterTopology featuregate.Feature`). [corrected in verification: the comments are in features.go, not gates.go (gates.go has no such text), and they are two separate lines, not one.]
- Claim: The rc.0 book says the flag is on by default. Status: VERIFIED. URL: https://github.com/kubernetes-sigs/cluster-api/blob/v1.15.0-rc.0/docs/book/src/user/guide/configuration/cluster-class/index.md. Version: v1.15.0-rc.0. Quote: "enabled by default (Beta since CAPI v1.15)".
- Claim: The feature-gates reference lists ClusterTopology as Beta. Status: VERIFIED. URL: https://github.com/kubernetes-sigs/cluster-api/blob/v1.15.0-rc.0/docs/book/src/reference/feature-gates.md. Version: v1.15.0-rc.0. Quote: "`ClusterTopology` | Beta".
- Claim: A new gate `ClusterTopologyWorkerVersionPinning` is Alpha (new in v1.15) and requires ClusterTopology. Status: VERIFIED. URL: https://github.com/kubernetes-sigs/cluster-api/blob/v1.15.0-rc.0/pkg/features/features.go (comment "alpha: v1.15"; gate table `{Default: false, PreRelease: featuregate.Alpha}`) and docs/book/src/reference/feature-gates.md ("Also requires `ClusterTopology`"). [corrected in verification: cited gates.go does not contain this; the text is in features.go and the feature-gates doc.]
- Claim: ClusterClass is GA. Status: UNVERIFIED; nothing read says so, and v1.15.0 final is not released.

## Gap: Generic readiness when Cluster API moves from Ready to Available

Findings: The status proposal (status: implementable, last-updated 2025-01-30) says Cluster API drops `Ready` from higher-level abstractions and introduces `Available`, while Machine keeps `Ready` with the meaning "machine can host workloads". The v1beta2 Cluster type at rc.0 defines `ClusterAvailableCondition`, and my grep for a Cluster `Ready` constant found none. kstatus (cli-utils) first checks deletion, generation, and the `Reconciling` and `Stalled` conditions; then type-specific rules for built-in kinds; then for unknown kinds it looks for a `Ready` condition. Its README says a resource without a `Ready` condition falls back to "assume they are always reconciled". Combining the two, a kstatus-style tool would not see `Available=False` on a v1beta2 Cluster, but this combination is my inference and neither project states it. Cluster API does not appear to publish `Reconciling` or `Stalled` conditions (not checked exhaustively; only the Cluster type grep for "Reconciling|Stalled" returned no matches). I did not re-read Flux CEL documentation in this pass.

Claims:
- Claim: Proposal drops `Ready` from higher-level objects and adds `Available`. Status: VERIFIED. URL: https://github.com/kubernetes-sigs/cluster-api/blob/v1.15.0-rc.0/docs/proposals/20240916-improve-status-in-CAPI-resources.md. Version: file tagged v1.15.0-rc.0, last-updated 2025-01-30. Quote: "dropping the `Ready` condition from higher level abstractions in Cluster API."
- Claim: Machine `Ready` now means the machine can host workloads. Status: VERIFIED. Same URL. Quote: "clearly represent the \"machine can host workloads\"".
- Claim: Cluster `Available` is computed from RemoteConnectionProbe, InfrastructureReady, ControlPlaneAvailable, WorkersAvailable, TopologyReconciled plus `spec.availabilityGates`. Status: VERIFIED. Same URL (table row). Quote: "if conditions are defined in `spec.availabilityGates`, those conditions must be true as well".
- Claim: The v1beta2 Cluster type defines an Available condition constant. Status: VERIFIED. URL: https://github.com/kubernetes-sigs/cluster-api/blob/v1.15.0-rc.0/api/core/v1beta2/cluster_types.go. Version: v1.15.0-rc.0. Quote: "ClusterAvailableCondition = AvailableCondition".
- Claim: The proposal names Helm, Flux and Argo as tools whose boundary with Cluster API is blurring. Status: VERIFIED. Same proposal URL. Quote: "tools like Helm, Flux, Argo, and so on."
- Claim: kstatus uses the `Ready` condition only for resources with no recommended conditions and no type-specific rule. Status: VERIFIED. URL: https://github.com/kubernetes-sigs/cli-utils/blob/master/pkg/kstatus/README.md. Version: default branch as read 2026-11-26. Quote: "the library will look for the `Ready` condition."
- Claim: kstatus assumes unknown resources are always reconciled when no `Ready` is seen. Status: VERIFIED. Same URL. Quote: "fall back to the strategy for unknown resources, which is to assume they are always reconciled."
- Claim: kstatus acts on `Reconciling=True` as in progress and `Stalled=True` as failed before anything else. Status: VERIFIED. URL: https://github.com/kubernetes-sigs/cli-utils/blob/master/pkg/kstatus/status/generic.go. Version: default branch. Quote: "cond.Type == string(ConditionStalled) && cond.Status == corev1.ConditionTrue".
- Claim: A kstatus-style tool therefore reports a v1beta2 Cluster as Current regardless of `Available`. Status: UNVERIFIED (inference from the two sources above; I did not run kstatus against a v1beta2 Cluster, and the generation check could change the result while a spec change is pending).

## Gap: Argo CD sharding algorithm maturity in current releases

Findings: At v3.6.3 (2026-11-24, newest release) the HA page still marks both `round-robin` and `consistent-hashing` as experimental, under an "Alpha Features" note. The default is `legacy`, confirmed in code: `DefaultShardingAlgorithm = LegacyShardingAlgorithm`, and the controller flag default reads `common.DefaultShardingAlgorithm`. This settles the part the wiki left open. The docs prose at v3.6.3 describes legacy as "uid based distribution (non-uniform)". The CNOE benchmark blog the docs cite was not read here (secondary only).

Claims:
- Claim: v3.6.3 is the newest Argo CD release (2026-11-24). Status: VERIFIED. [corrected in verification: v3.6.3 is the newest 3.6.x release; v3.5.9 (2026-11-24T17:56:03Z) was published later the same day on a maintenance branch, so "newest" holds for the highest minor line only.] URL: https://api.github.com/repos/argoproj/argo-cd/releases. Version: read 2026-11-26. Quote: "v3.6.3 2026-11-24T16:53:09Z false".
- Claim: Default sharding algorithm is legacy at v3.6.3. Status: VERIFIED. URL: https://github.com/argoproj/argo-cd/blob/v3.6.3/common/common.go. Version: v3.6.3. Quote: "LegacyShardingAlgorithm is the default value for Sharding Algorithm".
- Claim: The controller flag defaults to that constant. Status: VERIFIED. URL: https://github.com/argoproj/argo-cd/blob/v3.6.3/cmd/argocd-application-controller/commands/argocd_application_controller.go. Version: v3.6.3. Quote: "env.StringFromEnv(common.EnvControllerShardingAlgorithm, common.DefaultShardingAlgorithm)".
- Claim: round-robin is still experimental at v3.6.3. Status: VERIFIED. URL: https://github.com/argoproj/argo-cd/blob/v3.6.3/docs/operator-manual/high_availability.md. Version: v3.6.3. Quote: "The `round-robin` shard distribution algorithm is an experimental feature."
- Claim: consistent-hashing is still experimental at v3.6.3. Status: VERIFIED. Same URL. Quote: "The `consistent-hashing` shard distribution algorithm is an experimental feature."
- Claim: legacy is non-uniform. Status: VERIFIED. Same URL. Quote: "`legacy` mode uses an `uid` based distribution (non-uniform)."
- Claim: Consistent-hashing benchmark results are encouraging. Status: SECONDARY-ONLY (the docs cite the CNOE blog; blog not read). URL: https://cnoe.io/blog/argo-cd-application-scalability. Quote (docs): "Extensive benchmarks have been documented on the CNOE blog".

## Gap: Argo CD default reconcile interval across versions

Findings: v2.1.0 through v2.4.0 all default to 180 seconds. Both the ConfigMap example (`timeout.reconciliation: 180s`, "Three minutes by default") and the controller constant `defaultAppResyncPeriod = 180` agree at v2.1.0 and v2.4.0; v2.2.0 and v2.3.0 were read from the ConfigMap only. The v2.5.0 FAQ also says 3 minutes (180 seconds). At v3.0.0 the ConfigMap says 120s ("Two minutes by default with additional jitter") with a new `timeout.reconciliation.jitter: 60s`. PR 22342 "chore!: add 60s default jitter" (merged 2025-03-13) introduced the jitter; its body says it is not in the 2.14 to 3.0 migration guide "because the maximum default is the same (at least every 3 minutes)". The v3.0.0 upgrade note I searched (2.14-3.0.md) has no polling or timeout entry, consistent with that. The stated reason in primary text is only the refresh-queue-spike comment on the jitter key; the reason for lowering the base from 180 to 120 is not stated in anything I read, and the PR body suggests the intent was to keep the maximum at 180 while adding jitter. I did not open the PR's linked issue or review comments (not searched beyond title and body), so a fuller rationale may exist there.

Claims:
- Claim: v2.1.0 default is 180s. Status: VERIFIED. URL: https://github.com/argoproj/argo-cd/blob/v2.1.0/docs/operator-manual/argocd-cm.yaml. Version: v2.1.0. Quote: "Three minutes by default. ... timeout.reconciliation: 180s".
- Claim: v2.2.0 default is 180s. Status: VERIFIED. URL: https://github.com/argoproj/argo-cd/blob/v2.2.0/docs/operator-manual/argocd-cm.yaml. Version: v2.2.0. Quote: "timeout.reconciliation: 180s".
- Claim: v2.3.0 default is 180s. Status: VERIFIED. URL: https://github.com/argoproj/argo-cd/blob/v2.3.0/docs/operator-manual/argocd-cm.yaml. Version: v2.3.0. Quote: "timeout.reconciliation: 180s".
- Claim: v2.4.0 default is 180s. Status: VERIFIED. URL: https://github.com/argoproj/argo-cd/blob/v2.4.0/docs/operator-manual/argocd-cm.yaml. Version: v2.4.0. Quote: "timeout.reconciliation: 180s".
- Claim: The controller constant is 180 at v2.1.0 and v2.4.0. Status: VERIFIED. URL: https://github.com/argoproj/argo-cd/blob/v2.4.0/cmd/argocd-application-controller/commands/argocd_application_controller.go (v2.1.0 same path). Version: v2.1.0 and v2.4.0. Quote: "defaultAppResyncPeriod = 180".
- Claim: The v2.5.0 FAQ says 3 minutes. Status: VERIFIED. URL: https://github.com/argoproj/argo-cd/blob/v2.5.0/docs/faq.md. Version: v2.5.0. Quote: "The default polling interval is 3 minutes (180 seconds)."
- Claim: v3.0.0 ConfigMap lists 120s plus a 60s jitter. Status: VERIFIED. URL: https://github.com/argoproj/argo-cd/blob/v3.0.0/docs/operator-manual/argocd-cm.yaml. Version: v3.0.0. Quote: "Two minutes by default with additional jitter."
- Claim: The jitter key is documented as spreading refreshes to avoid a queue spike. Status: VERIFIED. Same URL. Quote: "the periodic refresh for each application can cause a spike in the refresh queue".
- Claim: PR 22342 added the 60s default jitter and expects the maximum default to stay at 3 minutes. Status: VERIFIED (PR title and body only). URL: https://github.com/argoproj/argo-cd/pull/22342. Date: merged 2025-03-13. Quote: "the maximum default is the same (at least every 3 minutes)."
- Claim: The reason the base value dropped from 180s to 120s. Status: UNVERIFIED. Searched the PR body, the 2.14-to-3.0 upgrade note, and GitHub issue search for "jitter reconciliation timeout"; found no statement of motivation beyond the above.

## Unreadable sources

None. Every URL above was read through the GitHub API or raw file contents. The CNOE blog (https://cnoe.io/blog/argo-cd-application-scalability) was not attempted, so it is unread, not unreadable. No web_search or web_scrape calls were made; all evidence came from `gh api` reads of source and docs files.

## Not found

- Cluster API v1.15.0 final: not released as of 2026-11-26 (searched releases and tags; newest is v1.15.0-rc.0).
- Any source stating directly how kstatus-style tools handle a v1beta2 Cluster `Available` condition: searched the kstatus README, `generic.go`, and the Cluster API proposal; found nothing.
- Any primary text giving the reason the Argo CD base interval changed from 180s to 120s: searched PR 22342 body, the v3.0 upgrade note, and issue search; found nothing.
- ClusterClass GA announcement: found nothing.
- Flux CEL health-check documentation and real-world MHC remediation incidents: not searched in this pass.

## Removed in verification

- None removed. Two citations were corrected (feature-gate history and WorkerVersionPinning cited the wrong file) and one qualified (Argo CD "newest release").

## Verification summary

Second adversarial pass (2026-11-26): re-fetched via `gh` raw contents all release listings, features.go, MHC types, feature-gates and ClusterClass pages, status proposal, cluster_types.go, kstatus README and generic.go, Argo CD common.go, controller flag, HA docs, argocd-cm.yaml (v2.1.0 to v2.4.0, v3.0.0), controller constants, v2.5.0 FAQ, PR 22342. All checked quotes and versions reproduced; no further corrections. Not re-checked: the "Alpha Features" note wording in the HA page, and CNOE blog (still SECONDARY-ONLY).

Re-fetched with `gh api` raw contents on 2026-11-26: release listings, MHC types (rc.0 and main), features.go, feature-gates and ClusterClass book pages, status proposal, cluster_types.go, kstatus README and generic.go, Argo CD common.go, controller flag, HA docs, argocd-cm.yaml at v2.1.0 to v2.4.0 and v3.0.0, controller constant at v2.1.0 and v2.4.0, v2.5.0 FAQ, PR 22342. All other quotes reproduced. Not re-read: CNOE blog (still SECONDARY-ONLY), kstatus-on-Cluster inference (still UNVERIFIED).

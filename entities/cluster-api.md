---
title: Cluster API
type: entity
status: active
created: 2026-11-25
updated: 2026-11-26
sources:
  - id: research-universal-control-plane
    hash: 037575049a4c
    ingested: 2026-11-25
  - id: research-declarative-vs-imperative
    hash: 570767ba4094
    ingested: 2026-11-25
  - id: research-level-triggered-vs-edge-triggered
    hash: 27a34aa0de59
    ingested: 2026-11-25
  - id: research-self-healing-and-drift-detection
    hash: 98edc2019c6b
    ingested: 2026-11-25
  - id: research-gitops-pull-based-delivery
    hash: 335ba8f50b2b
    ingested: 2026-11-25
  - id: research-spec-status-split
    hash: 598e6132ea4f
    ingested: 2026-11-25
  - id: research-server-side-apply-and-field-ownership
    hash: 1f12c486354e
    ingested: 2026-11-25
  - id: research-operator-pattern
    hash: eab72eca2e1b
    ingested: 2026-11-25
  - id: research-reconciliation-loop
    hash: df7d66206baf
    ingested: 2026-11-25
  - id: research-finalizers
    hash: ca11dffc241b
    ingested: 2026-11-25
  - id: research-owner-references-and-garbage-collection
    hash: bd4cc1219f2d
    ingested: 2026-11-25
  - id: research-conditions
    hash: 97b224c63502
    ingested: 2026-11-25
  - id: research-composite-resource
    hash: 8640896d06b9
    ingested: 2026-11-25
  - id: research-composition
    hash: f57d89652816
    ingested: 2026-11-25
  - id: research-provider
    hash: 7e43edcd71be
    ingested: 2026-11-25
  - id: research-landscape
    hash: d28204a90545
    ingested: 2026-11-25
  - id: research-gap-g3-reconcile-defaults
    hash: b7be72012393
    ingested: 2026-11-26
  - id: research-gap-g3-argocd-capi
    hash: c3d485fa58ae
    ingested: 2026-11-26
  - id: research-gap-g1-gitops-drift-incidents
    hash: 0a1a75f3cab5
    ingested: 2026-11-26
  - id: research-gap-g1-operator-loop-failures
    hash: baca2cdf965d
    ingested: 2026-11-26
  - id: research-gap-g1-named-adopters
    hash: 9f6a50098233
    ingested: 2026-11-26
  - id: research-gap-g1-other-tool-pitfalls
    hash: a942f0ae1b1b
    ingested: 2026-11-26
  - id: research-gap-b1-unverified-claims
    hash: d152f98abb04
    ingested: 2026-11-26
  - id: research-gap-b1-recheck-capi-argocd
    hash: 832b86e20750
    ingested: 2026-11-26
aliases: [CAPI]
tags: [tool, provider, cluster-lifecycle]
---

# Cluster API

Cluster API is a Kubernetes SIG Cluster Lifecycle project in which a management cluster runs Cluster API and provider controllers to create, upgrade, and delete workload clusters. It is the clearest example in the dossier of Kubernetes managing Kubernetes and raw infrastructure. [[sources/research-universal-control-plane]]

## Resources and providers

Clusters and machines are custom resources: Cluster, Machine, MachineDeployment, and MachineHealthCheck. Three provider types (infrastructure, control plane, and bootstrap) let one API hide many backends such as AWS and vSphere. The documentation's own statement is that Cluster API "uses custom resources to manage control plane and worker Machines."

## Pitfalls

Because authority is centralized in the management cluster, that cluster becomes a single point of failure. See [[findings/blast-radius-and-privilege-centralization]].

## Declarative lifecycle and immutable Machines

The Cluster API book states the goal as managing the lifecycle (create, scale, upgrade, destroy) of Kubernetes-conformant clusters using a declarative API. Machines are immutable: once created they are never updated except for labels, annotations, and status, and changes replace machines, a deliberate rollout design like Pod versus Deployment. [[sources/research-declarative-vs-imperative]] See [[examples/cluster-fleet-lifecycle-with-cluster-api]] and [[findings/immutable-fields-and-drift-collisions]].

## Reconcile behavior

The level-triggered dossier could not confirm Cluster API controller details, because the page URL tried returned 404. Cluster API is expected to follow the same reconcile shape as other controllers. [[sources/research-level-triggered-vs-edge-triggered]] See [[examples/cloud-console-changes-reverted-by-provider-controllers]] and [[open-knowledge-gaps]].

## Related

[[examples/cluster-fleet-lifecycle-with-cluster-api]], [[concepts/provider]], [[concepts/custom-resource-definition]], [[concepts/universal-control-plane]]

## MachineHealthCheck

A MachineHealthCheck evaluates Node conditions against timeouts and remediates unhealthy Machines, typically by replacement, with `maxUnhealthy` as a brake. Only machines owned by a MachineSet or KubeadmControlPlane are supported. The source is the older v0.4 book. Correction 2026-11-26: current v1beta2 behavior is described in the section below, and `maxUnhealthy` is the deprecated v1beta1 name. [[sources/research-self-healing-and-drift-detection]] See [[examples/cluster-api-machine-health-check-replaces-failed-nodes]] and [[findings/remediation-can-amplify-an-outage]].

## Fleets as GitOps targets

A management cluster runs Cluster API and providers that reconcile Cluster, Machine, MachineDeployment, and KubeadmControlPlane resources into workload clusters, and machines are replaced rather than patched in place. The declarative model makes cluster fleets natural GitOps targets, with the hub cluster pulling cluster definitions from Git and workload clusters pulling their own add-ons. [[sources/research-gitops-pull-based-delivery]] See [[examples/cluster-fleet-lifecycle-with-cluster-api]] and [[concepts/gitops-pull-based-delivery]].

## Readiness conventions and kstatus

Cluster API is moving from the `Ready` condition to `Available`, which kstatus does not expect, so Flux added CEL-based custom health checks for it. A proposal to default `status.observedGeneration` to `-1` to avoid a "resource is ready" race was closed as not planned in May 2025. [[sources/research-spec-status-split]] See [[examples/cluster-api-readiness-gates-flux-dependents]] and [[findings/premature-readiness-in-kstatus-based-tools]].

## Server-side apply in the topology controller

The ClusterClass topology controller adopted server-side apply in pull request 6495 (merged June 2022) so the API server can arbitrate several controllers co-authoring the same object. Only the pull request description was read, so the field-level ownership rules between Cluster API and infrastructure providers are unverified. [[sources/research-server-side-apply-and-field-ownership]] See [[examples/cluster-api-topology-controller-uses-ssa-for-co-authored-objects]].

## Core and provider controllers

The Cluster API concepts page describes cluster lifecycle managed as custom resources from a management cluster with pluggable infrastructure providers, and states that "Extensibility is at the core of Cluster API." The operator-pattern dossier treats it as a large-scale operator whose provider model keeps the core controllers generic. [[sources/research-operator-pattern]] See [[examples/cluster-api-keeps-core-controllers-generic-with-provider-controllers]] and [[comparisons/how-flux-ack-and-cluster-api-split-controllers]].

## Machine controller as a waiting reconciler

The Machine controller sets owner references, waits for infrastructure and bootstrap provisioning, and matches Nodes to provider IDs. The documentation page does not describe requeue or pause mechanics. [[sources/research-reconciliation-loop]] See [[examples/cluster-api-machine-controller-waits-for-infrastructure-and-bootstrap-data]].

## Machine deletion as a gated workflow

A `deletionTimestamp` on a Machine starts a multi-phase teardown: pre-drain hooks, node drain, volume detach, pre-terminate hooks, infrastructure and bootstrap deletion, then node deletion. Blockers are PodDisruptionBudgets, terminating pods, attached volumes, failing hooks, and unreachable nodes, and `exclude-node-draining` and `nodeDrainTimeout` are the escape hatches. Cluster API issue 1514 on blocking deletion with a finalizer or annotation was a search hit that the dossier did not read. [[sources/research-finalizers]] See [[examples/cluster-api-machine-deletion-drains-detaches-and-runs-hooks-before-removing-the-node]] and [[findings/machine-deletion-stalls-on-disruption-budgets-attached-volumes-and-failing-hooks]].

## Owner references as the cluster ownership contract

The Cluster API book defines the ownership chain Cluster, MachineDeployment, MachineSet, Machine, with infrastructure and bootstrap objects owned by the Machine. Owner references drive cluster deletion and `clusterctl move`, and controllers must re-reconcile them if they are lost, for example after a Velero restore. [[sources/research-owner-references-and-garbage-collection]] See [[examples/cluster-api-owner-reference-chain-drives-cluster-deletion-and-clusterctl-move]] and [[findings/backup-and-restore-tools-can-strip-owner-references-so-controllers-must-re-reconcile-them]].

## Condition model

Cluster API replaced its custom condition model (a mandatory all-summarizing `Ready` and a custom `Severity` field) with `metav1.Condition`, added `Available` as a separate signal, and added operation conditions such as `ScalingUp` and `Remediating`. A brand-new resource can look ready to kstatus, which is why Flux uses CEL health checks for Cluster API. [[sources/research-conditions]] See [[examples/cluster-api-adds-available-and-operation-conditions-beside-ready]] and [[findings/one-mandatory-ready-condition-that-summarizes-everything-is-too-rigid]].

## ClusterClass as the composite pattern for clusters

ClusterClass is a reusable class plus a small `topology` on a Cluster that a controller expands into machine and infrastructure objects. It is described as "a powerful abstraction implemented on top of existing interfaces" and gated by `ClusterTopology`. The page read labels the feature experimental or alpha. Correction 2026-11-26: the label is out of date for the v1.15 release candidate, where `ClusterTopology` is Beta and on by default (see below). [[sources/research-composite-resource]] See [[examples/cluster-api-clusterclass-expands-a-small-topology-into-many-machine-and-infrastructure-objects]] and [[concepts/composite-resource]].

## ClusterClass status in the Compositions dossier

The Compositions dossier cites the Cluster API book page for ClusterClass, which says it reduces boilerplate and enables flexible customization through a `topology` on the Cluster, gated by `ClusterTopology`. The author and consumer split mirrors Crossplane's XRD and Composition versus XR split. The page is labelled alpha. Correction 2026-11-26: that is the pre-v1.15 label, see the maturity section below. [[sources/research-composition]]

## Provider contracts

The Providers dossier read the provider contracts overview. Cluster API defines infrastructure, bootstrap, control plane, IPAM, and addon provider types, and each implements agreed CRD fields and behaviors so the core controllers stay generic. This is a different meaning of provider from Crossplane's, see [[comparisons/crossplane-providers-versus-cluster-api-providers]]. [[sources/research-provider]]

## Landscape view

The Cluster API Book describes a management cluster running Cluster API and providers to manage workload clusters, with infrastructure providers creating machines and networks, bootstrap providers producing node init data (typically cloud-init), and control-plane providers managing the control plane, as in "custom resources like KubeadmControlPlane to manage control plane Machines" (https://cluster-api.sigs.k8s.io/user/concepts). The dossier calls the Deployment-to-Pod analogy the best newcomer hook. Crossplane adopters such as RTL Nederland also provision whole clusters, so the layers overlap, see [[examples/rtl-nederland-provisions-whole-kubernetes-clusters-with-crossplane-which-overlaps-with-cluster-api]] and [[concepts/tooling-landscape]]. [[sources/research-landscape]]

## Sync period in the reconcile-defaults dossier

The core controller flag `--sync-period` defaults to 10 minutes and is described as "The minimum interval at which watched resources are reconciled (e.g. 15m)". It is a cache resync and not an infrastructure poll, and no per-resource drift period or MachineHealthCheck requeue period was found. [[sources/research-gap-g3-reconcile-defaults]] See [[findings/the-cluster-api-sync-period-flag-is-a-cache-resync-and-not-a-poll-of-the-cloud-infrastructure]].

## MachineHealthCheck in the v1beta2 API

The v1beta2 API (introduced in v1.11.0, 2025-08-19) moves the checks under `spec.checks` and replaces `maxUnhealthy` and `unhealthyRange` with `remediation.triggerIf.unhealthyLessThanOrEqualTo` and `unhealthyInRange`, which takes precedence when both are set. Percentages round down. The default threshold is 100 percent, so the short-circuit is off until set. External remediation uses `remediation.templateRef`, and v1.15 adds CEL `checks.unhealthyExpressions` (OR-combined, at most 10). Only Machines owned by a MachineSet, MachineDeployment, or KubeadmControlPlane are covered. KubeadmControlPlane remediation must preserve etcd quorum and has `maxRetry` (unset means retry forever), `retryPeriodSeconds`, and `minHealthyPeriodSeconds` (default 3600). With ClusterClass the checks come from the class and direct edits are overridden. v1.15.0 final was not released on 2026-11-26, so the v1.15 items are pre-release. See [[examples/cluster-api-v1beta2-machine-health-check-short-circuits-remediation-and-hands-off-to-external-controllers]], [[examples/cluster-api-kubeadm-control-plane-remediation-must-preserve-etcd-quorum-and-has-its-own-retry-controls]], [[findings/the-cluster-api-machine-health-check-short-circuit-is-off-by-default-so-remediation-is-unbounded-until-a-threshold-is-set]], [[findings/a-non-working-kubelet-on-the-etcd-leader-blocks-cluster-api-control-plane-remediation]], [[findings/cluster-api-v1beta1-maxunhealthy-and-unhealthyrange-are-deprecated-and-older-material-uses-the-old-names]], and [[sources/research-gap-g3-argocd-capi]].

## Ready and Available in v1beta2

The proposal "Improving status in CAPI resources" drops `Ready` from higher-level objects such as Cluster, MachineDeployment, and control planes and adds `Available`, modelled on Deployments. Machine keeps both `Available` and `Ready`, and Machine `Ready` now means the machine can host workloads. Cluster `Available` requires RemoteConnectionProbe, InfrastructureReady, ControlPlaneAvailable, WorkersAvailable, and TopologyReconciled, plus anything in `spec.availabilityGates`. v1beta1 removal is tentatively April 2027. No Cluster API or Flux page gives a general rule for generic tools. See [[findings/the-flux-cel-cheatsheet-keys-cluster-api-health-on-ready-and-shows-no-v1beta2-available-variant]] and [[sources/research-gap-g3-argocd-capi]].

## ClusterClass maturity at v1.15.0-rc.0

The `ClusterTopology` gate is Beta and enabled by default as of v1.15.0-rc.0 (2026-11-24), while the v1.14.4 docs still say alpha. The original proposal (2021-05-26) frames ClusterClass as a collection of template references and the Cluster as "a single control point" for version, worker pools, labels, and replicas, with continuous reconciliation, and its frontmatter still says `provisional`. Beta is not GA, and v1.15.0 final had not shipped. See [[examples/cluster-api-v1-15-0-rc-0-promotes-clustertopology-to-beta-and-adds-cel-health-check-rules]], [[findings/cluster-api-clusterclass-maturity-labels-disagree-across-doc-versions-and-the-original-proposal-still-says-provisional]], and [[sources/research-gap-g3-argocd-capi]].

## Incident from the GitOps incidents dossier

Cluster API issue 8172 (2023, v1.3.0) says resources are orphaned when parent objects are deleted before the controller adds its finalizer, see [[examples/cluster-api-issue-8172-deleting-parents-before-the-controller-adds-its-finalizer-orphans-their-resources]]. Source: [[sources/research-gap-g1-gitops-drift-incidents]].


## Provider reconcile loop from the operator loop dossier

Rancher's cluster-api-provider-rke2 v0.22.0 onward had a self-sustaining loop of about 10 reconciles per second in the RKE2ControlPlane controller, which the reporter ties to a commit adding the v1beta2 status path. Neighbouring controllers were affected as well. See [[examples/cluster-api-provider-rke2-issue-905-an-unconditional-status-patch-held-the-controller-at-about-ten-reconciles-per-second]] and [[sources/research-gap-g1-operator-loop-failures]].

## Adopters file

A code search of the Cluster API repository in the 2026-11-26 adopters dossier found only a providers reference page and no adopters page. A later pass read the repository root listing on 2026-11-26 and found no adopters file there, which settles the root only. Subdirectories were not searched ([[sources/research-gap-b1-unverified-claims]]). [[sources/research-gap-g1-named-adopters]]

## Pitfall evidence from the other-tool pitfalls dossier

The 2026-11-26 dossier found release-note breaking changes and a webhook-availability issue, but no deletion or data-loss incident from the last two years. The v1.14.0 release (2026-08-11) lists four breaking changes, including a webhook version-validation fix that rejects invalid pre-release or build tags, and says v1beta1 is on track to be unserved in v1.16 and Docker* resources are removed in v1.15 ([[findings/cluster-api-v1-14-0-lists-four-breaking-changes-and-schedules-v1beta1-and-docker-removals]]). Issue 10522 says cert-manager rotation can make webhooks unreachable for up to 90 seconds and failed a clusterctl upgrade test ([[findings/cluster-api-webhooks-can-be-unreachable-for-up-to-90-seconds-during-cert-manager-certificate-rotation]]). The latest stable releases read were v1.14.4 and v1.13.8 (2026-11-03). [[sources/research-gap-g1-other-tool-pitfalls]]

## Release status and recheck on 2026-11-26

A later pass found that v1.15.0 final does not exist: the newest tag is v1.15.0-rc.0 (2026-11-24, prerelease) and the newest stable release is v1.14.4 (2026-11-03). On v1.15.0-rc.0 and on `main` the v1beta2 MachineHealthCheck fields (`unhealthyExpressions`, `remediation.templateRef`, `remediation.triggerIf.unhealthyLessThanOrEqualTo`, `unhealthyInRange`) and the Beta `ClusterTopology` gate agree, and a new Alpha gate `ClusterTopologyWorkerVersionPinning` requires `ClusterTopology`. Nothing read says ClusterClass is GA. The v1beta2 Cluster type defines an `Available` condition constant and no `Ready` constant. See [[findings/cluster-api-v1-15-0-final-was-not-released-on-2026-11-26-so-every-v1-15-statement-is-a-release-candidate-claim]], [[findings/kstatus-treats-an-unknown-kind-without-a-ready-condition-as-always-reconciled]], and [[sources/research-gap-b1-recheck-capi-argocd]].

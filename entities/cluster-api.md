---
title: Cluster API
type: entity
status: draft
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

A MachineHealthCheck evaluates Node conditions against timeouts and remediates unhealthy Machines, typically by replacement, with `maxUnhealthy` as a brake. Only machines owned by a MachineSet or KubeadmControlPlane are supported. The source is the older v0.4 book, so current behavior may differ. [[sources/research-self-healing-and-drift-detection]] See [[examples/cluster-api-machine-health-check-replaces-failed-nodes]] and [[findings/remediation-can-amplify-an-outage]].

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

ClusterClass is a reusable class plus a small `topology` on a Cluster that a controller expands into machine and infrastructure objects. It is described as "a powerful abstraction implemented on top of existing interfaces" and gated by `ClusterTopology`. The page read labels the feature experimental or alpha, which may be stale, and the CAEP was not read. [[sources/research-composite-resource]] See [[examples/cluster-api-clusterclass-expands-a-small-topology-into-many-machine-and-infrastructure-objects]] and [[concepts/composite-resource]].

## ClusterClass status in the Compositions dossier

The Compositions dossier cites the Cluster API book page for ClusterClass, which says it reduces boilerplate and enables flexible customization through a `topology` on the Cluster, gated by `ClusterTopology`. The author and consumer split mirrors Crossplane's XRD and Composition versus XR split. The page is labelled alpha and may be stale, so confirm current status before presenting it as stable. [[sources/research-composition]]

## Provider contracts

The Providers dossier read the provider contracts overview. Cluster API defines infrastructure, bootstrap, control plane, IPAM, and addon provider types, and each implements agreed CRD fields and behaviors so the core controllers stay generic. This is a different meaning of provider from Crossplane's, see [[comparisons/crossplane-providers-versus-cluster-api-providers]]. [[sources/research-provider]]

## Landscape view

The Cluster API Book describes a management cluster running Cluster API and providers to manage workload clusters, with infrastructure providers creating machines and networks, bootstrap providers producing node init data (typically cloud-init), and control-plane providers managing the control plane, as in "custom resources like KubeadmControlPlane to manage control plane Machines" (https://cluster-api.sigs.k8s.io/user/concepts). The dossier calls the Deployment-to-Pod analogy the best newcomer hook. Crossplane adopters such as RTL Nederland also provision whole clusters, so the layers overlap, see [[examples/rtl-nederland-provisions-whole-kubernetes-clusters-with-crossplane-which-overlaps-with-cluster-api]] and [[concepts/tooling-landscape]]. [[sources/research-landscape]]

## Sync period in the reconcile-defaults dossier

The core controller flag `--sync-period` defaults to 10 minutes and is described as "The minimum interval at which watched resources are reconciled (e.g. 15m)". It is a cache resync and not an infrastructure poll, and no per-resource drift period or MachineHealthCheck requeue period was found. [[sources/research-gap-g3-reconcile-defaults]] See [[findings/the-cluster-api-sync-period-flag-is-a-cache-resync-and-not-a-poll-of-the-cloud-infrastructure]].

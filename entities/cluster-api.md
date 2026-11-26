---
title: Cluster API
type: entity
status: draft
created: 2026-11-25
updated: 2026-11-25
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

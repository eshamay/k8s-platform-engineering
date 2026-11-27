---
title: Cluster API adds Available and operation conditions beside Ready
type: example
status: active
created: 2026-11-25
updated: 2026-11-26
sources:
  - id: research-conditions
    hash: 97b224c63502
    ingested: 2026-11-25
  - id: research-gap-g3-argocd-capi
    hash: c3d485fa58ae
    ingested: 2026-11-26
  - id: research-gap-b1-recheck-capi-argocd
    hash: 832b86e20750
    ingested: 2026-11-26
aliases: []
tags: [cluster-api, conditions, available, lifecycle]
---

# Cluster API adds Available and operation conditions beside Ready

## Scenario

An operator upgrades a Cluster API workload cluster. While machines roll, the cluster is still serving traffic, but under the older model one mandatory `Ready` condition summarized everything and went `False` during the upgrade. Users could not tell a broken cluster from a healthy cluster that was changing. [sources/research-conditions](../sources/research-conditions.md)

## How it works

The 2024 proposal "Improve status in CAPI resources" abandons Cluster API's custom condition model, which had a mandatory `Ready` that summarized everything, a custom `Severity` field, and a shape that diverged from the Kubernetes API conventions. The new model uses `metav1.Condition`, adds `Available` as a separate signal, and adds operation conditions such as `ScalingUp` and `Remediating` across Cluster, MachineDeployment, and Machine. The proposal's reasoning is that "higher level abstractions in Cluster API are designed to remain operational during lifecycle operations." URL: https://github.com/kubernetes-sigs/cluster-api/blob/main/docs/proposals/20240916-improve-status-in-CAPI-resources.md. The dossier read about 95 percent of the page.

## Lesson

The case shows an ecosystem converging on the shared convention, and it shows the cost for consumers. Flux's kstatus-based health checks relied on `Ready`, so Flux added CEL health checks for Cluster API resources. See [findings/one-mandatory-ready-condition-that-summarizes-everything-is-too-rigid](../findings/one-mandatory-ready-condition-that-summarizes-everything-is-too-rigid.md), [examples/cluster-api-readiness-gates-flux-dependents](cluster-api-readiness-gates-flux-dependents.md), [findings/premature-readiness-in-kstatus-based-tools](../findings/premature-readiness-in-kstatus-based-tools.md), and [entities/cluster-api](../entities/cluster-api.md).

## Scope of the change in v1beta2

The 2026-11-26 dossier read the proposal in full at tag v1.15.0-rc.0 (status implementable, last updated 2025-01-30). `Ready` is dropped from higher-level objects such as Cluster, MachineDeployment, and control planes, and Machine keeps `Ready` with the new meaning "machine can host workloads". The v1beta2 API shipped in v1.11.0 (2025-08-19), and Cluster `Available` combines RemoteConnectionProbe, InfrastructureReady, ControlPlaneAvailable, WorkersAvailable, TopologyReconciled, and `spec.availabilityGates`. The proposal names "Helm, Flux, Argo" as higher-level consumers, and gives no general rule for them. See [findings/the-flux-cel-cheatsheet-keys-cluster-api-health-on-ready-and-shows-no-v1beta2-available-variant](../findings/the-flux-cel-cheatsheet-keys-cluster-api-health-on-ready-and-shows-no-v1beta2-available-variant.md) and [sources/research-gap-g3-argocd-capi](../sources/research-gap-g3-argocd-capi.md).

## Recheck on 2026-11-26

The v1beta2 Cluster type at v1.15.0-rc.0 defines `ClusterAvailableCondition = AvailableCondition` and no `Ready` constant in the lines read, and the proposal names "tools like Helm, Flux, Argo" as consumers whose boundary with Cluster API is blurring. How a generic kstatus-style tool reads such a Cluster is unverified, see [findings/kstatus-treats-an-unknown-kind-without-a-ready-condition-as-always-reconciled](../findings/kstatus-treats-an-unknown-kind-without-a-ready-condition-as-always-reconciled.md) and [sources/research-gap-b1-recheck-capi-argocd](../sources/research-gap-b1-recheck-capi-argocd.md).

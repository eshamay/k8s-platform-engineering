---
title: "Cluster API MachineSet adopts Machines that have no controller reference"
type: example
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-m2-ownership-gc
    hash: 62aafaded9c0
    ingested: 2026-11-26
aliases: []
tags: [cluster-api, adoption, owner-references, machineset, clusterctl-move]
---

# Cluster API MachineSet adopts Machines that have no controller reference

## Scenario

A Machine exists in a namespace and matches a MachineSet's selector, but nothing controls it, for example after a backup restore stripped its owner reference. The MachineSet controller in Cluster API (v1.14.4, source read from `main`) decides whether to take it over. [sources/research-gap-m2-ownership-gc](../sources/research-gap-m2-ownership-gc.md) URL: https://github.com/kubernetes-sigs/cluster-api/blob/main/core/reconcilers/machineset/machineset_controller.go

## How it works

The controller lists Machines in its namespace by the selector and skips any that another controller controls. For the rest it follows the code comment "Attempt to adopt machine if it meets previous conditions and it has no controller references", patching a controller owner reference built with `metav1.NewControllerRef`. It emits a `SuccessfulAdopt` event on success and a "Failed to adopt Machine" warning event on failure. The Cluster API book lists the same duties: a MachineSet adopts unowned Machines that are not assigned to a MachineSet, and a MachineDeployment adopts matching MachineSets. A KubeadmControlPlane adopting existing control-plane Machines has an end-to-end test (`kcp_adoption.go`). [sources/research-gap-m2-ownership-gc](../sources/research-gap-m2-ownership-gc.md)

## Ownership guidelines and orphaning

The owner-reference guidelines say objects should always be created with an owner reference, references "should be re-reconciled if they are lost", and references should use the latest apiVersion so garbage collection still works after an old version stops being served. Velero is named as a tool that can remove them. `clusterctl move` sets `Cluster.Spec.Paused` to true before moving a Cluster. No explicit orphan delete propagation was found in non-test Cluster API source, so deletion relies on default garbage collection through owner references; that is a negative search and an inference. [sources/research-gap-m2-ownership-gc](../sources/research-gap-m2-ownership-gc.md)

## Related

[entities/cluster-api](../entities/cluster-api.md), [examples/cluster-api-owner-reference-chain-drives-cluster-deletion-and-clusterctl-move](cluster-api-owner-reference-chain-drives-cluster-deletion-and-clusterctl-move.md), [findings/backup-and-restore-tools-can-strip-owner-references-so-controllers-must-re-reconcile-them](../findings/backup-and-restore-tools-can-strip-owner-references-so-controllers-must-re-reconcile-them.md)

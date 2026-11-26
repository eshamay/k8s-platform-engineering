---
title: "Built-in workload controllers cascade a Deployment delete through ReplicaSets to Pods"
type: example
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-owner-references-and-garbage-collection
    hash: bd4cc1219f2d
    ingested: 2026-11-25
aliases: []
tags: [owner-references, garbage-collection, deployment, built-in-controllers]
---

# Built-in workload controllers cascade a Deployment delete through ReplicaSets to Pods

## Scenario

An engineer deletes a Deployment and expects the Pods to disappear without naming them. Nothing in the delete call mentions ReplicaSets or Pods, so the cleanup must come from the relationships that the built-in controllers recorded when they created those objects. [[sources/research-owner-references-and-garbage-collection]]

## How it works

The Owners and Dependents page says Kubernetes sets owner references automatically for ReplicaSets, DaemonSets, Deployments, Jobs, CronJobs, and ReplicationControllers. A Deployment owns its ReplicaSets, and each ReplicaSet owns its Pods. The KKloud Tarus lab shows a Pod whose `ownerReferences` has `controller=true` and `blockOwnerDeletion=true`. When the Deployment is deleted in the default background mode, the API server removes it at once, and the garbage collector then finds ReplicaSets whose owner is gone and deletes them, which in turn leaves the Pods without an owner so they are collected too. A CronJob cascades to its Jobs in the same way.

## Why the example matters

This is the everyday case that the rest of the mechanism generalizes. A custom controller that sets the same references on its own children gets the same cascade for free. See [[examples/controller-runtime-sets-a-controller-reference-so-deleting-the-custom-resource-tears-down-its-children]]. Because background mode returns before the children are gone, the Pods briefly outlive their parent, which is why code that needs ordering must ask for foreground deletion. See [[findings/background-deletion-gives-no-teardown-ordering-between-dependents]].

## Related

[[concepts/owner-references-and-garbage-collection]], [[examples/kubectl-cascade-modes-compared-in-a-hands-on-lab]]

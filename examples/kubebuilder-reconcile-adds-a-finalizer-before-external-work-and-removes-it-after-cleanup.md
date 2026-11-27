---
title: "A Kubebuilder reconciler adds a finalizer before external work and removes it after cleanup"
type: example
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-finalizers
    hash: ca11dffc241b
    ingested: 2026-11-25
aliases: []
tags: [finalizers, kubebuilder, controller-runtime, operators]
---

# A Kubebuilder reconciler adds a finalizer before external work and removes it after cleanup

## Scenario

A custom operator creates something outside the cluster for each custom resource, such as a bucket, a cloud database, or a load balancer. When the custom resource is deleted, the operator must release that external thing first. The Kubebuilder Book gives the standard Reconcile pattern for this case. [sources/research-finalizers](../sources/research-finalizers.md)

## How it works

On each reconcile the controller reads the object and branches on `deletionTimestamp`. If the timestamp is zero and the finalizer is missing, the controller adds the finalizer and updates the object, and only then creates the external resource. If the timestamp is set and the finalizer is present, the controller runs the cleanup, removes the finalizer, updates the object, and stops. The Kubebuilder Book calls finalizers "asynchronous pre-delete hooks."

Two details change how a controller author reads the logs. With a finalizer in place a delete arrives as an update, because the object is marked and not removed, whereas without a finalizer the controller simply sees that the object is gone and has nothing left to read. The controller also needs the extra RBAC update permission on `resources/finalizers`. The book stresses that cleanup must be idempotent, because the loop can run it more than once. See [concepts/idempotency](../concepts/idempotency.md) and [concepts/reconciliation-loop](../concepts/reconciliation-loop.md).

## Related

[entities/kubebuilder](../entities/kubebuilder.md), [entities/controller-runtime](../entities/controller-runtime.md), [findings/cleanup-that-always-errors-or-assumes-the-external-resource-exists-strands-the-object](../findings/cleanup-that-always-errors-or-assumes-the-external-resource-exists-strands-the-object.md), [findings/a-finalizer-added-after-the-delete-request-is-too-late-and-new-ones-are-refused](../findings/a-finalizer-added-after-the-delete-request-is-too-late-and-new-ones-are-refused.md)

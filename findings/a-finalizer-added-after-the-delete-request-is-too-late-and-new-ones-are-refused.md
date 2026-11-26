---
title: "A finalizer added after the delete request is too late, and new ones are refused"
type: finding
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-finalizers
    hash: ca11dffc241b
    ingested: 2026-11-25
aliases: []
tags: [pitfall, finalizers, controllers, ordering]
---

# A finalizer added after the delete request is too late, and new ones are refused

## Observation

Once `deletionTimestamp` is set, nobody can add new finalizers and the timestamp cannot be changed. The only permitted edit to the list is removal, and the object cannot be resurrected. A controller that waits until a delete arrives to register its finalizer will find that it cannot. The farishuskovic.dev tutorial says it directly: "The finalizer must be on the resource before the delete request arrives." [[sources/research-finalizers]]

## Consequence for controller design

The finalizer has to be added on the first reconcile, before the controller creates any external resource. Otherwise a delete that arrives between creation and registration leaves the external resource with no hook. The Kubebuilder pattern in [[examples/kubebuilder-reconcile-adds-a-finalizer-before-external-work-and-removes-it-after-cleanup]] does this by adding the finalizer and updating the object first.

## Related

[[concepts/finalizers]], [[concepts/reconciliation-loop]], [[findings/a-create-that-succeeds-while-the-status-write-fails-can-leak-an-external-resource]]

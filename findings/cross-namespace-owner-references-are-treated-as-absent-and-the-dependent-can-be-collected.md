---
title: "Cross-namespace owner references are treated as absent and the dependent can be collected"
type: finding
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-owner-references-and-garbage-collection
    hash: bd4cc1219f2d
    ingested: 2026-11-25
aliases: []
tags: [pitfall, owner-references, namespaces, garbage-collection]
---

# Cross-namespace owner references are treated as absent and the dependent can be collected

## Observation

The Kubernetes documentation says "Cross-namespace owner references are disallowed by design." A namespaced dependent may have a cluster-scoped owner or an owner in its own namespace, a cluster-scoped dependent may only have a cluster-scoped owner, and a namespaced owner in the wrong namespace is treated as absent. Since v1.20 the API emits `OwnerRefInvalidNamespace` events when it sees such a reference. [sources/research-owner-references-and-garbage-collection](../sources/research-owner-references-and-garbage-collection.md)

## Consequence

A controller that sets an owner reference across namespaces gets no error at creation time. The garbage collector sees an owner that does not exist where it looks, so the dependent can be deleted unexpectedly. Controllers that need a cluster-scoped object to depend on a namespaced one are told to use labels plus finalizer-based cleanup instead. The same restriction explains why platform tools that span namespaces cannot lean on ownership alone. See [concepts/owner-references-and-garbage-collection](../concepts/owner-references-and-garbage-collection.md) and [concepts/finalizers](../concepts/finalizers.md).

## Related

[examples/controller-runtime-sets-a-controller-reference-so-deleting-the-custom-resource-tears-down-its-children](../examples/controller-runtime-sets-a-controller-reference-so-deleting-the-custom-resource-tears-down-its-children.md), [findings/finalizers-strand-objects-in-terminating-when-the-controller-is-missing-or-failing](finalizers-strand-objects-in-terminating-when-the-controller-is-missing-or-failing.md)

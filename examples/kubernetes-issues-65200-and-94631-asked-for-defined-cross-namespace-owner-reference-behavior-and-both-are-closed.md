---
title: "Kubernetes issues 65200 and 94631 asked for defined cross-namespace owner reference behavior and both are closed"
type: example
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-m2-ownership-gc
    hash: 62aafaded9c0
    ingested: 2026-11-26
aliases: []
tags: [kubernetes, owner-references, cross-namespace, garbage-collection, issue]
---

# Kubernetes issues 65200 and 94631 asked for defined cross-namespace owner reference behavior and both are closed

## Scenario

Before v1.20, the garbage collector's handling of an owner reference whose UID existed in another namespace or under another kind was unpredictable. Two issues in kubernetes/kubernetes record the problem. [sources/research-gap-m2-ownership-gc](../sources/research-gap-m2-ownership-gc.md)

## What the issues say

Issue [65200](https://github.com/kubernetes/kubernetes/issues/65200), closed 2020-11-17, states: "Garbage collector behavior on invalid ownerReferences for existing uids across namespaces and across kinds is non-deterministic". Issue [94631](https://github.com/kubernetes/kubernetes/issues/94631), closed 2020-09-09, asks to "Add the 'namespace' of the owning object to the ownerReference subobjects of ObjectMeta structure." [sources/research-gap-m2-ownership-gc](../sources/research-gap-m2-ownership-gc.md)

## Resulting documented behavior

The owners-and-dependents page documents the v1.20 behavior: "Cross-namespace owner references are disallowed by design." An invalid reference to a namespaced owner is treated as absent, a warning event `OwnerRefInvalidNamespace` is emitted, and a cluster-scoped dependent with a namespaced owner kind is "not able to be garbage collected". The dossier did not read the fix pull request, so the link between the issues and the docs is by timing and subject only. The request to add a namespace field to owner references was closed without a shipped field that the dossier found. [sources/research-gap-m2-ownership-gc](../sources/research-gap-m2-ownership-gc.md) See [findings/cross-namespace-owner-references-are-treated-as-absent-and-the-dependent-can-be-collected](../findings/cross-namespace-owner-references-are-treated-as-absent-and-the-dependent-can-be-collected.md) and [findings/no-kep-covers-cross-namespace-ownership-or-garbage-collector-performance-and-the-nearest-proposals-are-5080-and-2336](../findings/no-kep-covers-cross-namespace-ownership-or-garbage-collector-performance-and-the-nearest-proposals-are-5080-and-2336.md).

## Related

[concepts/owner-references-and-garbage-collection](../concepts/owner-references-and-garbage-collection.md)

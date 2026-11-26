---
title: "controller-runtime sets a controller reference so deleting the custom resource tears down its children"
type: example
status: active
created: 2026-11-25
updated: 2026-11-26
sources:
  - id: research-gap-m2-ownership-gc
    hash: 62aafaded9c0
    ingested: 2026-11-26
  - id: research-owner-references-and-garbage-collection
    hash: bd4cc1219f2d
    ingested: 2026-11-25
aliases: []
tags: [owner-references, controller-runtime, operators, owns-watches]
---

# controller-runtime sets a controller reference so deleting the custom resource tears down its children

## Scenario

An operator author writes a controller for a custom resource that creates a Deployment, a Service, and a ConfigMap for each instance. They want deletion of the custom resource to remove all three, and they want a change to any child to trigger reconciliation of the parent. Two engineering tutorials, from OneUptime and GoLinuxCloud, describe the pattern. The dossier treats them as one viewpoint because their fetch results are nearly identical. [[sources/research-owner-references-and-garbage-collection]]

## How it works

`controllerutil.SetControllerReference` writes an owner reference with `controller: true` and `blockOwnerDeletion: true` on each child. The same reference lets a controller declare `Owns()` watches so that child events enqueue the owning custom resource. `SetOwnerReference` adds a non-controller owner when a second parent is needed. Only one controller owner is allowed per dependent. Deleting the custom resource then cascades through the garbage collector with no cleanup code, and the tutorials recommend adding finalizers only for external resources that the garbage collector cannot reach.

## Cautions

The tutorials list three traps: cross-namespace references, recreating the custom resource under the same name so the UID no longer matches, and assuming that cascade covers cloud resources. One of them claims that `blockOwnerDeletion` is silently ignored without `update` permission on the owner's `/finalizers` subresource, and the dossier flags that claim as unverified. Correction 2026-11-26: the admission plugin source rejects the write with Forbidden when the plugin is enabled, the plugin is off by default upstream, and `SetControllerReference` refuses to re-parent an object another controller controls and rejects cross-namespace owners. [[sources/research-gap-m2-ownership-gc]] See [[findings/blockownerdeletion-needs-permission-on-the-owner-and-the-failure-mode-is-disputed]], [[findings/cross-namespace-owner-references-are-treated-as-absent-and-the-dependent-can-be-collected]], and [[findings/recreating-an-owner-with-the-same-name-gives-a-new-uid-and-strands-its-old-dependents]].

## Related

[[entities/controller-runtime]], [[examples/kubebuilder-owns-and-a-field-indexer-wire-child-changes-to-the-owner]], [[concepts/owner-references-and-garbage-collection]]

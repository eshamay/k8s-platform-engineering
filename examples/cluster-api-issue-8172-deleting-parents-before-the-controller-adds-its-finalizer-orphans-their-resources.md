---
title: Cluster API issue 8172 deleting parents before the controller adds its finalizer orphans their resources
type: example
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-g1-gitops-drift-incidents
    hash: 0a1a75f3cab5
    ingested: 2026-11-26
aliases: [Cluster API issue 8172]
tags: [cluster-api, finalizers, orphans, deletion]
---

# Cluster API issue 8172 deleting parents before the controller adds its finalizer orphans their resources

## Scenario

Cluster API issue 8172, opened 2023-02-24 against v1.3.0, describes objects that are deleted before their controller has added its finalizer. [sources/research-gap-g1-gitops-drift-incidents](../sources/research-gap-g1-gitops-drift-incidents.md) URL: https://github.com/kubernetes-sigs/cluster-api/issues/8172

## What happened

The issue says that in this case "the resources created by these objects get orphaned". The finalizer is added by the controller on its first reconcile, so there is a window in which the object can be deleted with nothing guarding its children. This matches the generic point in [findings/a-finalizer-added-after-the-delete-request-is-too-late-and-new-ones-are-refused](../findings/a-finalizer-added-after-the-delete-request-is-too-late-and-new-ones-are-refused.md).

## Why it belongs here

It is a primary example of orphaning without any manual finalizer removal, which supports the view that orphans have several causes and that forced removal is only one of them. See [findings/resources-are-orphaned-when-a-controller-misses-the-delete-or-the-finalizer-is-added-too-late](../findings/resources-are-orphaned-when-a-controller-misses-the-delete-or-the-finalizer-is-added-too-late.md).

## Related

[entities/cluster-api](../entities/cluster-api.md), [concepts/finalizers](../concepts/finalizers.md), [findings/orphaned-dependents-keep-running-with-empty-owner-references-until-someone-deletes-them](../findings/orphaned-dependents-keep-running-with-empty-owner-references-until-someone-deletes-them.md)

---
title: "Removing a Crossplane provider before its managed resources abandons the cloud resources"
type: finding
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-provider
    hash: 7e43edcd71be
    ingested: 2026-11-25
aliases: []
tags: [crossplane, provider, deletion, orphan, pitfall]
---

# Removing a Crossplane provider before its managed resources abandons the cloud resources

## Observation

The Crossplane providers documentation states that "Removing a Provider without first removing the Provider's managed resources may abandon the resources." The managed resources still exist in the cloud, but the controller that would reconcile them, and run their finalizers, is gone. [sources/research-provider](../sources/research-provider.md)

## Why it happens

A managed resource is only meaningful while its provider's controller runs. If the `Provider` object is deleted first, the CRDs and controller are removed, the Kubernetes objects can no longer be cleaned up through their normal deletion path, and the real databases, buckets, or networks keep running and keep costing money. The same mechanism applies when a whole cluster is deleted before its cloud resources, see [findings/deleting-the-cluster-first-orphans-cloud-resources-because-the-controller-is-gone](deleting-the-cluster-first-orphans-cloud-resources-because-the-controller-is-gone.md). [sources/research-provider](../sources/research-provider.md)

## Mitigations

Remove the managed resources first and wait for them to finish deleting, then remove the provider. Crossplane has an alpha provider-deletion-protection feature that blocks removal of a provider while managed resources exist. Choosing `Orphan` on purpose, or leaving `Delete` out of `managementPolicies`, makes the abandonment explicit, see [comparisons/deletion-policies-across-gitops-and-provider-tools](../comparisons/deletion-policies-across-gitops-and-provider-tools.md). The broader class of problem is in [findings/destructive-deletion-of-external-resources](destructive-deletion-of-external-resources.md). See [concepts/provider](../concepts/provider.md) and [concepts/finalizers](../concepts/finalizers.md).

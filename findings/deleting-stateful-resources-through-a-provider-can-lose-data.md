---
title: "Deleting stateful resources through a provider can lose data"
type: finding
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-provider
    hash: 7e43edcd71be
    ingested: 2026-11-25
aliases: []
tags: [config-connector, deletion, data-loss, stateful, abandon]
---

# Deleting stateful resources through a provider can lose data

## Observation

Config Connector's best-practices page warns that deleting resources can cause data loss with some types, and it names `SpannerInstance` and `BigtableTable` as examples. Recreating a stateful resource, for example to move it between projects, has the same risk. [sources/research-provider](../sources/research-provider.md)

## Why it matters

Because the default behavior of the major providers is to delete the cloud resource when the Kubernetes object is deleted, a mistaken manifest removal, a namespace deletion, or a GitOps prune can delete a database along with its data. See [comparisons/deletion-policies-across-gitops-and-provider-tools](../comparisons/deletion-policies-across-gitops-and-provider-tools.md) and [findings/unintended-deletion-through-prune](unintended-deletion-through-prune.md). [sources/research-provider](../sources/research-provider.md)

## Mitigations

Set the abandon policy on Config Connector resources, the retain annotation on ACK resources, and `Orphan` or a `managementPolicies` list without `Delete` on Crossplane resources, before any operation that deletes the Kubernetes object. Config Connector's abandon and acquire workflow moves a resource between projects or namespaces without deleting it. See [findings/destructive-deletion-of-external-resources](destructive-deletion-of-external-resources.md), [entities/config-connector](../entities/config-connector.md), and [concepts/managed-resource](../concepts/managed-resource.md).

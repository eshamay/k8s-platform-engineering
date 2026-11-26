---
title: Cluster API co-authored list slices can reconcile forever, and server-side apply can fail to remove list items
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-m4-ssa-conflict-policy
    hash: 28e595eae3e0
    ingested: 2026-11-26
aliases: [Cluster API topology SSA limits]
tags: [cluster-api, topology, server-side-apply, field-ownership, co-authoring, verified]
---

# Cluster API co-authored list slices can reconcile forever, and server-side apply can fail to remove list items

## Observation

The Cluster API topology controller applies with `client.FieldOwner("capi-topology")` and `client.ForceOwnership`, using the constant `TopologyManagerName = "capi-topology"`. [[sources/research-gap-m4-ssa-conflict-policy]] URL: https://github.com/kubernetes-sigs/cluster-api/blob/main/core/reconcilers/topology/cluster/structuredmerge/serversidepatchhelper.go (commit f11b064). The book's page on changing a ClusterClass says the controller uses server-side apply "to write/patch topology owned objects" and that "using SSA allows other controllers to co-author the generated objects", for example the AWS provider adding subnet information. It advises against ad hoc edits to the generated objects but publishes no per-field ownership table.

## Two documented limits

The troubleshooting page says that a slice co-authored by the templates and an infrastructure controller can cause "infinite reconcile" (issue 6320), with no fix yet and advice to avoid co-authored slices. A second entry says server-side apply patches can fail to remove list items after an atomic-to-map list transition, for example `cluster.spec.topology.variables`, and that client-side apply or "continuous" server-side apply with GitOps tools "works as expected". URL: https://github.com/kubernetes-sigs/cluster-api/blob/main/docs/book/src/user/guide/troubleshooting.md. The code also has a `MitigateManagedFieldsIssue` step on the topology-owned objects, whose body was not read.

## What is not known

A table of fields owned by the topology controller versus infrastructure and control plane providers was searched for in the book, the contract documents, and the `structuredmerge` package and was not found. The wiki still cannot state field-level rules. Latest release read: v1.14.4, published 2026-11-03.

## Why it matters

This is a case where forcing does not end the dispute: two writers appending to one list can reconcile forever even though the topology controller forces. See [[decisions/force-conflicts-or-surface-them-to-humans]] and [[findings/atomic-lists-and-unmarked-crds-block-shared-field-ownership]].

## Related

[[entities/cluster-api]], [[examples/cluster-api-topology-controller-uses-ssa-for-co-authored-objects]], [[comparisons/ssa-conflict-policy-across-tools]]

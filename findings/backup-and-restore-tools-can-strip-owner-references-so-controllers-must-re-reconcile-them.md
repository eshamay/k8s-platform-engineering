---
title: "Backup and restore tools can strip owner references so controllers must re-reconcile them"
type: finding
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-owner-references-and-garbage-collection
    hash: bd4cc1219f2d
    ingested: 2026-11-25
aliases: []
tags: [pitfall, owner-references, velero, cluster-api, restore]
---

# Backup and restore tools can strip owner references so controllers must re-reconcile them

## Observation

The Cluster API book calls out Velero stripping owner references as a known hazard, and states "Owner references should be re-reconciled if they are lost for an object." The same page warns against unnecessary references, stale API versions inside references, and multiple owners. [[sources/research-owner-references-and-garbage-collection]]

## Consequence

Because cluster deletion and `clusterctl move` depend on the chain of references, a restore that drops them would break teardown and relocation until a controller repairs the links. The remedy is a level-based one: the controller treats the references as part of desired state and rewrites them on every reconcile. The dossier did not test Velero itself. See [[examples/cluster-api-owner-reference-chain-drives-cluster-deletion-and-clusterctl-move]] and [[concepts/reconciliation-loop]].

## Related

[[entities/cluster-api]], [[concepts/owner-references-and-garbage-collection]]

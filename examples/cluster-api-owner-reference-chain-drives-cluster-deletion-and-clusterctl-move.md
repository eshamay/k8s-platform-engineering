---
title: "The Cluster API owner reference chain drives cluster deletion and clusterctl move"
type: example
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-owner-references-and-garbage-collection
    hash: bd4cc1219f2d
    ingested: 2026-11-25
aliases: []
tags: [cluster-api, owner-references, clusterctl-move, deletion]
---

# The Cluster API owner reference chain drives cluster deletion and clusterctl move

## Scenario

A management cluster holds the objects that describe a fleet of workload clusters. The team needs two guarantees: deleting a Cluster tears down everything beneath it, and `clusterctl move` can relocate the whole set of objects to another management cluster in a valid order. The Cluster API book page on owner references defines the contract that both depend on. [[sources/research-owner-references-and-garbage-collection]]

## How it works

The ownership chain is Cluster, MachineDeployment, MachineSet, Machine, with infrastructure and bootstrap objects owned by the Machine. The book names which controller sets each link. Owner references drive cluster deletion, and `clusterctl move` uses them to move objects in dependency order. Because tools such as Velero can strip references on restore, the book says "Owner references should be re-reconciled if they are lost for an object." It also warns against unnecessary owner references, stale API versions inside references, and multiple owners, which should be exceptional.

## Why the example matters

This is the clearest named project in the dossier that treats ownership as a core API contract and not just a convenience. The machine-level teardown that follows the cascade is described separately in [[examples/cluster-api-machine-deletion-drains-detaches-and-runs-hooks-before-removing-the-node]]. The hazard of lost references has its own page: [[findings/backup-and-restore-tools-can-strip-owner-references-so-controllers-must-re-reconcile-them]].

## Related

[[entities/cluster-api]], [[concepts/owner-references-and-garbage-collection]], [[examples/cluster-fleet-lifecycle-with-cluster-api]]

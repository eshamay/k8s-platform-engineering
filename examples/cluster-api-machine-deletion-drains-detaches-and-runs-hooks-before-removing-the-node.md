---
title: "Cluster API machine deletion drains, detaches, and runs hooks before removing the node"
type: example
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-finalizers
    hash: ca11dffc241b
    ingested: 2026-11-25
aliases: []
tags: [finalizers, cluster-api, deletion, infrastructure]
---

# Cluster API machine deletion drains, detaches, and runs hooks before removing the node

## Scenario

A management cluster removes a worker machine, for example during a rolling upgrade or after a health check replaces it. The machine must leave without dropping workloads or leaking its infrastructure. The Cluster API machine deletion page describes the phases. [[sources/research-finalizers]]

## How it works

A `deletionTimestamp` on the Machine starts a multi-phase teardown. The controller runs pre-drain hooks, drains the node, waits for volumes to detach, runs pre-terminate hooks, deletes the infrastructure and bootstrap objects, and finally deletes the node. The hooks are finalizer-like gates implemented as annotations. The page lists the escape hatches for a stuck drain: the `exclude-node-draining` annotation and `nodeDrainTimeout`.

## Why the example matters

The sequence shows deletion as a workflow, not a single cleanup step. Each phase can block, and each block has a documented cause. See [[findings/machine-deletion-stalls-on-disruption-budgets-attached-volumes-and-failing-hooks]]. The dossier cites Cluster API issue 1514 on blocking deletion with a finalizer or an annotation as a search hit that it did not read. See [[open-knowledge-gaps]].

## Related

[[entities/cluster-api]], [[examples/cluster-api-machine-health-check-replaces-failed-nodes]], [[concepts/finalizers]]

---
title: "Cluster API machine deletion drains, detaches, and runs hooks before removing the node"
type: example
status: active
created: 2026-11-25
updated: 2026-11-26
sources:
  - id: research-gap-m1-finalizers
    hash: 014549e333b6
    ingested: 2026-11-26
  - id: research-finalizers
    hash: ca11dffc241b
    ingested: 2026-11-25
aliases: []
tags: [finalizers, cluster-api, deletion, infrastructure]
---

# Cluster API machine deletion drains, detaches, and runs hooks before removing the node

## Scenario

A management cluster removes a worker machine, for example during a rolling upgrade or after a health check replaces it. The machine must leave without dropping workloads or leaking its infrastructure. The Cluster API machine deletion page describes the phases. [sources/research-finalizers](../sources/research-finalizers.md)

## How it works

A `deletionTimestamp` on the Machine starts a multi-phase teardown. The controller runs pre-drain hooks, drains the node, waits for volumes to detach, runs pre-terminate hooks, deletes the infrastructure and bootstrap objects, and finally deletes the node. The hooks are finalizer-like gates implemented as annotations. The page lists the escape hatches for a stuck drain: the `exclude-node-draining` annotation and `nodeDrainTimeout`.

## Why the example matters

The sequence shows deletion as a workflow, not a single cleanup step. Each phase can block, and each block has a documented cause. See [findings/machine-deletion-stalls-on-disruption-budgets-attached-volumes-and-failing-hooks](../findings/machine-deletion-stalls-on-disruption-budgets-attached-volumes-and-failing-hooks.md). Cluster API issue 1514 on blocking deletion with a finalizer or an annotation was closed in 2020 in favor of a proposal that chose the annotation hooks, see [examples/cluster-api-issue-1514-was-closed-in-april-2020-in-favor-of-a-proposal-that-chose-annotation-hooks](cluster-api-issue-1514-was-closed-in-april-2020-in-favor-of-a-proposal-that-chose-annotation-hooks.md) and [findings/cluster-api-chose-annotation-hooks-over-finalizers-for-machine-deletion-because-a-misbehaving-controller-could-remove-finalizers](../findings/cluster-api-chose-annotation-hooks-over-finalizers-for-machine-deletion-because-a-misbehaving-controller-could-remove-finalizers.md). [sources/research-gap-m1-finalizers](../sources/research-gap-m1-finalizers.md)

## Related

[entities/cluster-api](../entities/cluster-api.md), [examples/cluster-api-machine-health-check-replaces-failed-nodes](cluster-api-machine-health-check-replaces-failed-nodes.md), [concepts/finalizers](../concepts/finalizers.md)

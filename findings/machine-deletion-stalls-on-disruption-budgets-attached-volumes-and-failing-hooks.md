---
title: "Machine deletion stalls on disruption budgets, attached volumes, and failing hooks"
type: finding
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-finalizers
    hash: ca11dffc241b
    ingested: 2026-11-25
aliases: []
tags: [pitfall, cluster-api, deletion, drain]
---

# Machine deletion stalls on disruption budgets, attached volumes, and failing hooks

## Observation

The Cluster API machine deletion page lists what blocks a teardown: PodDisruptionBudgets, pods that are themselves terminating, volumes that are still attached, failing hooks, and unreachable nodes. The project provides controlled escape hatches, namely the `exclude-node-draining` annotation and `nodeDrainTimeout`. [sources/research-finalizers](../sources/research-finalizers.md)

## Why it matters

Each blocker is a safety property: a disruption budget protects availability, and a volume check protects data. Bypassing a block with a timeout trades that safety for progress, so the timeout is a decision to make, not a default to apply everywhere.

## Related

[entities/cluster-api](../entities/cluster-api.md), [examples/cluster-api-machine-deletion-drains-detaches-and-runs-hooks-before-removing-the-node](../examples/cluster-api-machine-deletion-drains-detaches-and-runs-hooks-before-removing-the-node.md), [findings/remediation-can-amplify-an-outage](remediation-can-amplify-an-outage.md)

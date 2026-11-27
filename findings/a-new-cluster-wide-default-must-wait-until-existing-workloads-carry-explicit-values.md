---
title: A new cluster-wide default must wait until existing workloads carry explicit values
type: finding
status: active
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-pitfalls-and-case-studies
    hash: 9407913c2448
    ingested: 2026-11-25
aliases: []
tags: [pitfall, priorityclass, defaults, cascade, replicaset, change-management]
---

# A new cluster-wide default must wait until existing workloads carry explicit values

## Observation

Grafana made "medium" the global default PriorityClass before its existing production ingesters had an explicit priority. A new Cortex cluster deployed without priorities inherited medium and preempted the production pods. Each preempted pod was recreated by its ReplicaSet at medium priority and preempted another one, so a controller loop amplified the policy until every production ingester was evicted. The outage lasted about 26 minutes. URL: https://grafana.com/blog/2019/07/24/how-a-production-outage-was-caused-using-kubernetes-pod-priorities/. [sources/research-pitfalls-and-case-studies](../sources/research-pitfalls-and-case-studies.md)

## Why it matters

A cluster-global default changes the meaning of every object that does not set the field. The author's rule is to add the explicit high-priority designation first and only then change the default, and to review cluster-scoped configuration with the rigor of code. The same class of risk appears in any default that controllers reapply, which makes the amplification by a reconcile loop the dangerous part.

## Evidence quality

The source is a single first-party postmortem from 2019. See [examples/grafana-s-default-priorityclass-let-a-new-cluster-preempt-every-production-ingester](../examples/grafana-s-default-priorityclass-let-a-new-cluster-preempt-every-production-ingester.md).

## Related

[concepts/pitfalls-and-case-studies](../concepts/pitfalls-and-case-studies.md), [concepts/reconciliation-loop](../concepts/reconciliation-loop.md)

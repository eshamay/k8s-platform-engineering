---
title: Grafana's default PriorityClass let a new cluster preempt every production ingester
type: example
status: active
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-pitfalls-and-case-studies
    hash: 9407913c2448
    ingested: 2026-11-25
aliases: [Grafana pod priority outage]
tags: [postmortem, priorityclass, replicaset, cascade, grafana, cortex]
---

# Grafana's default PriorityClass let a new cluster preempt every production ingester

## Scenario

Grafana Labs operated Cortex-based hosted Prometheus. To make room for large Cortex ingester pods during upgrades, it added four PriorityClasses and made "medium" the global default. [sources/research-pitfalls-and-case-studies](../sources/research-pitfalls-and-case-studies.md)

## What happened

A new Cortex cluster was deployed without priorities, so it received the default medium priority and preempted the production ingesters, which had no priority set. Each preempted pod was recreated by its ReplicaSet at medium priority and preempted another pod, so the cascade evicted every production ingester. The outage lasted about 26 minutes and no data was lost. URL: https://grafana.com/blog/2019/07/24/how-a-production-outage-was-caused-using-kubernetes-pod-priorities/

## Lesson

The author's conclusion was "we should not have made medium the default priority until we had added the high priority designation". The incident is a clean example of a controller reconcile loop, here a ReplicaSet, amplifying a scheduling policy. Other lessons were to roll out cluster-global configuration with design review and to size reverse proxies against retry stampedes. See [findings/a-new-cluster-wide-default-must-wait-until-existing-workloads-carry-explicit-values](../findings/a-new-cluster-wide-default-must-wait-until-existing-workloads-carry-explicit-values.md) and [concepts/reconciliation-loop](../concepts/reconciliation-loop.md).

## Related

[concepts/pitfalls-and-case-studies](../concepts/pitfalls-and-case-studies.md)

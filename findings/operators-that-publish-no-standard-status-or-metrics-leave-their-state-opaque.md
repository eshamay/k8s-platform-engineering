---
title: Operators that publish no standard status or metrics leave their state opaque
type: finding
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-operator-pattern
    hash: eab72eca2e1b
    ingested: 2026-11-25
aliases: []
tags: [pitfall, status, conditions, observability]
---

# Operators that publish no standard status or metrics leave their state opaque

## Observation

Users and tools cannot tell whether an operator has finished, is stuck, or has failed unless it reports progress in a recognizable form. Kubebuilder recommends standard status conditions that follow the API conventions so that people and automation can observe progress. The Operator SDK capability model treats metrics, alerting, and insights as Level 4, which implies many operators stop short of them. The Google Cloud guidance adds aggregated logs and well-labelled metrics exposed on pod endpoints. [sources/research-operator-pattern](../sources/research-operator-pattern.md)

## Related

[concepts/conditions](../concepts/conditions.md), [concepts/spec-status-split](../concepts/spec-status-split.md), [entities/operator-sdk](../entities/operator-sdk.md), [findings/misleading-readiness-and-stale-status](misleading-readiness-and-stale-status.md). URL: https://book.kubebuilder.io/reference/good-practices and https://sdk.operatorframework.io/docs/overview/operator-capabilities/.

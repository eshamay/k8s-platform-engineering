---
title: Prometheus Operator
type: entity
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-spec-status-split
    hash: 598e6132ea4f
    ingested: 2026-11-25
  - id: research-operator-pattern
    hash: eab72eca2e1b
    ingested: 2026-11-25
aliases: []
tags: [tool, operators, monitoring, status]
---

# Prometheus Operator

## What it is

Prometheus Operator is a project that manages Prometheus-related workloads through custom resources such as `Prometheus`, `Alertmanager`, `PrometheusAgent`, and `ThanosRuler`, plus configuration objects such as `ServiceMonitor`, `PodMonitor`, and `PrometheusRule`. [sources/research-spec-status-split](../sources/research-spec-status-split.md)

## Status design

The project adopted a status subresource after the fact. The workload CRDs gained replica and availability counts and `Available` and `Reconciled` conditions, with per-shard status for `Prometheus`, because users could not otherwise tell whether a resource was available. The configuration CRDs were excluded because several reconcilers act on them. URL: https://prometheus-operator.dev/docs/proposals/implemented/status-subresource/. See [examples/prometheus-operator-retrofits-status-onto-workload-crds](../examples/prometheus-operator-retrofits-status-onto-workload-crds.md), [decisions/which-crds-get-a-status-subresource](../decisions/which-crds-get-a-status-subresource.md), and [findings/config-style-crds-with-several-reconcilers-get-no-status](../findings/config-style-crds-with-several-reconcilers-get-no-status.md).

## Related

[concepts/spec-status-split](../concepts/spec-status-split.md), [concepts/operator-pattern](../concepts/operator-pattern.md), [examples/servicemonitor-no-matches-for-kind-in-helm-and-argo-cd](../examples/servicemonitor-no-matches-for-kind-in-helm-and-argo-cd.md)

## Named as a cluster add-on operator

The CNCF explainer names Prometheus Operator as a monitoring operator whose custom resources turn install and day-2 work into declarative objects. [sources/research-operator-pattern](../sources/research-operator-pattern.md) See [examples/cluster-add-on-operators-turn-install-and-day-2-work-into-objects](../examples/cluster-add-on-operators-turn-install-and-day-2-work-into-objects.md).

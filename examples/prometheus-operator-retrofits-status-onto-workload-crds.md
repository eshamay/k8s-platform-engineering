---
title: Prometheus Operator retrofits status onto its workload CRDs
type: example
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-spec-status-split
    hash: 598e6132ea4f
    ingested: 2026-11-25
aliases: []
tags: [prometheus-operator, status-subresource, retrofit, design-proposal]
---

# Prometheus Operator retrofits status onto its workload CRDs

## Scenario

Users of Prometheus Operator could not tell whether a `Prometheus` resource was actually available without querying the operator out of band. The project responded with an implemented design proposal that adds a status subresource after the CRDs already existed. [sources/research-spec-status-split](../sources/research-spec-status-split.md)

## How it works

The proposal adds status to `Prometheus`, `Alertmanager`, `PrometheusAgent`, and `ThanosRuler`. Each gets replica and availability counts plus `Available` and `Reconciled` conditions, and `Prometheus` also gets per-shard status. The stated goal is to define the status structure for custom resources that materialize as Pod objects. The proposal deliberately leaves out `ServiceMonitor`, `PodMonitor`, and `PrometheusRule`, because several reconcilers touch those objects and a single status would be ambiguous. URL: https://prometheus-operator.dev/docs/proposals/implemented/status-subresource/.

## Lesson

Adding status later is possible, but it is a design decision per kind, and the kinds that are configuration inputs read by many consumers are poor candidates. The project drew the line at workload-like objects that have one owning reconciler. See [decisions/which-crds-get-a-status-subresource](../decisions/which-crds-get-a-status-subresource.md), [findings/config-style-crds-with-several-reconcilers-get-no-status](../findings/config-style-crds-with-several-reconcilers-get-no-status.md), [entities/prometheus-operator](../entities/prometheus-operator.md), and [concepts/spec-status-split](../concepts/spec-status-split.md).

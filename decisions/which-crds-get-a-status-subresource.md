---
title: Which CRDs get a status subresource
type: decision
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-spec-status-split
    hash: 598e6132ea4f
    ingested: 2026-11-25
aliases: []
tags: [status-subresource, prometheus-operator, crd-design]
---

# Which CRDs get a status subresource

## Status

Decided by Prometheus Operator in an implemented design proposal, recorded here as a worked decision for CRD authors. [[sources/research-spec-status-split]]

## Context

Users of `Prometheus` and similar resources could not tell whether the workload was available without querying the operator. At the same time, some of the project's CRDs are configuration read by several reconcilers. URL: https://prometheus-operator.dev/docs/proposals/implemented/status-subresource/.

## Decision

Add the status subresource to CRDs that materialize as Pod objects and have a single owning reconciler: `Prometheus`, `Alertmanager`, `PrometheusAgent`, and `ThanosRuler`. Give them replica and availability counts and `Available` and `Reconciled` conditions, with per-shard status for `Prometheus`. Leave `ServiceMonitor`, `PodMonitor`, and `PrometheusRule` without status.

## Consequences

Users get a direct availability signal and controllers can write status without retriggering themselves. Config-style objects stay statusless, so users get no acceptance feedback for them. Enabling the subresource on an existing CRD changes write semantics, because writes to the main resource then ignore status. See [[findings/config-style-crds-with-several-reconcilers-get-no-status]], [[findings/status-writes-through-the-main-resource-retrigger-reconcile-loops]], and [[examples/prometheus-operator-retrofits-status-onto-workload-crds]].

## Related

[[concepts/custom-resource-definition]], [[concepts/spec-status-split]], [[entities/prometheus-operator]]

---
title: Config-style CRDs with several reconcilers get no status
type: finding
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-spec-status-split
    hash: 598e6132ea4f
    ingested: 2026-11-25
aliases: []
tags: [pitfall, multiple-writers, prometheus-operator, status]
---

# Config-style CRDs with several reconcilers get no status

## Observation

Prometheus Operator's status design deliberately excludes `ServiceMonitor`, `PodMonitor`, and `PrometheusRule`. These objects are configuration read by more than one reconciler, so a single status block would collect conflicting data from several writers. The workload CRDs such as `Prometheus` and `Alertmanager` have one owning reconciler and did get status. The dossier also credits Crossplane's split of `Synced` from `Ready` with keeping controller-health and resource-readiness signals apart, which is a related way of preventing one status from carrying two meanings. [sources/research-spec-status-split](../sources/research-spec-status-split.md) URLs: https://prometheus-operator.dev/docs/proposals/implemented/status-subresource/ and https://docs.crossplane.io/latest/composition/composite-resources/.

## Why it matters

Status assumes one writer per field. When that is not true, users lose the benefit of knowing whether their object was accepted, and the project has to choose between no signal and an unreliable signal.

## Mitigations

Give status to objects with a single owning reconciler, and for shared inputs consider separate per-consumer objects or conditions scoped by writer. This is the status-side version of [findings/multiple-writers-on-one-object](multiple-writers-on-one-object.md). See [decisions/which-crds-get-a-status-subresource](../decisions/which-crds-get-a-status-subresource.md) and [examples/prometheus-operator-retrofits-status-onto-workload-crds](../examples/prometheus-operator-retrofits-status-onto-workload-crds.md).

## Related

[concepts/spec-status-split](../concepts/spec-status-split.md), [concepts/server-side-apply-and-field-ownership](../concepts/server-side-apply-and-field-ownership.md)

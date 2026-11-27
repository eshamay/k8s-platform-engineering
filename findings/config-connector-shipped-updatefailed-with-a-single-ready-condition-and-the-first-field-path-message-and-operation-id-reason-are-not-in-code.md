---
title: Config Connector shipped UpdateFailed with a single Ready condition, and the first-field-path message and operation-ID reason are not in code
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-m3-status-conditions
    hash: 07099fedb0c8
    ingested: 2026-11-26
aliases: [Config Connector reconcile status design versus code]
tags: [config-connector, conditions, design-versus-shipped, verified]
---

# Config Connector shipped UpdateFailed with a single Ready condition, and the first-field-path message and operation-ID reason are not in code

## Observation

The Config Connector design document `docs/designs/reconcile-status.md` has one commit, dated 2026-01-30, and covers direct controllers only. It proposes a single `Ready` condition with reasons `Updating`, `UpToDate`, and `UpdateFailure`, a failure message of the form "Failed to update resource (first field path: ...)", and, as a future consideration, long-running operation IDs in the reason such as `Updating:operation-123456789`. [sources/research-gap-m3-status-conditions](../sources/research-gap-m3-status-conditions.md) URL: https://github.com/GoogleCloudPlatform/k8s-config-connector/blob/master/docs/designs/reconcile-status.md

The code at release v1.162.0 (2026-11-23) matches the design in four respects. One `Ready` condition exists at a time, because the legacy handler replaces the whole list and the direct-controller setter updates by type. `Ready=False` with reason `Updating` is set while an update runs, and `Ready=True` with reason `UpToDate` follows. A top-level `status.observedGeneration` is written on every status update, and Kubernetes events use the same reason strings. URLs: https://github.com/GoogleCloudPlatform/k8s-config-connector/blob/master/pkg/controller/lifecyclehandler/handler.go and https://github.com/GoogleCloudPlatform/k8s-config-connector/blob/master/pkg/controller/direct/directbase/operations.go

It differs in four respects. The failure reason is `UpdateFailed`, not `UpdateFailure`. The failure message is "Update call failed: ...". The Updating message is "Update in progress" and the UpToDate message is "The resource is up to date" (the design says "Resource is up to date"). And code searches found no first-field-path message, no field-path helper, no `Updating:<operation-id>` reason, and no per-condition `observedGeneration`. The search index may lag, and whether an open pull request implements the design was not checked.

## Why it matters

A reader who builds a consumer from the design document would match the wrong reason string. Argo CD's shipped health script matches `UpdateFailed`, which corroborates the shipped name. See [examples/argo-cd-s-config-connector-health-script-maps-uptodate-to-healthy-updatefailed-to-degraded-and-gates-on-observedgeneration](../examples/argo-cd-s-config-connector-health-script-maps-uptodate-to-healthy-updatefailed-to-degraded-and-gates-on-observedgeneration.md) and [examples/config-connector-ready-condition-moves-through-updating-uptodate-and-updatefailure](../examples/config-connector-ready-condition-moves-through-updating-uptodate-and-updatefailure.md).

## Mitigations

Match on the shipped reasons (`Updating`, `UpToDate`, `UpdateFailed`, `DependencyNotFound`, `DependencyNotReady`) and read the reason, because `Ready=False` covers both in-flight and failed. See [entities/config-connector](../entities/config-connector.md), [comparisons/condition-vocabularies-across-crossplane-ack-config-connector-flux-kro-and-cluster-api](../comparisons/condition-vocabularies-across-crossplane-ack-config-connector-flux-kro-and-cluster-api.md), and [concepts/conditions](../concepts/conditions.md).

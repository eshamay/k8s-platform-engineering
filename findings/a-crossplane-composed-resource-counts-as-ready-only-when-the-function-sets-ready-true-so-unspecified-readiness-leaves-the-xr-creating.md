---
title: A Crossplane composed resource counts as ready only when the function sets READY_TRUE so unspecified readiness leaves the XR Creating
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-b1-recheck-kro-crossplane
    hash: ecd45fe657c9
    ingested: 2026-11-26
aliases: []
tags: [crossplane, composition-functions, readiness, status, function-auto-ready]
---

# A Crossplane composed resource counts as ready only when the function sets READY_TRUE so unspecified readiness leaves the XR Creating

## Observation

In Crossplane v2.5.0 the function protocol attaches a `Ready` enum (`READY_UNSPECIFIED`, `READY_TRUE`, `READY_FALSE`) to each desired resource and to the desired composite. The composer builds each composed resource with `Ready: dr.GetReady() == fnv1.Ready_READY_TRUE`, so `READY_FALSE` and `READY_UNSPECIFIED` both count as not ready. A TODO comment in the source asks whether an unspecified value should derive readiness from the resource's own `Ready` condition. [sources/research-gap-b1-recheck-kro-crossplane](../sources/research-gap-b1-recheck-kro-crossplane.md) URL: https://github.com/crossplane/crossplane/blob/v2.5.0/internal/controller/apiextensions/composite/composition_functions.go

The reconciler then collects every composed resource that is not ready. The XR `Ready` condition is `Available` when that list is empty and `Creating` with the message "Unready resources: ..." otherwise, and `Deleting` while the XR is being deleted. An explicit XR-level ready value returned by the composer supersedes the derived one. `Synced` is `ReconcileSuccess` unless a composed resource is not synced, in which case it is `ReconcileError` with "Unsynced resources: ...". URL: https://github.com/crossplane/crossplane/blob/v2.5.0/internal/controller/apiextensions/composite/reconciler.go

`function-auto-ready` supplies the missing signal. It leaves a desired resource alone when it already carries explicit readiness, and for the rest it uses optional CEL queries and resource-specific health checks for standard Kubernetes resources before falling back to an observed `Ready` condition equal to True. The observed condition is therefore the last test and not the only one. Correction note: the first revision of the dossier described only the condition fallback, and the second verification pass added the earlier checks. URL: https://github.com/crossplane-contrib/function-auto-ready/blob/main/fn.go

## Why it matters

A pipeline that composes resources but has no function setting `READY_TRUE` leaves the XR in `Creating` indefinitely, even though every composed resource is healthy. The cause is the pipeline, not the provider. This also means the XR `Ready` is a function-authored summary, unlike a kro instance, where the controller computes `Ready` from the graph. See [comparisons/crossplane-composition-functions-versus-kro-resource-graph-execution-models](../comparisons/crossplane-composition-functions-versus-kro-resource-graph-execution-models.md).

## Mitigations

End the pipeline with `function-auto-ready`, or have a function set `READY_TRUE` for each resource it considers ready. When an XR is stuck in `Creating`, read the "Unready resources" message first, since it names the composed resources that are not ready. See [examples/crossplane-xr-spec-pins-composition-and-status-reports-synced-and-ready](../examples/crossplane-xr-spec-pins-composition-and-status-reports-synced-and-ready.md), [examples/function-kro-runs-a-kro-resource-graph-as-a-crossplane-pipeline-step](../examples/function-kro-runs-a-kro-resource-graph-as-a-crossplane-pipeline-step.md), and [entities/crossplane](../entities/crossplane.md).

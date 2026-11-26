---
title: A Crossplane XR spec pins a composition and its status reports Synced and Ready
type: example
status: active
created: 2026-11-25
updated: 2026-11-26
sources:
  - id: research-gap-b1-recheck-kro-crossplane
    hash: ccee0efa5bdd
    ingested: 2026-11-26
  - id: research-spec-status-split
    hash: 598e6132ea4f
    ingested: 2026-11-25
aliases: []
tags: [crossplane, composite-resource, conditions, platform-api]
---

# A Crossplane XR spec pins a composition and its status reports Synced and Ready

## Scenario

A platform team exposes a composite resource (XR) that stands for a set of Kubernetes resources as a single object. The split between spec and status recurs here at a higher layer than a single controller. [[sources/research-spec-status-split]]

## How it works

The XR spec carries more than user-facing fields. It also selects and pins the composition through `compositionRef`, `compositionSelector`, `compositionUpdatePolicy`, and revision references, and it holds operational annotations such as pause and poll interval. The status uses two conditions. `Synced` says Crossplane could reconcile the resource, and `Ready` says the function pipeline reports every composed resource ready. Two separate conditions let an operator distinguish "the platform is broken" from "the cloud resource is still coming up". URL: https://docs.crossplane.io/latest/composition/composite-resources/ (Crossplane v2.4 documentation).

## Lesson

A rolled-up status is only as good as its definition of ready, so the platform author chooses what the composite promises. Reading both conditions is required to interpret the object. See [[entities/crossplane]], [[concepts/composite-resource]], [[examples/crossplane-database-claim-reports-synced-and-ready]], and [[findings/misleading-readiness-and-stale-status]]. The Crossplane v2 function-pipeline status propagation was not read, so its details are open in [[open-knowledge-gaps]].

## Status propagation read from v2.5.0 source (2026-11-26)

The open question in the last paragraph is answered. Each composed resource is ready only when a function returns `READY_TRUE`. The XR `Ready` is `Available` when none is unready and `Creating` with "Unready resources: ..." otherwise, an explicit XR-level ready from the function overrides the derived value, and `Synced` is `ReconcileSuccess` unless a composed resource is unsynced, in which case it is `ReconcileError` with "Unsynced resources: ...". See [[findings/a-crossplane-composed-resource-counts-as-ready-only-when-the-function-sets-ready-true-so-unspecified-readiness-leaves-the-xr-creating]]. XR conditions can also flap from a stale cached read in v2.5.0, see [[findings/crossplane-v2-5-0-writes-xr-status-twice-so-a-lagging-cache-can-replay-old-conditions]]. [[sources/research-gap-b1-recheck-kro-crossplane]]

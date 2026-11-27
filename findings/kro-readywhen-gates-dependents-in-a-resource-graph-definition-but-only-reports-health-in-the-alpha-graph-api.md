---
title: kro readyWhen gates dependents in a ResourceGraphDefinition but only reports health in the alpha Graph API
type: finding
status: active
created: 2026-11-25
updated: 2026-11-26
sources:
  - id: research-composite-resource
    hash: 8640896d06b9
    ingested: 2026-11-25
  - id: research-gap-g3-kro
    hash: e8d7c5923d98
    ingested: 2026-11-26
aliases: []
tags: [pitfall, kro, readiness, ordering, cel]
---

# kro readyWhen gates dependents in a ResourceGraphDefinition but only reports health in the alpha Graph API

## Observation

kro's `readyWhen` is a list of CEL boolean expressions that define when one resource counts as ready. The readiness page says that it "determines when **this specific resource** is ready." In an RGD, dependents wait until all their dependencies are ready, which prevents a template from using status values, such as a database endpoint, that do not exist yet. In the newer alpha `Graph` API, which is disabled by default, `readyWhen` only reports health, and a dependent is applied as soon as the fields it references exist. [sources/research-composite-resource](../sources/research-composite-resource.md) URL: https://kro.run/docs/concepts/reconciliation/readiness.

## Why it matters

Ordering and readiness are two different mechanisms, and the same field name does different work in the two APIs. A team that moves from an RGD to a Graph could lose a gate it relied on. The documented workaround for Graph is to reference a status field that only exists once the resource is healthy. Expressions can reference only the resource itself, which keeps them local and debuggable but means cross-resource conditions must be written another way.

## Mitigations

Read the API variant before assuming a gate, and use the optional `?` operator with `orValue` for fields that may be absent. See [examples/kro-rgd-authors-define-instance-conditions-with-cel-and-readywhen](../examples/kro-rgd-authors-define-instance-conditions-with-cel-and-readywhen.md), [comparisons/ordering-models-flux-argo-cd-kro-crossplane](../comparisons/ordering-models-flux-argo-cd-kro-crossplane.md), [findings/misleading-readiness-and-stale-status](misleading-readiness-and-stale-status.md), and [entities/kro](../entities/kro.md).

## Confirmed at v0.10.0

The released v0.10.0 documentation confirms both halves. For an RGD, the readiness page says "all resources that depend on it must wait until it's ready". For a Graph, it says the node "does not wait for the upstream node's `readyWhen` conditions", and the Graph docs show gating by referencing a field that exists only when the upstream is healthy. `readyWhen` may reference only the resource itself (or `each` for collections) and must return a boolean. It is accepted on `template`, `ref`, and `def` nodes and rejected on `patch` and `graph` nodes. Without it, a resource is ready once it is created and its references resolve. For a collection, `readyWhen` applies to the whole collection, and a reference to a collection waits until it is fully reconciled and ready. In a Graph, nodes apply serially in topological order while `forEach` items apply in parallel. The Graph API is alpha, introduced in v0.10.0, disabled by default behind the `GraphKind` gate, and has no compatibility guarantee. One caution for the optional-operator advice above: in an RGD, a reference written with the optional operator still creates a dependency edge, so it does not remove the ordering. [sources/research-gap-g3-kro](../sources/research-gap-g3-kro.md) See [findings/a-kro-includewhen-on-a-volatile-upstream-status-field-makes-resources-flip-flop](a-kro-includewhen-on-a-volatile-upstream-status-field-makes-resources-flip-flop.md) for the sibling pitfall on `includeWhen`.

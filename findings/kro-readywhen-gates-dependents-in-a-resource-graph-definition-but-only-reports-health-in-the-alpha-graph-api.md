---
title: kro readyWhen gates dependents in a ResourceGraphDefinition but only reports health in the alpha Graph API
type: finding
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-composite-resource
    hash: 8640896d06b9
    ingested: 2026-11-25
aliases: []
tags: [pitfall, kro, readiness, ordering, cel]
---

# kro readyWhen gates dependents in a ResourceGraphDefinition but only reports health in the alpha Graph API

## Observation

kro's `readyWhen` is a list of CEL boolean expressions that define when one resource counts as ready. The readiness page says that it "determines when **this specific resource** is ready." In an RGD, dependents wait until all their dependencies are ready, which prevents a template from using status values, such as a database endpoint, that do not exist yet. In the newer alpha `Graph` API, which is disabled by default, `readyWhen` only reports health, and a dependent is applied as soon as the fields it references exist. [[sources/research-composite-resource]] URL: https://kro.run/docs/concepts/reconciliation/readiness.

## Why it matters

Ordering and readiness are two different mechanisms, and the same field name does different work in the two APIs. A team that moves from an RGD to a Graph could lose a gate it relied on. The documented workaround for Graph is to reference a status field that only exists once the resource is healthy. Expressions can reference only the resource itself, which keeps them local and debuggable but means cross-resource conditions must be written another way.

## Mitigations

Read the API variant before assuming a gate, and use the optional `?` operator with `orValue` for fields that may be absent. See [[examples/kro-rgd-authors-define-instance-conditions-with-cel-and-readywhen]], [[comparisons/ordering-models-flux-argo-cd-kro-crossplane]], [[findings/misleading-readiness-and-stale-status]], and [[entities/kro]].

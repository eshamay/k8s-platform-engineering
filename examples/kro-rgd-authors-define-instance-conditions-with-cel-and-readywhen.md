---
title: kro RGD authors define instance conditions with CEL and readyWhen
type: example
status: active
created: 2026-11-25
updated: 2026-11-26
sources:
  - id: research-gap-b1-recheck-kro-crossplane
    hash: ccee0efa5bdd
    ingested: 2026-11-26
  - id: research-conditions
    hash: 97b224c63502
    ingested: 2026-11-25
  - id: research-gap-g3-kro
    hash: e8d7c5923d98
    ingested: 2026-11-26
aliases: []
tags: [kro, conditions, cel, readywhen, platform-api]
---

# kro RGD authors define instance conditions with CEL and readyWhen

## Scenario

A platform team publishes an API through a kro ResourceGraphDefinition that stamps out a database, a secret, and a service for each instance. The team wants the instance `Ready` condition to mean more than "all children exist": for example, the database must accept connections and the service must have an endpoint. [sources/research-conditions](../sources/research-conditions.md)

## How it works

Each resource in the graph can carry a `readyWhen` list of CEL expressions. If it is omitted, kro treats a resource as ready as soon as it exists, which is a weak default for slow cloud resources. The RGD itself publishes conditions such as `Ready`, `GraphRevisionsResolved`, `GraphAccepted`, `KindReady`, and `ControllerReady` (five at v0.10.0, where earlier text in this wiki listed four), and each carries an `observedGeneration` that records the generation the condition was based on, so a condition at generation 9 on an object at generation 12 is known to be stale. URL: https://kro.run/api/crds/resourcegraphdefinition/.

An author can go further and declare custom instance conditions with `runtime.newCondition()`. When that happens kro hides its four built-in conditions and only the author's conditions appear in `.status.conditions[]`, so the author is responsible for composing a `Ready` from kro's `ResourcesReady` signal plus domain checks. If an expression errors, kro sets `state: Error` and keeps the previous conditions in place. URL: https://kro.run/docs/concepts/rgd/status-conditions/. The v0.10.0 documentation names the four built-in instance conditions as `InstanceManaged`, `GraphResolved`, `ResourcesReady`, and the root `Ready`, which is true when the other three are true (correction note: the names were previously inferred). Custom conditions can return a list, so one entry can yield a condition per collection item, but custom conditions cannot reference each other, and `runtime.condition(resource, 'X')` reads a child's conditions. kro stamps `lastTransitionTime` and `observedGeneration` on author conditions, and `status.state` stays kro-driven. An expression that fails sets the state to Error, while an expression whose data is not yet available is skipped for that reconcile without an Error. See [findings/kro-reserves-the-right-to-change-instance-sub-conditions-so-only-ready-is-a-stable-contract](../findings/kro-reserves-the-right-to-change-instance-sub-conditions-so-only-ready-is-a-stable-contract.md). [sources/research-gap-g3-kro](../sources/research-gap-g3-kro.md)

## Lesson

kro moves the choice of what "ready" means from the tool to the platform author, which gives precision at the cost of a new way to get it wrong: a `readyWhen` that is too lax reproduces the premature-readiness problem, and a custom condition set that omits a summary `Ready` leaves generic tools with nothing to read. See [comparisons/provider-fixed-versus-author-defined-condition-semantics-crossplane-versus-kro](../comparisons/provider-fixed-versus-author-defined-condition-semantics-crossplane-versus-kro.md), [findings/premature-readiness-in-kstatus-based-tools](../findings/premature-readiness-in-kstatus-based-tools.md), [entities/kro](../entities/kro.md), and [concepts/composite-resource](../concepts/composite-resource.md).

## Build-time validation (2026-11-26)

The v0.10.0 source validates the declared conditions when the graph is built: the status passed to `runtime.newCondition` must be True, False, or Unknown, the type must be non-empty, declared types must be unique, and `runtime.condition(schema, ...)` must name a built-in type. A malformed definition is therefore rejected with the RGD and never reaches an instance, see [findings/kro-validates-author-defined-conditions-at-build-time-so-a-bad-status-or-a-duplicate-type-is-rejected-before-an-instance-exists](../findings/kro-validates-author-defined-conditions-at-build-time-so-a-bad-status-or-a-duplicate-type-is-rejected-before-an-instance-exists.md). [sources/research-gap-b1-recheck-kro-crossplane](../sources/research-gap-b1-recheck-kro-crossplane.md)

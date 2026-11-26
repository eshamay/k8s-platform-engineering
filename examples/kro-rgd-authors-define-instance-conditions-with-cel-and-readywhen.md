---
title: kro RGD authors define instance conditions with CEL and readyWhen
type: example
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-conditions
    hash: 97b224c63502
    ingested: 2026-11-25
aliases: []
tags: [kro, conditions, cel, readywhen, platform-api]
---

# kro RGD authors define instance conditions with CEL and readyWhen

## Scenario

A platform team publishes an API through a kro ResourceGraphDefinition that stamps out a database, a secret, and a service for each instance. The team wants the instance `Ready` condition to mean more than "all children exist": for example, the database must accept connections and the service must have an endpoint. [[sources/research-conditions]]

## How it works

Each resource in the graph can carry a `readyWhen` list of CEL expressions. If it is omitted, kro treats a resource as ready as soon as it exists, which is a weak default for slow cloud resources. The RGD itself publishes conditions such as `Ready`, `GraphAccepted`, `KindReady`, and `ControllerReady`, and each carries an `observedGeneration` that records the generation the condition was based on, so a condition at generation 9 on an object at generation 12 is known to be stale. URL: https://kro.run/api/crds/resourcegraphdefinition/.

An author can go further and declare custom instance conditions with `runtime.newCondition()`. When that happens kro hides its four built-in conditions and only the author's conditions appear in `.status.conditions[]`, so the author is responsible for composing a `Ready` from kro's `ResourcesReady` signal plus domain checks. If an expression errors, kro sets `state: Error` and keeps the previous conditions in place. URL: https://kro.run/docs/concepts/rgd/status-conditions/. The dossier could not read the kro Instances page, so the built-in instance condition names are inferred.

## Lesson

kro moves the choice of what "ready" means from the tool to the platform author, which gives precision at the cost of a new way to get it wrong: a `readyWhen` that is too lax reproduces the premature-readiness problem, and a custom condition set that omits a summary `Ready` leaves generic tools with nothing to read. See [[comparisons/provider-fixed-versus-author-defined-condition-semantics-crossplane-versus-kro]], [[findings/premature-readiness-in-kstatus-based-tools]], [[entities/kro]], and [[concepts/composite-resource]].

---
title: A composition function pipeline turns observed state into desired state
type: example
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-composite-resource
    hash: 8640896d06b9
    ingested: 2026-11-25
aliases: []
tags: [crossplane, composition-functions, grpc, pipeline]
---

# A composition function pipeline turns observed state into desired state

## Scenario

A platform team needs to decide what a composite resource should own. Crossplane answers by running an ordered list of functions on every reconcile, and the design document explains why it chose that over a growing templating language. [[sources/research-composite-resource]]

## How it works

A Composition declares `mode: Pipeline` with an ordered array of steps. Each step names a Function, which is installed as a package and runs as a pod. On each reconcile Crossplane calls the steps in order over gRPC with a `RunFunctionRequest` that contains the XR's current state and the observed state of the resources it owns. The function returns the desired state, and the output of one step feeds the next. Authors can use function-patch-and-transform, Go templating, CUE, KCL, Python, or custom functions in Go or Python. Functions can also request credentials and extra "required resources." Functions do not run on deletion, so Crossplane deletes composed resources itself. URLs: https://docs.crossplane.io/latest/composition/compositions/ and https://github.com/crossplane/crossplane/blob/main/design/design-doc-composition-functions.md.

The motive in the design document is to "Avoid organically growing a new configuration Domain Specific Language (DSL)," because patch-and-transform was starting to gain features that made it one.

## Why the example matters

It is the level-based loop applied to a bundle, with observed state in and desired state out on every pass. The design buys any authoring language at the cost of more moving parts, see [[findings/composition-functions-add-moving-parts-that-must-be-healthy]]. For the comparison with kro's single expression language see [[comparisons/crossplane-composition-functions-versus-kro-resource-graph-execution-models]], and for the older replacement example see [[examples/crossplane-composition-replaces-a-hand-written-controller-for-composed-apis]].

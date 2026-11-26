---
title: kro validates author-defined conditions at build time so a bad status or a duplicate type is rejected before an instance exists
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-b1-recheck-kro-crossplane
    hash: ccee0efa5bdd
    ingested: 2026-11-26
aliases: []
tags: [kro, conditions, validation, status]
---

# kro validates author-defined conditions at build time so a bad status or a duplicate type is rejected before an instance exists

## Observation

At v0.10.0 the graph builder in `pkg/graph/conditions.go` checks the conditions an RGD author declares before any instance is created. A `runtime.newCondition` call must use the status True, False, or Unknown (the error text reads "status must be one of True, False, Unknown"). The condition type must be non-empty, declared types must not repeat, and a `runtime.condition(schema, ...)` call must name one of the built-in condition types. [[sources/research-gap-b1-recheck-kro-crossplane]] URL: https://github.com/kubernetes-sigs/kro/blob/v0.10.0/pkg/graph/conditions.go

The built-in instance conditions come from Go constants: `Ready`, `InstanceManaged`, `GraphResolved`, and `ResourcesReady`, with `Ready` built as the root over the other three by `apis.NewReadyConditions(InstanceManaged, GraphResolved, ResourcesReady)`. The ResourceGraphDefinition itself carries `Ready` with `GraphRevisionsResolved`, `GraphAccepted`, `KindReady`, and `ControllerReady`.

## Why it matters

A mistake in a condition definition surfaces when the RGD is accepted, as a rejected graph, and not as a wrong value on a running instance. That is an advantage over a Crossplane function, where nothing validates the conditions a function returns until they are written. It does not make the sub-condition names stable, see [[findings/kro-reserves-the-right-to-change-instance-sub-conditions-so-only-ready-is-a-stable-contract]].

## Mitigations

Treat a rejected RGD as the signal for a malformed condition, and compose a `Ready` condition whenever custom conditions replace the built-ins. See [[examples/kro-rgd-authors-define-instance-conditions-with-cel-and-readywhen]], [[comparisons/provider-fixed-versus-author-defined-condition-semantics-crossplane-versus-kro]], and [[entities/kro]].

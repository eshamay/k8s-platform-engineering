---
title: Provider-fixed versus author-defined condition semantics, Crossplane versus kro
type: comparison
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-conditions
    hash: 97b224c63502
    ingested: 2026-11-25
aliases: []
tags: [conditions, crossplane, kro, platform-api, comparison]
---

# Provider-fixed versus author-defined condition semantics, Crossplane versus kro

## What is compared

Crossplane fixes what `Synced` and `Ready` mean in the provider and runtime code, while kro lets the ResourceGraphDefinition author decide what the instance conditions are. [[sources/research-conditions]] states the contrast as "a different design from Crossplane, where the provider fixes the condition semantics."

## Crossplane

The meanings are set by the framework. `Synced` says the provider could reconcile desired state against the external system, with reasons `ReconcileSuccess`, `ReconcileError`, and `ReconcilePaused`. `Ready` says the external resource is usable, with reasons `Available`, `Creating`, `Unavailable`, and `Deleting`. A platform author composing resources does not choose these meanings, and a composite is `Ready` when the function pipeline reports every composed resource ready. The benefit is uniform behavior for tools, and the cost is that a framework bug, such as the one in provider-aws issue 2287, affects every user. The page read was Crossplane v1.20.

## kro

Each resource can set `readyWhen` CEL expressions, with a default of "exists", and the RGD author can declare custom conditions with `runtime.newCondition()`. Doing so hides kro's four built-in conditions, so the author owns the whole surface and must compose any `Ready` from kro's `ResourcesReady` plus domain signals. Expression errors set `state: Error` and keep the previous conditions. The benefit is domain-specific readiness, and the cost is that every platform can differ and a lax `readyWhen` repeats the premature-readiness problem. The instance-level built-in names were not read.

## Trade-off

Fixed semantics make generic tools work and make bugs systemic. Author-defined semantics fit the domain and put the burden of correctness on each platform team. See [[comparisons/hand-written-operator-versus-crossplane-composition-versus-kro]], [[examples/kro-rgd-authors-define-instance-conditions-with-cel-and-readywhen]], [[entities/crossplane]], and [[entities/kro]].

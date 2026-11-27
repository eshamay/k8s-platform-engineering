---
title: "No documentation was found of a standalone kro controller feeding a Crossplane composite, and function-kro's readiness link is unlocated"
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-o8-crossplane-residuals
    hash: 35c6f2fb6101
    ingested: 2026-11-26
aliases: []
tags: [kro, crossplane, function-kro, status, negative-finding]
---

# No documentation was found of a standalone kro controller feeding a Crossplane composite, and function-kro's readiness link is unlocated

## Observation

The route by which kro-style graphs feed a Crossplane composite that the dossier could document is `function-kro`, see [findings/function-kro-approximates-kro-built-in-conditions-from-one-run-and-writes-only-declared-status-paths-to-the-desired-xr](function-kro-approximates-kro-built-in-conditions-from-one-run-and-writes-only-declared-status-paths-to-the-desired-xr.md). Two links stayed UNVERIFIED. First, a grep for `READY_TRUE` in `fn.go` found nothing and the `engine.go` path returned 404, so where function-kro marks each desired composed resource ready was not located. Second, searches of GitHub repositories for "kro crossplane" and of the docs found no documentation of a standalone kro controller instance whose instance status feeds a Crossplane composite. Only a third-party lab repository (suzuki0430/kro-crossplane-eks-idp-lab) appeared, and it was not read. [sources/research-gap-o8-crossplane-residuals](../sources/research-gap-o8-crossplane-residuals.md)

## Why it matters

The gap on kro status and Crossplane status propagation is settled for function-kro's condition handling and for Crossplane's ready derivation, and it is not settled for a controller-to-composite path. Nothing here supports a claim that the two can be chained that way, or that they cannot.

## Related

[entities/kro](../entities/kro.md), [entities/function-kro](../entities/function-kro.md), [comparisons/provider-fixed-versus-author-defined-condition-semantics-crossplane-versus-kro](../comparisons/provider-fixed-versus-author-defined-condition-semantics-crossplane-versus-kro.md), [decisions/choose-kro-crossplane-or-both-for-a-platform-abstraction-layer](../decisions/choose-kro-crossplane-or-both-for-a-platform-abstraction-layer.md)

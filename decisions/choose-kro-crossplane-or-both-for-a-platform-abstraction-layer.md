---
title: Choose kro, Crossplane, or both for a platform abstraction layer
type: decision
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-composite-resource
    hash: 8640896d06b9
    ingested: 2026-11-25
aliases: []
tags: [decision, kro, crossplane, function-kro, platform-engineering]
---

# Choose kro, Crossplane, or both for a platform abstraction layer

## Status

Open question framed by the sources, not an ADR authored by this wiki. The sources offer a rule of thumb and evidence of convergence but no outcome data. [[sources/research-composite-resource]]

## Context

A platform team wants to publish a small API such as a `WebApplication` or `NetworkingStack` over many resources. Helm cannot reconcile, a hand-written operator is costly, and the remaining choices are kro and Crossplane. The comparison blog says to use kro when the building blocks are already Kubernetes resources and Crossplane when the platform must drive cloud APIs directly. kro is `v1alpha1` and Google said at launch it was not ready for production, while Crossplane is a CNCF graduated project.

## Options

Use kro alone, over resources such as ACK, ASO, or Config Connector objects. Use Crossplane alone, with providers and functions. Use both, either as separate layers or through `function-kro`, which runs kro-style YAML and CEL inside a Crossplane pipeline and adds CompositionRevisions, extra pipeline steps, several Compositions behind one API, and `crossplane render`.

## Consequences

kro offers early validation and inferred ordering but its API may break and its rollout model has no fallback. Crossplane offers revisioning and provider-level drift correction at the cost of more moving parts and a v1 to v2 migration. Combining them gets both sets of properties and adds a dependency on a young function. The sources give no scale numbers, so capacity must be tested. See [[comparisons/crossplane-composition-functions-versus-kro-resource-graph-execution-models]], [[comparisons/helm-versus-kro-versus-crossplane-as-platform-abstraction-layers]], [[decisions/build-a-custom-operator-or-compose-existing-resources]], and [[findings/immature-abstractions-in-the-control-plane-ecosystem]].

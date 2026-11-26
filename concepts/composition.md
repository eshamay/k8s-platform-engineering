---
title: Composition
type: concept
status: active
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: krm-platform-vocabulary
    hash: 731a6941f9db
    ingested: 2026-11-25
  - id: research-composite-resource
    hash: 8640896d06b9
    ingested: 2026-11-25
aliases: [Crossplane Composition, composition function pipeline]
tags: [abstraction, crossplane]
---

# Composition

## Definition

The blueprint or template that defines how a high-level [[concepts/composite-resource]] maps down into specific low-level [[concepts/managed-resource|managed resources]], including how values are patched or transformed between them. [[sources/krm-platform-vocabulary]]

## Why it matters

Compositions hold the platform team's opinions. How they are expressed (patches, functions, resource graphs) is a central design difference between [[entities/crossplane]] and [[entities/kro]], now compared in [[comparisons/crossplane-composition-functions-versus-kro-resource-graph-execution-models]].

## Crossplane Compositions as function pipelines

In current Crossplane, "A Composition is a pipeline of composition functions." A Function is installed as a package and runs as a pod. On each reconcile Crossplane calls the steps in order over gRPC, giving each the XR's current state and the state of the resources it owns, and the function returns what should exist. Authors can use function-patch-and-transform, Go templating, CUE, KCL, Python, or custom functions in Go or Python. A Composition is matched to an XR by `compositeTypeRef`, which names the XRD's group and kind. Functions do not run on deletion, so Crossplane deletes composed resources itself. [[sources/research-composite-resource]] See [[examples/a-composition-function-pipeline-turns-observed-state-into-desired-state]].

The pipeline replaced native patch-and-transform because maintainers wanted to avoid organically growing a new configuration DSL. Native patch-and-transform (`mode: Resources`) is removed in v2, and `crossplane beta convert pipeline-composition` converts existing ones. Every change to a Composition is tracked as a CompositionRevision, which composites can follow or pin. See [[findings/crossplane-v2-removed-features-and-offers-no-automated-migration-for-v1-composites]], [[findings/editing-a-live-composition-can-disrupt-or-replace-existing-composed-resources]], and [[decisions/choose-automatic-or-manual-composition-update-policy]].

## The resource graph alternative

kro expresses the same blueprint as the `spec.resources` section of a ResourceGraphDefinition, written as templates with CEL expressions. kro infers dependency order from the references between them and validates the whole definition at creation time, and `function-kro` lets the same block run inside a Crossplane pipeline. [[sources/research-composite-resource]] See [[entities/function-kro]] and [[examples/function-kro-runs-a-kro-resource-graph-as-a-crossplane-pipeline-step]].

## Testing

The dossier recommends `crossplane render` for local runs, unit tests for functions, and a Kuttl loop with kind and Skaffold, where each Kuttl run takes 2 to 5 minutes. Because functions are external programs, errors can surface at reconcile time, see [[findings/composition-functions-add-moving-parts-that-must-be-healthy]].

## Related

[[concepts/provider]], [[concepts/idempotency]], [[concepts/eventual-consistency-and-convergence]], [[comparisons/hand-written-operator-versus-crossplane-composition-versus-kro]]

## To research

Performance of function pipelines at scale and the status of the alpha kro `Graph` API. Both are tracked in [[open-knowledge-gaps]].

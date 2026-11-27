---
title: Crossplane composition functions versus kro resource graph execution models
type: comparison
status: draft
created: 2026-11-25
updated: 2026-11-26
sources:
  - id: research-gap-b1-recheck-kro-crossplane
    hash: ccee0efa5bdd
    ingested: 2026-11-26
  - id: research-composite-resource
    hash: 8640896d06b9
    ingested: 2026-11-25
  - id: research-gap-o5-kro-ecosystem
    hash: 7905031da128
    ingested: 2026-11-26
aliases: []
tags: [crossplane, kro, composition, resource-graph, execution-model]
---

# Crossplane composition functions versus kro resource graph execution models

## Summary

Both tools turn one small object into many resources, but they split the work differently. Crossplane separates the schema (XRD) from the implementation (Composition) and runs the implementation as a pipeline of external functions. kro puts schema and implementation in one ResourceGraphDefinition and evaluates CEL expressions inside its own controller. [sources/research-composite-resource](../sources/research-composite-resource.md)

## Side by side

| Aspect | Crossplane Composition | kro ResourceGraphDefinition |
|---|---|---|
| Objects | XRD for the schema, Composition for the mapping | One RGD with `spec.schema` and `spec.resources` |
| Logic | Ordered pipeline of gRPC functions, in any language | CEL expressions, a restricted and non-Turing-complete language |
| Input to logic | Observed state of the XR and its owned resources | Spec of the instance and status of other resources |
| Ordering | Left to functions and eventual reconciliation | Inferred from CEL references into a DAG, created in topological order, deleted in reverse |
| Readiness | Pipeline steps such as `function-auto-ready`; the XR is Ready when composed resources are | `readyWhen` per resource, gating dependents in an RGD |
| Error timing | Often at reconcile time, so test with `crossplane render` | Static analysis at RGD creation: schema, kinds, types, cycles |
| Revisions | CompositionRevisions, pinnable per XR | Immutable GraphRevisions with no fallback on a failed compile |
| Maturity | CNCF graduated, v2 in use | `v1alpha1`, version 0.10.0 in the docs read |
| Natural fit | Owning cloud APIs through providers | Composing resources already on the cluster |

## Reading the table

The execution-model difference is flexibility against checkability. Functions allow any logic at the price of more moving parts, see [findings/composition-functions-add-moving-parts-that-must-be-healthy](../findings/composition-functions-add-moving-parts-that-must-be-healthy.md). kro gives up general code for early validation and inferred ordering. The two now overlap, because `function-kro` embeds kro's graph builder inside a Crossplane pipeline step, see [entities/function-kro](../entities/function-kro.md) and [examples/function-kro-runs-a-kro-resource-graph-as-a-crossplane-pipeline-step](../examples/function-kro-runs-a-kro-resource-graph-as-a-crossplane-pipeline-step.md). For the choice itself see [decisions/choose-kro-crossplane-or-both-for-a-platform-abstraction-layer](../decisions/choose-kro-crossplane-or-both-for-a-platform-abstraction-layer.md).

## Limits

The dossier gives no performance or scale numbers for either side and no incident reports. It did not read Crossplane's drift behavior for composites or kro's tuning pages, so drift and throughput comparisons live elsewhere, see [comparisons/drift-detection-mechanisms-across-tools](drift-detection-mechanisms-across-tools.md) and [comparisons/ordering-models-flux-argo-cd-kro-crossplane](ordering-models-flux-argo-cd-kro-crossplane.md).

## Related

[comparisons/crossplane-xrds-versus-kro-resourcegraphdefinitions-as-crd-generators](crossplane-xrds-versus-kro-resourcegraphdefinitions-as-crd-generators.md), [comparisons/hand-written-operator-versus-crossplane-composition-versus-kro](hand-written-operator-versus-crossplane-composition-versus-kro.md), [concepts/composition](../concepts/composition.md), [entities/crossplane](../entities/crossplane.md), [entities/kro](../entities/kro.md)

## Where the readiness signal comes from (2026-11-26)

Correction note: the readiness row says the XR is Ready when composed resources are. In v2.5.0 source, a composed resource counts as ready only when a function sets `READY_TRUE`, and an unspecified value counts as not ready, so the XR `Ready` is a function-authored summary that shows `Creating` with an "Unready resources" message until then, see [findings/a-crossplane-composed-resource-counts-as-ready-only-when-the-function-sets-ready-true-so-unspecified-readiness-leaves-the-xr-creating](../findings/a-crossplane-composed-resource-counts-as-ready-only-when-the-function-sets-ready-true-so-unspecified-readiness-leaves-the-xr-creating.md). In kro the controller itself computes the instance `Ready` as the root of `InstanceManaged`, `GraphResolved`, and `ResourcesReady`. [sources/research-gap-b1-recheck-kro-crossplane](../sources/research-gap-b1-recheck-kro-crossplane.md)

## Update from the o5 dossier

Update 2026-11-26: the overlap through `function-kro` has documented limits. The repository lists differences from standalone kro, see [findings/function-kro-lists-documented-behavioral-differences-from-upstream-kro-so-its-full-parity-claim-reads-as-same-engine-with-gaps](../findings/function-kro-lists-documented-behavioral-differences-from-upstream-kro-so-its-full-parity-claim-reads-as-same-engine-with-gaps.md), and v0.4.0 now runs kro v0.10.0's graph engine. [sources/research-gap-o5-kro-ecosystem](../sources/research-gap-o5-kro-ecosystem.md)

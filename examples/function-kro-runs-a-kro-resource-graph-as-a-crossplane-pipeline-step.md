---
title: function-kro runs a kro resource graph as a Crossplane pipeline step
type: example
status: active
created: 2026-11-25
updated: 2026-11-26
sources:
  - id: research-composite-resource
    hash: 8640896d06b9
    ingested: 2026-11-25
  - id: research-gap-o5-kro-ecosystem
    hash: 7905031da128
    ingested: 2026-11-26
  - id: research-gap-o8-crossplane-residuals
    hash: 35c6f2fb6101
    ingested: 2026-11-26
aliases: []
tags: [crossplane, kro, function-kro, networking, convergence]
---

# function-kro runs a kro resource graph as a Crossplane pipeline step

## Scenario

A platform team wants the lightweight YAML and CEL authoring of kro but also wants Crossplane's revisioning and its ability to own cloud APIs. The Crossplane blog post announcing `function-kro` (2026-03-19) shows the combined shape with a `NetworkingStack` API. [sources/research-composite-resource](../sources/research-composite-resource.md)

## How it works

The composite API is a `NetworkingStack` whose Composition has a pipeline. One step calls `function-kro` with a kro-style `resources` block that declares a VPC, a Subnet, and a SecurityGroup, wired together with CEL expressions so that the subnet reads the VPC's identifier. A following step calls `function-auto-ready` to mark readiness. The function embeds kro's graph builder, CEL evaluator, and runtime, so the block is the same one that would appear in a standalone RGD. The post says dependent resources are not created until the referenced output exists. URL: https://blog.crossplane.io/function-kro-yaml-cel/.

The post lists what Crossplane adds around the graph: the schema is separated from the implementation, CompositionRevisions let teams pin and roll back, extra pipeline steps can enforce policy or add cost-allocation tags, several Compositions can sit behind one API for AWS, GCP, and Azure ("One schema, many implementations."), pause annotations work, and `crossplane render` allows local testing. The command `crossplane xrd generate --from simpleschema` builds an XRD from a kro-style schema.

## Why the example matters

It is the clearest evidence in the dossier that the two models are converging, with kro-style graphs becoming one way of authoring a Crossplane function. The claim of full feature parity is the project's own. See [entities/function-kro](../entities/function-kro.md), [comparisons/crossplane-composition-functions-versus-kro-resource-graph-execution-models](../comparisons/crossplane-composition-functions-versus-kro-resource-graph-execution-models.md), and [decisions/choose-kro-crossplane-or-both-for-a-platform-abstraction-layer](../decisions/choose-kro-crossplane-or-both-for-a-platform-abstraction-layer.md).

## Update from the o5 dossier

Update 2026-11-26: the full-parity claim above is the project's own. The repository lists behavioral differences, see [findings/function-kro-lists-documented-behavioral-differences-from-upstream-kro-so-its-full-parity-claim-reads-as-same-engine-with-gaps](../findings/function-kro-lists-documented-behavioral-differences-from-upstream-kro-so-its-full-parity-claim-reads-as-same-engine-with-gaps.md), and v0.4.0 moved the function onto kro v0.10.0's graph engine, see [examples/function-kro-v0-4-0-moved-onto-the-kro-v0-10-0-graph-engine-on-2026-11-26-with-one-listed-maintainer](function-kro-v0-4-0-moved-onto-the-kro-v0-10-0-graph-engine-on-2026-11-26-with-one-listed-maintainer.md). [sources/research-gap-o5-kro-ecosystem](../sources/research-gap-o5-kro-ecosystem.md)

## Update from the o8 dossier

Update 2026-11-26: reading `fn.go` shows the function does not use kro's controller. It approximates kro's built-in conditions from a single run, writes only declared status paths to the desired XR, and omits `InstanceManaged`, see [findings/function-kro-approximates-kro-built-in-conditions-from-one-run-and-writes-only-declared-status-paths-to-the-desired-xr](../findings/function-kro-approximates-kro-built-in-conditions-from-one-run-and-writes-only-declared-status-paths-to-the-desired-xr.md). Where it marks per-resource readiness was not located, see [findings/no-documentation-was-found-of-a-standalone-kro-controller-feeding-a-crossplane-composite-and-function-kro-s-readiness-link-is-unlocated](../findings/no-documentation-was-found-of-a-standalone-kro-controller-feeding-a-crossplane-composite-and-function-kro-s-readiness-link-is-unlocated.md). [sources/research-gap-o8-crossplane-residuals](../sources/research-gap-o8-crossplane-residuals.md)

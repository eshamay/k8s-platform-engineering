---
title: function-kro runs a kro resource graph as a Crossplane pipeline step
type: example
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-composite-resource
    hash: 8640896d06b9
    ingested: 2026-11-25
aliases: []
tags: [crossplane, kro, function-kro, networking, convergence]
---

# function-kro runs a kro resource graph as a Crossplane pipeline step

## Scenario

A platform team wants the lightweight YAML and CEL authoring of kro but also wants Crossplane's revisioning and its ability to own cloud APIs. The Crossplane blog post announcing `function-kro` (2026-03-19) shows the combined shape with a `NetworkingStack` API. [[sources/research-composite-resource]]

## How it works

The composite API is a `NetworkingStack` whose Composition has a pipeline. One step calls `function-kro` with a kro-style `resources` block that declares a VPC, a Subnet, and a SecurityGroup, wired together with CEL expressions so that the subnet reads the VPC's identifier. A following step calls `function-auto-ready` to mark readiness. The function embeds kro's graph builder, CEL evaluator, and runtime, so the block is the same one that would appear in a standalone RGD. The post says dependent resources are not created until the referenced output exists. URL: https://blog.crossplane.io/function-kro-yaml-cel/.

The post lists what Crossplane adds around the graph: the schema is separated from the implementation, CompositionRevisions let teams pin and roll back, extra pipeline steps can enforce policy or add cost-allocation tags, several Compositions can sit behind one API for AWS, GCP, and Azure ("One schema, many implementations."), pause annotations work, and `crossplane render` allows local testing. The command `crossplane xrd generate --from simpleschema` builds an XRD from a kro-style schema.

## Why the example matters

It is the clearest evidence in the dossier that the two models are converging, with kro-style graphs becoming one way of authoring a Crossplane function. The claim of full feature parity is the project's own. See [[entities/function-kro]], [[comparisons/crossplane-composition-functions-versus-kro-resource-graph-execution-models]], and [[decisions/choose-kro-crossplane-or-both-for-a-platform-abstraction-layer]].

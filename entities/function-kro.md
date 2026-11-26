---
title: function-kro
type: entity
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-composite-resource
    hash: 8640896d06b9
    ingested: 2026-11-25
aliases: [function-kro Crossplane function]
tags: [tool, crossplane, kro, composition-function]
---

# function-kro

## What it is

`function-kro` is a Crossplane composition function announced by Jared Watts of Upbound on 2026-03-19. It embeds kro's graph builder, CEL evaluator, and runtime so that a kro-style `resources` block can be dropped into a Crossplane pipeline step unchanged. [[sources/research-composite-resource]] URL: https://blog.crossplane.io/function-kro-yaml-cel/.

## What it adds and what it implies

Running the graph inside Crossplane keeps the schema separate from the implementation and brings CompositionRevisions for pinning and rollback, extra pipeline steps for policy or tagging, multiple Compositions behind one API, pause annotations, and `crossplane render` for local tests. The command `crossplane xrd generate --from simpleschema` produces an XRD from a kro-style schema. The post says "One schema, many implementations." Its claim of full feature parity is the project's own and is not independently verified. The function is a sign that the Crossplane and kro models are converging. See [[examples/function-kro-runs-a-kro-resource-graph-as-a-crossplane-pipeline-step]], [[comparisons/crossplane-composition-functions-versus-kro-resource-graph-execution-models]], [[entities/crossplane]], and [[entities/kro]].

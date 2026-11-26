---
title: Composition functions add moving parts that must be healthy
type: finding
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-composite-resource
    hash: 8640896d06b9
    ingested: 2026-11-25
  - id: research-composition
    hash: f57d89652816
    ingested: 2026-11-25
aliases: []
tags: [pitfall, crossplane, functions, operations, kro]
---

# Composition functions add moving parts that must be healthy

## Observation

Crossplane chose gRPC functions so that composition authors can use any language and the project avoids growing its own DSL. The cost, in the dossier's words, is more moving parts: functions are packages that run as pods and must be healthy for a composite to reconcile. Because functions are external programs, errors can also appear at reconcile time and not at definition time. kro takes the opposite trade-off with one restricted expression language, CEL, and no custom code, and it validates types, field existence, and cycles when the RGD is created. [[sources/research-composite-resource]] URLs: https://github.com/crossplane/crossplane/blob/main/design/design-doc-composition-functions.md and https://docs.aws.amazon.com/eks/latest/userguide/kro-concepts.html.

## Why it matters

A team that adopts many function languages carries an operational dependency for each, and a late failure surfaces only once an instance is reconciled. The dossier does not give measurements of function failure rates.

## Mitigations

The Crossplane docs and blog recommend `crossplane render`, unit tests, and a Kuttl-based test loop, and `function-kro` offers kro-style CEL checking inside a pipeline. See [[comparisons/crossplane-composition-functions-versus-kro-resource-graph-execution-models]], [[examples/a-composition-function-pipeline-turns-observed-state-into-desired-state]], and [[entities/function-kro]].

## Further operational evidence

The Compositions dossier adds that OpenShift's crun runtime initially could not run functions, which is a runtime-compatibility dependency, and that function load and memory become new capacity concerns, see [[findings/function-calls-scale-with-composite-count-and-large-composites-can-exhaust-function-memory]] and [[findings/a-composition-function-that-omits-a-resource-from-its-desired-state-deletes-it]]. [[sources/research-composition]]

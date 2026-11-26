---
title: Where the expressiveness bound sits in Crossplane functions and kro CEL
type: comparison
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-composition
    hash: f57d89652816
    ingested: 2026-11-25
aliases: []
tags: [crossplane, kro, composition, cel, comparison]
---

# Where the expressiveness bound sits in Crossplane functions and kro CEL

> [!NOTE]
> **Status:** This is the wiki authors' synthesis. The dossier states that no source compared Crossplane Compositions and kro head to head.

## The shared problem

Both tools fight declarative DSL creep. The Crossplane design doc argues that adding conditionals and iteration to a REST-shaped configuration API leads to an incoherent DSL. Both tools accept some bound on expressiveness but place it in different spots. [[sources/research-composition]]

## Crossplane: bound the contract, free the code

Crossplane moved logic out of the Composition into functions written in a real language or an existing DSL (Go, Python, CUE, KCL, Go templates). The bound is the gRPC contract: a function receives observed and desired state, returns a new desired state, and never calls the API server. The cost is operational: each function is a process with its own memory, availability, and runtime needs, see [[findings/composition-functions-add-moving-parts-that-must-be-healthy]] and [[findings/function-calls-scale-with-composite-count-and-large-composites-can-exhaust-function-memory]].

## kro: bound the language, free the runtime

kro uses CEL, which terminates, has no side effects, and is type-checked at apply time. Ordering is inferred from references, and `includeWhen` and `forEach` cover conditionals and collections, so there are no external function servers. The cost is that logic beyond CEL cannot be expressed, and the API is `v1alpha1` and has already renamed its core kind. See [[entities/kro]].

## Side by side

| Aspect | Crossplane functions | kro ResourceGraphDefinition |
|---|---|---|
| Logic language | Any language that serves gRPC | CEL in `${...}` |
| Termination guarantee | None beyond timeouts | CEL terminates by design |
| Ordering | Function logic and function-auto-ready | Inferred DAG from references |
| Validation | At reconcile time | Type-checked at apply time |
| Moving parts | One pod per function | Dynamic controller per generated CRD |

Sources: https://github.com/crossplane/crossplane/blob/main/design/design-doc-composition-functions.md and https://kro.run/docs/overview.

## Convergence

`function-kro` runs a kro graph as a Crossplane pipeline step, so the two bounds can be combined, see [[entities/function-kro]]. For the full execution-model comparison see [[comparisons/crossplane-composition-functions-versus-kro-resource-graph-execution-models]].

## Related

[[concepts/composition]], [[findings/patch-and-transform-cannot-branch-loop-or-patch-between-composed-resources]], [[decisions/choose-kro-crossplane-or-both-for-a-platform-abstraction-layer]]

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
  - id: research-composition
    hash: f57d89652816
    ingested: 2026-11-25
  - id: research-crossplane-deep-dive
    hash: 44034359219f
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

## Authoring models and pitfalls in the Compositions dossier

Crossplane has used three authoring models. Patch and transform is a static list of base resources plus patches and is deliberately not Turing complete. Composition functions (alpha in v1.11, beta in v1.14) use `mode: Pipeline`, where each step calls a gRPC function that receives observed and desired state and returns a new desired state, and Crossplane rather than the function talks to the API server. Patch and transform survives as `function-patch-and-transform`, the legacy `mode: Resources` was deprecated in v1.17, and Crossplane 2.0 lets a Composition include any Kubernetes resource. [[sources/research-composition]]

Composition is one answer to the cost of writing a bespoke controller per platform API. The recurring pitfalls are that a function omitting a resource deletes it ([[findings/a-composition-function-that-omits-a-resource-from-its-desired-state-deletes-it]]), that patch and transform cannot branch or loop ([[findings/patch-and-transform-cannot-branch-loop-or-patch-between-composed-resources]]), that function load scales with composite count ([[findings/function-calls-scale-with-composite-count-and-large-composites-can-exhaust-function-memory]]), and that editing a live Composition affects pinned composites only through revisions ([[findings/editing-a-live-composition-can-disrupt-or-replace-existing-composed-resources]]). The two expressiveness bounds are compared in [[comparisons/where-the-expressiveness-bound-sits-in-crossplane-functions-and-kro-cel]].

Real-world uses are collected in [[examples/vshn-appcat-sells-self-service-databases-queues-and-object-storage-through-composition-functions]], [[examples/imagine-learning-replaces-thousand-line-patch-and-transform-files-with-a-looping-composition-function]], [[examples/a-scalable-composition-lets-hpa-and-keda-drive-an-xr-through-the-scale-subresource]], and [[examples/a-microservice-xr-creates-a-database-and-its-workload-from-one-namespaced-object]]. Flux `dependsOn` and Argo CD sync waves order whole manifest sets without defining a new API, so they sit beside composition rather than inside it, see [[comparisons/ordering-models-flux-argo-cd-kro-crossplane]].

## Function pipeline contract in the Crossplane deep dive

The Compositions documentation describes the pipeline contract. On each create or update of a composite resource, Crossplane calls each function in order with a request holding observed state, the desired state accumulated so far, per-function input, and shared context, and each function returns a response. "A function's main job is to update the desired state and return it to Crossplane." Functions must copy desired state forward because omitted resources are deleted, functions can signal readiness and request extra resources, and referencing functions by OCI digest pins versions per Composition revision for staged rollout. Oversized Compositions are a design pitfall, see [[findings/oversized-compositions-and-cloud-shaped-apis-make-platform-apis-hard-to-use]]. [[sources/research-crossplane-deep-dive]]

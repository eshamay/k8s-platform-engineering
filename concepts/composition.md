---
title: Composition
type: concept
status: active
created: 2026-11-25
updated: 2026-11-26
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
  - id: research-kro-and-abstraction-models
    hash: d43d3775cbbd
    ingested: 2026-11-25
  - id: research-gap-o7-krm-functions
    hash: 35b3cd859ba9
    ingested: 2026-11-26
aliases: [Crossplane Composition, composition function pipeline]
tags: [abstraction, crossplane]
---

# Composition

## Definition

The blueprint or template that defines how a high-level [concepts/composite-resource](composite-resource.md) maps down into specific low-level [managed resources](managed-resource.md), including how values are patched or transformed between them. [sources/krm-platform-vocabulary](../sources/krm-platform-vocabulary.md)

## Why it matters

Compositions hold the platform team's opinions. How they are expressed (patches, functions, resource graphs) is a central design difference between [entities/crossplane](../entities/crossplane.md) and [entities/kro](../entities/kro.md), now compared in [comparisons/crossplane-composition-functions-versus-kro-resource-graph-execution-models](../comparisons/crossplane-composition-functions-versus-kro-resource-graph-execution-models.md).

## Crossplane Compositions as function pipelines

In current Crossplane, "A Composition is a pipeline of composition functions." A Function is installed as a package and runs as a pod. On each reconcile Crossplane calls the steps in order over gRPC, giving each the XR's current state and the state of the resources it owns, and the function returns what should exist. Authors can use function-patch-and-transform, Go templating, CUE, KCL, Python, or custom functions in Go or Python. A Composition is matched to an XR by `compositeTypeRef`, which names the XRD's group and kind. Functions do not run on deletion, so Crossplane deletes composed resources itself. [sources/research-composite-resource](../sources/research-composite-resource.md) See [examples/a-composition-function-pipeline-turns-observed-state-into-desired-state](../examples/a-composition-function-pipeline-turns-observed-state-into-desired-state.md).

The pipeline replaced native patch-and-transform because maintainers wanted to avoid organically growing a new configuration DSL. Native patch-and-transform (`mode: Resources`) is removed in v2, and `crossplane beta convert pipeline-composition` converts existing ones. Every change to a Composition is tracked as a CompositionRevision, which composites can follow or pin. See [findings/crossplane-v2-removed-features-and-offers-no-automated-migration-for-v1-composites](../findings/crossplane-v2-removed-features-and-offers-no-automated-migration-for-v1-composites.md), [findings/editing-a-live-composition-can-disrupt-or-replace-existing-composed-resources](../findings/editing-a-live-composition-can-disrupt-or-replace-existing-composed-resources.md), and [decisions/choose-automatic-or-manual-composition-update-policy](../decisions/choose-automatic-or-manual-composition-update-policy.md).

## The resource graph alternative

kro expresses the same blueprint as the `spec.resources` section of a ResourceGraphDefinition, written as templates with CEL expressions. kro infers dependency order from the references between them and validates the whole definition at creation time, and `function-kro` lets the same block run inside a Crossplane pipeline. [sources/research-composite-resource](../sources/research-composite-resource.md) See [entities/function-kro](../entities/function-kro.md) and [examples/function-kro-runs-a-kro-resource-graph-as-a-crossplane-pipeline-step](../examples/function-kro-runs-a-kro-resource-graph-as-a-crossplane-pipeline-step.md).

## Testing

The dossier recommends `crossplane render` for local runs, unit tests for functions, and a Kuttl loop with kind and Skaffold, where each Kuttl run takes 2 to 5 minutes. Because functions are external programs, errors can surface at reconcile time, see [findings/composition-functions-add-moving-parts-that-must-be-healthy](../findings/composition-functions-add-moving-parts-that-must-be-healthy.md).

## Related

[concepts/provider](provider.md), [concepts/idempotency](idempotency.md), [concepts/eventual-consistency-and-convergence](eventual-consistency-and-convergence.md), [comparisons/hand-written-operator-versus-crossplane-composition-versus-kro](../comparisons/hand-written-operator-versus-crossplane-composition-versus-kro.md)

## To research

Performance of function pipelines at scale and the status of the alpha kro `Graph` API. Both are tracked in [open-knowledge-gaps](../open-knowledge-gaps.md).

## Authoring models and pitfalls in the Compositions dossier

Crossplane has used three authoring models. Patch and transform is a static list of base resources plus patches and is deliberately not Turing complete. Composition functions (alpha in v1.11 on 2023-01-31 with an `xfn` sidecar, beta in v1.14 on 2023-11-01 with package-manager Deployments, v1 in v1.17 on 2024-08-29) use `mode: Pipeline`, where each step calls a gRPC function that receives observed and desired state and returns a new desired state, and Crossplane rather than the function talks to the API server. Patch and transform survives as `function-patch-and-transform`, the legacy `mode: Resources` was deprecated in v1.17, Crossplane 2.0 (v2.0.0, 2025-08-14) removed `mode: Resources` and lets a Composition include any Kubernetes resource. See [findings/crossplane-moved-composition-functions-from-an-xfn-sidecar-in-v1-11-to-package-manager-deployments-in-v1-14](../findings/crossplane-moved-composition-functions-from-an-xfn-sidecar-in-v1-11-to-package-manager-deployments-in-v1-14.md). [sources/research-composition](../sources/research-composition.md)

Composition is one answer to the cost of writing a bespoke controller per platform API. The recurring pitfalls are that a function omitting a resource deletes it ([findings/a-composition-function-that-omits-a-resource-from-its-desired-state-deletes-it](../findings/a-composition-function-that-omits-a-resource-from-its-desired-state-deletes-it.md)), that patch and transform cannot branch or loop ([findings/patch-and-transform-cannot-branch-loop-or-patch-between-composed-resources](../findings/patch-and-transform-cannot-branch-loop-or-patch-between-composed-resources.md)), that function load scales with composite count ([findings/function-calls-scale-with-composite-count-and-large-composites-can-exhaust-function-memory](../findings/function-calls-scale-with-composite-count-and-large-composites-can-exhaust-function-memory.md)), and that editing a live Composition affects pinned composites only through revisions ([findings/editing-a-live-composition-can-disrupt-or-replace-existing-composed-resources](../findings/editing-a-live-composition-can-disrupt-or-replace-existing-composed-resources.md)). The two expressiveness bounds are compared in [comparisons/where-the-expressiveness-bound-sits-in-crossplane-functions-and-kro-cel](../comparisons/where-the-expressiveness-bound-sits-in-crossplane-functions-and-kro-cel.md).

Real-world uses are collected in [examples/vshn-appcat-sells-self-service-databases-queues-and-object-storage-through-composition-functions](../examples/vshn-appcat-sells-self-service-databases-queues-and-object-storage-through-composition-functions.md), [examples/imagine-learning-replaces-thousand-line-patch-and-transform-files-with-a-looping-composition-function](../examples/imagine-learning-replaces-thousand-line-patch-and-transform-files-with-a-looping-composition-function.md), [examples/a-scalable-composition-lets-hpa-and-keda-drive-an-xr-through-the-scale-subresource](../examples/a-scalable-composition-lets-hpa-and-keda-drive-an-xr-through-the-scale-subresource.md), and [examples/a-microservice-xr-creates-a-database-and-its-workload-from-one-namespaced-object](../examples/a-microservice-xr-creates-a-database-and-its-workload-from-one-namespaced-object.md). Flux `dependsOn` and Argo CD sync waves order whole manifest sets without defining a new API, so they sit beside composition rather than inside it, see [comparisons/ordering-models-flux-argo-cd-kro-crossplane](../comparisons/ordering-models-flux-argo-cd-kro-crossplane.md).

## Function pipeline contract in the Crossplane deep dive

The Compositions documentation describes the pipeline contract. On each create or update of a composite resource, Crossplane calls each function in order with a request holding observed state, the desired state accumulated so far, per-function input, and shared context, and each function returns a response. "A function's main job is to update the desired state and return it to Crossplane." Functions must copy desired state forward because omitted resources are deleted, functions can signal readiness and request extra resources, and referencing functions by OCI digest pins versions per Composition revision for staged rollout. Oversized Compositions are a design pitfall, see [findings/oversized-compositions-and-cloud-shaped-apis-make-platform-apis-hard-to-use](../findings/oversized-compositions-and-cloud-shaped-apis-make-platform-apis-hard-to-use.md). [sources/research-crossplane-deep-dive](../sources/research-crossplane-deep-dive.md)

## Ordering and deletion guards in Go-template Compositions

The abstraction-models tutorial found that a Composition built on `function-go-templating` needs hand-written creation order and guards against deleting resources when a dependency is briefly unavailable, while kro infers order from references and waits on values that do not exist yet. Crossplane's function pipeline is more expressive (Go templates, KCL, Python) and so easier to make complicated, and kro's CEL is bounded to terminate. See [findings/go-template-compositions-need-hand-written-ordering-and-deletion-guards](../findings/go-template-compositions-need-hand-written-ordering-and-deletion-guards.md) and [comparisons/render-time-versus-controller-driven-abstraction-helm-kustomize-kpt-score-crossplane-kro-and-radius](../comparisons/render-time-versus-controller-driven-abstraction-helm-kustomize-kpt-score-crossplane-kro-and-radius.md). [sources/research-kro-and-abstraction-models](../sources/research-kro-and-abstraction-models.md)

---
title: Composite Resource (XR) and Resource Graph
type: concept
status: active
created: 2026-11-25
updated: 2026-11-26
sources:
  - id: krm-platform-vocabulary
    hash: 731a6941f9db
    ingested: 2026-11-25
  - id: research-eventual-consistency-and-convergence
    hash: bb35eafbd239
    ingested: 2026-11-25
  - id: research-composite-resource
    hash: 8640896d06b9
    ingested: 2026-11-25
  - id: research-kro-and-abstraction-models
    hash: d43d3775cbbd
    ingested: 2026-11-25
  - id: research-gap-g3-crossplane-v2
    hash: 073a1fe74dec
    ingested: 2026-11-26
aliases: [XR, Resource graph, composite]
tags: [abstraction, crossplane, kro]
---

# Composite Resource (XR) and Resource Graph

## Definition

A higher-level, opinionated KRM object, for example a PostgreSQLInstance or WebApp, created by platform engineers. It bundles multiple underlying [[concepts/managed-resource|managed resources]] behind one simplified API. The note also uses "resource graph" for the same idea as expressed by kro. [[sources/krm-platform-vocabulary]]

The Crossplane documentation puts it directly: "A composite resource, or XR, represents a set of Kubernetes resources as a single Kubernetes object." A controller expands the small object into the lower-level objects it represents, such as Deployments, Services, cloud buckets, IAM roles, or VPCs, keeps them reconciled, wires values from one child into another, reports aggregate readiness, and tears everything down in a sensible order. This is the ordinary controller pattern applied one level up, because the world being reconciled is a set of other API objects. [[sources/research-composite-resource]]

## Why it matters

This is the core abstraction for internal developer platforms: application teams request a simple object while the platform team controls the details. The mapping is defined by a [[concepts/composition]]. Design questions include API shape, defaults, and validation via [[concepts/admission-webhooks-and-cel]]. The sources frame the need from the platform side. Custom controllers are costly, client-side templating such as Helm or Kustomize cannot use CRD benefits, and a stable versioned API protects users from provider features that might break compliance. [[sources/research-composite-resource]] See [[examples/a-platform-api-hides-provider-features-to-enforce-tagging-and-tenant-segregation]] and [[examples/crossplane-adopters-build-self-service-platforms-and-service-catalogs-on-composite-resources]].

## Two implementations

Crossplane splits the idea across objects. A CompositeResourceDefinition (XRD) declares the schema and becomes a CRD. A Composition says how an instance of that API becomes composed resources, through a pipeline of composition functions. In v1 a namespaced claim fronted a cluster-scoped XR, and in v2 the XR is namespaced and claims are gone for new-style XRDs. kro merges schema and implementation into one ResourceGraphDefinition, generates the CRD, registers a dynamic controller, infers a dependency graph from CEL expressions, and creates children in topological order, deleting them in reverse. The Crossplane project's `function-kro` runs kro-style graphs inside a Crossplane pipeline, so the models now overlap. [[sources/research-composite-resource]] See [[comparisons/crossplane-composition-functions-versus-kro-resource-graph-execution-models]], [[comparisons/crossplane-v1-claims-versus-v2-namespaced-composite-resources]], and [[entities/function-kro]]. Cluster API's ClusterClass applies the same expansion pattern to cluster objects, see [[examples/cluster-api-clusterclass-expands-a-small-topology-into-many-machine-and-infrastructure-objects]].

## Per-composite controls

A Crossplane XR can select a Composition with `compositionRef` or `compositionSelector`, follow revisions automatically or pin one, be paused with the `crossplane.io/paused` annotation, take a per-XR poll interval, and be forced to reconcile with `crossplane.io/reconcile-requested-at`. An alpha deletion policy chooses Background, Foreground, or Pipeline teardown. See [[decisions/choose-automatic-or-manual-composition-update-policy]] and [[decisions/choose-foreground-or-a-pipeline-policy-for-ordered-composite-teardown]]. [[sources/research-composite-resource]]

## Readiness of composite resources

A composite resource reports `Synced` and `Ready`, and `Ready` becomes true only when the composition function pipeline reports that all composed resources are ready. A reconcile can be forced with the `crossplane.io/reconcile-requested-at` annotation. [[sources/research-eventual-consistency-and-convergence]] See [[examples/crossplane-database-claim-reports-synced-and-ready]].

In kro, ordering and readiness are separate. Dependency order is inferred from CEL references, and `readyWhen` defines per-resource readiness. In an RGD, dependents wait for their dependencies to be ready, but in the alpha `Graph` API `readyWhen` only reports health. [[sources/research-composite-resource]] See [[findings/kro-readywhen-gates-dependents-in-a-resource-graph-definition-but-only-reports-health-in-the-alpha-graph-api]].

## Pitfalls

The schema is a contract with live consumers, so breaking changes are blocked in kro and need versioning in Crossplane, see [[findings/platform-api-schemas-are-contracts-and-breaking-changes-are-blocked-or-need-conversion]]. Rolling a change out to existing instances differs by tool, see [[findings/editing-a-live-composition-can-disrupt-or-replace-existing-composed-resources]] and [[findings/a-kro-graph-revision-that-fails-compilation-stops-all-instances-with-no-fallback]]. Functions add operational parts, see [[findings/composition-functions-add-moving-parts-that-must-be-healthy]]. Deleting through a GitOps tool can bypass the deletion policy, see [[findings/argo-cd-foreground-deletion-makes-crossplane-ignore-the-composite-deletion-policy]]. Version churn leaves older material misleading, see [[findings/crossplane-v2-removed-features-and-offers-no-automated-migration-for-v1-composites]] and [[findings/older-claims-and-patch-and-transform-material-no-longer-matches-current-crossplane]]. kro itself is `v1alpha1`, see [[findings/immature-abstractions-in-the-control-plane-ecosystem]].

## Related

[[entities/crossplane]], [[entities/kro]], [[concepts/owner-references-and-garbage-collection]], [[comparisons/helm-versus-kro-versus-crossplane-as-platform-abstraction-layers]], [[decisions/choose-kro-crossplane-or-both-for-a-platform-abstraction-layer]]

## To research

Scale limits per controller, Flux handling of composites and graph instances, and the current maturity of ClusterClass. These are tracked in [[open-knowledge-gaps]].

## Render-time versus controller-driven abstractions

A composite resource is the controller-driven way to hide many resources behind one API. The abstraction-models dossier contrasts it with the render-time family (Helm, Kustomize, KRM functions and kpt, Score), which produces manifests once and leaves continuous correction to a GitOps tool. A controller-driven abstraction is a live control loop that reconciles children, writes status back to the parent, and handles deletion order. The same dossier shows two builds of one `StorageApp` API, one with a kro RGD and one with a Crossplane XRD plus `function-go-templating`, with equivalent outcomes. Crossplane v2 XRDs default to Namespaced scope. See [[comparisons/render-time-versus-controller-driven-abstraction-helm-kustomize-kpt-score-crossplane-kro-and-radius]] and [[examples/build-the-same-storageapp-api-with-kro-and-with-a-crossplane-go-templating-composition]]. [[sources/research-kro-and-abstraction-models]]

## Update from the v2.5 verification pass (2026-11-26)

Claims are a legacy feature of v1 XRDs. The v2 XRD API offers `Namespaced` and `Cluster` scope and does not support claims, and the v2.5 docs carry claim material only as a backward-compatibility note in the XRD page, What's New, and the upgrade guide. A namespaced XR can compose only resources in its own namespace, a cluster-scoped XR can compose across namespaces, and legacy cluster-scoped XRs cannot compose namespaced resources. Since v2.5.0 a function cannot make a namespaced XR compose a cluster-scoped resource by setting `metadata.namespace`. Default XR deletion is Background, and the Foreground and Pipeline policies are alpha and new in v2.5.0. [[sources/research-gap-g3-crossplane-v2]] See [[findings/the-crossplane-xrd-docs-list-legacycluster-beside-v2-scopes-although-it-exists-only-on-the-v1-xrd-api]], [[findings/a-managed-resource-without-delete-in-its-management-policies-is-removed-from-kubernetes-but-its-cloud-resource-stays]], and [[comparisons/crossplane-v1-claims-versus-v2-namespaced-composite-resources]].

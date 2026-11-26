---
title: kro (kube-resource-orchestrator)
type: entity
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: krm-platform-vocabulary
    hash: 731a6941f9db
    ingested: 2026-11-25
  - id: research-universal-control-plane
    hash: 037575049a4c
    ingested: 2026-11-25
  - id: research-declarative-vs-imperative
    hash: 570767ba4094
    ingested: 2026-11-25
  - id: research-eventual-consistency-and-convergence
    hash: bb35eafbd239
    ingested: 2026-11-25
  - id: research-self-healing-and-drift-detection
    hash: 98edc2019c6b
    ingested: 2026-11-25
  - id: research-gitops-pull-based-delivery
    hash: 335ba8f50b2b
    ingested: 2026-11-25
  - id: research-gvk-and-gvr
    hash: 5c56bb1e05a8
    ingested: 2026-11-25
  - id: research-custom-resource-definition
    hash: 6c26f7f89147
    ingested: 2026-11-25
  - id: research-spec-status-split
    hash: 598e6132ea4f
    ingested: 2026-11-25
  - id: research-server-side-apply-and-field-ownership
    hash: 1f12c486354e
    ingested: 2026-11-25
  - id: research-admission-webhooks-and-cel
    hash: c04dbed76ad9
    ingested: 2026-11-25
  - id: research-operator-pattern
    hash: eab72eca2e1b
    ingested: 2026-11-25
  - id: research-reconciliation-loop
    hash: df7d66206baf
    ingested: 2026-11-25
  - id: research-idempotency
    hash: 4704ffd77903
    ingested: 2026-11-25
  - id: research-finalizers
    hash: ca11dffc241b
    ingested: 2026-11-25
  - id: research-owner-references-and-garbage-collection
    hash: bd4cc1219f2d
    ingested: 2026-11-25
aliases: [kube-resource-orchestrator]
tags: [tool, platform]
---

# kro (kube-resource-orchestrator)

A tool that, like Crossplane, adds vocabulary for building internal developer platforms by grouping resources behind a simpler API, expressed as a resource graph. [[sources/krm-platform-vocabulary]]

## What kro is

Google announced kro on 2025-01-30 as a joint effort of Google, AWS, and Microsoft. A ResourceGraphDefinition expands one end-user CRD into a graph of Kubernetes resources, including cloud resources from [[entities/ack]], [[entities/config-connector]], and Azure Service Operator. The announcement describes kro as "a Kubernetes-native framework that lets you create reusable APIs to deploy multiple resources as a single unit." The project site describes an in-cluster controller driven by one CRD that reconciles continuously with drift detection, uses CEL (typed and non-Turing-complete) to reference fields across resources, and calls itself a SIG Cloud Provider subproject. The site showed version 0.10.0, so kro is pre-1.0, and the announcement said it was not production-ready. [[sources/research-universal-control-plane]]

Use cases from the announcement are in [[examples/self-service-gke-cluster-with-kro]]. See [[findings/immature-abstractions-in-the-control-plane-ecosystem]]. The dependency-graph and readiness mechanics were not visible in the fetched page.

## Resource graph details

The overview documentation says a ResourceGraphDefinition holds a schema, resource templates, and CEL expressions, and kro turns it into a CRD and controller. kro infers dependency order from expressions, waits on status values that do not exist yet, supports conditionals and forEach collections, and validates definitions at apply time. CEL is deliberately non-Turing-complete so definitions terminate and are auditable. The example composes an ACK S3 bucket and a Deployment behind a WebApp API, and the page showed version 0.10.0 with a Graph feature in alpha. [[sources/research-declarative-vs-imperative]] See [[examples/platform-team-self-service-apis-with-crossplane-and-kro]].

## Controller tuning

kro handles all instances from one shared queue and documents its tuning values in the unreleased "next" docs: one worker by default, exponential backoff of 200ms to 1000s with a token bucket of 10 per second and burst 100, client QPS 100 and burst 150, a 10-hour full resync, and 20 retries before an item is dropped. Instance status conditions remain unverified because the instances page returned no content. [[sources/research-eventual-consistency-and-convergence]] See [[examples/kro-shared-queue-tunes-throughput]].

## Related concepts

[[concepts/composite-resource]], [[concepts/composition]], [[entities/crossplane]]

## To research

Resource graph definition, dependency and ordering semantics, CEL usage, maturity, and comparison with Crossplane Compositions (see [[open-knowledge-gaps]]).

## Drift resync and maturity

kro's dynamic controller resyncs all instances every 36,000 seconds (10 hours) to find drift, with `dynamicControllerConcurrentReconciles` defaulting to 1, and instances waiting on dependencies requeue with exponential backoff. An issue reporting that drift in managed resources was not reconciled was closed as completed on 2025-11-04 as a duplicate of issue 323, though the exact history is unverified, so check the version before relying on self-healing. [[sources/research-self-healing-and-drift-detection]] See [[decisions/choosing-a-drift-check-interval-for-external-resources]] and [[findings/immature-abstractions-in-the-control-plane-ecosystem]].

## Relationship to GitOps

A platform team defines a ResourceGraphDefinition that becomes a new CRD, and developers commit one small instance to Git that kro expands into underlying resources, composing with ACK, Config Connector, and Azure Service Operator. kro brings its own in-cluster dynamic controller with continuous reconciliation and drift detection, so it runs a second loop beneath the GitOps agent's loop, and it validates CEL expressions at creation time. [[sources/research-gitops-pull-based-delivery]] See [[findings/two-reconcile-loops-hide-status-and-drift-at-two-layers]] and [[concepts/gitops-pull-based-delivery]].

## ResourceGraphDefinition schema as a GVK factory

In an RGD, `schema` declares `apiVersion`, `kind`, and an optional `group` that defaults to `kro.run`. kro converts a SimpleSchema into an OpenAPI v3 schema, generates a CRD named `<plural>.<group>`, and infers status field types from CEL expressions. This is the same GVK-factory idea as Crossplane with a lighter authoring syntax. [[sources/research-gvk-and-gvr]] See [[examples/xrd-and-rgd-declare-platform-gvks]] and [[concepts/gvk-and-gvr]].

## CRD generation from an RGD

Applying a ResourceGraphDefinition makes kro validate it, generate and register a CRD, and run a dynamic controller for instances, with dependencies inferred from CEL expressions and errors caught at definition time. [[sources/research-custom-resource-definition]] See [[comparisons/crossplane-xrds-versus-kro-resourcegraphdefinitions-as-crd-generators]].

## Spec schema and status from composed resources

kro lets a platform author define a schema that users fill in and wire resources together with CEL expressions that reference user spec and the status of underlying resources, which also determines dependency order. This is the same spec-and-status split at the platform layer. The dossier read only the kro overview, because the ResourceGraphDefinition concept URL returned 404, so how kro builds and reports its own status schema is not established. [[sources/research-spec-status-split]] See [[concepts/spec-status-split]] and [[open-knowledge-gaps]].

## Server-side apply coverage gap

The server-side apply dossier could not read kro's documentation (the page returned empty content), so this wiki makes no claim about how kro sets field managers or forces conflicts. [[sources/research-server-side-apply-and-field-ownership]] See [[concepts/server-side-apply-and-field-ownership]] and [[open-knowledge-gaps]].

## Admission coverage gap

The admission dossier found no primary kro material, so how kro handles validation on the CRDs it generates, and whether it uses CEL validation rules there, is not established. The Kubernetes sources describe CEL validation rules as the way a CRD author can validate without a webhook. [[sources/research-admission-webhooks-and-cel]] See [[concepts/admission-webhooks-and-cel]] and [[open-knowledge-gaps]].

## A no-code alternative to a bespoke operator

The kro overview says kro "parses the expressions, infers the dependency graph, generates a CRD, and stands up a controller - all at runtime." The operator-pattern dossier treats it as a route to a custom API that avoids writing an operator. [[sources/research-operator-pattern]] See [[examples/kro-generates-a-crd-and-controller-at-runtime-in-place-of-a-bespoke-operator]] and [[comparisons/hand-written-operator-versus-crossplane-composition-versus-kro]].

## Shared queue and tuning defaults

The controller tuning page says kro runs three reconcile loops, and its dynamic controller handles all instances through one shared rate-limited queue with a default of 1 worker, a bucket limit of 10 events per second, a full resync every 10 hours, up to 20 retries, instance requeue from 3 seconds to 5 minutes, and client QPS 100 with burst 150. The figures come from the `next` documentation and may differ in released versions. [[sources/research-reconciliation-loop]] See [[comparisons/load-and-fairness-controls-across-controller-runtime-flux-argo-cd-and-kro]].

## Idempotency coverage gap

The idempotency dossier could read only the kro home page, which claims continuous reconciliation with automatic drift detection. The instances and reconciliation sub-pages returned empty content, so how kro handles repeated reconciliation and partial failure of a resource graph is not covered. [[sources/research-idempotency]] See [[open-knowledge-gaps]].

## Instance deletion

kro keeps the instance finalizer until all managed resources are gone, finds them from a persisted ApplySet inventory, and deletes them in reverse dependency order in waves, each fully gone before the next. A stuck instance shows `ResourcesReady=Unknown` with reason `UnderDeletion`, and the fix is to find finalizers on children in the active wave. [[sources/research-finalizers]] See [[examples/kro-deletes-instance-resources-in-reverse-dependency-waves]] and [[comparisons/finalizer-gated-teardown-across-argo-cd-flux-kro-and-cluster-api]].

## Ownership of child resources (not covered)

The Google Cloud launch post says nothing about ownership or deletion mechanics, and kro's instances and FAQ pages could not be read, so how kro marks child resources with owner references or labels remains unverified. [[sources/research-owner-references-and-garbage-collection]] See [[open-knowledge-gaps]].

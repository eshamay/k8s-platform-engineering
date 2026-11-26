---
title: Crossplane
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
  - id: research-level-triggered-vs-edge-triggered
    hash: 27a34aa0de59
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
  - id: research-informers-reflectors-and-workqueues
    hash: f9de5ca73ab6
    ingested: 2026-11-25
  - id: research-finalizers
    hash: ca11dffc241b
    ingested: 2026-11-25
  - id: research-owner-references-and-garbage-collection
    hash: bd4cc1219f2d
    ingested: 2026-11-25
  - id: research-conditions
    hash: 97b224c63502
    ingested: 2026-11-25
  - id: research-managed-resource
    hash: 09ca2f9dcdc6
    ingested: 2026-11-25
  - id: research-composite-resource
    hash: 8640896d06b9
    ingested: 2026-11-25
  - id: research-composition
    hash: f57d89652816
    ingested: 2026-11-25
aliases: []
tags: [tool, platform]
---

# Crossplane

A Kubernetes extension that turns the cluster into a [[concepts/universal-control-plane]] for external infrastructure. It introduces [[concepts/provider|providers]], [[concepts/managed-resource|managed resources]], [[concepts/composite-resource|composite resources]], and [[concepts/composition|compositions]]. [[sources/krm-platform-vocabulary]]

## Compositions and functions

A CompositeResourceDefinition (XRD) defines a platform-team-owned API schema, and a Composition maps each composite resource to a pipeline of functions. Functions are gRPC servers that receive observed state, accumulated desired state, and input, and return new desired state. Crossplane applies that state and re-observes on each reconcile. The documentation summarizes this as "A pipeline of functions accumulates desired state." This moves composition logic out of YAML templating and into code with state feedback on each loop. The Crossplane home page frames the project as a way to "Extend Kubernetes to manage any resource anywhere" but names no adopters. Crossplane applies composed resources with its own service account, so RBAC on the composite resource API is the main guardrail. [[sources/research-universal-control-plane]]

See [[comparisons/ordering-models-flux-argo-cd-kro-crossplane]] and [[findings/blast-radius-and-privilege-centralization]].

## Declarative framing

The Crossplane documentation says a Composition "composes individual resources together into a larger, reusable, solution," with an XRD defining the composite schema and functions computing desired composed resources. The 2018-era announcement described a "universal declarative-style API for cloud computing" built on claims and classes, which differs from the current composite resource, composition, and function model. [[sources/research-declarative-vs-imperative]] See [[examples/platform-team-self-service-apis-with-crossplane-and-kro]].

## Reconcile cadence

A provider re-reconciles each managed resource, compares `forProvider` to the external resource, and acts according to `managementPolicies` such as Observe, Update, and LateInitialize. A poll interval and a pause annotation control cadence, but the default poll interval was not confirmed from a thin fetch. [[sources/research-level-triggered-vs-edge-triggered]] See [[comparisons/reconcile-cadence-and-off-switches-across-tools]] and [[examples/cloud-console-changes-reverted-by-provider-controllers]].

## Convergence behavior

Managed resources report `Synced` and `Ready`, can set a poll interval per resource by annotation, link to the cloud identifier with the external-name annotation, and back off on errors. The default poll interval and backoff values were not stated in the convergence dossier. [[sources/research-eventual-consistency-and-convergence]] See [[examples/crossplane-database-claim-reports-synced-and-ready]].

## Related concepts

[[concepts/custom-resource-definition]], [[concepts/finalizers]], [[concepts/self-healing-and-drift-detection]]

## To research

Architecture, composition functions, provider scaling, claims, adoption stories, pitfalls, and a ramp-up tutorial. See the Compositions versus kro gap in [[open-knowledge-gaps]].

## Drift behavior of managed resources

`spec.forProvider` is the source of truth and external edits are reverted. `managementPolicies` limit actions (Observe gives read-only adoption), the poll interval is configurable, `crossplane.io/paused` stops reconciliation, and finalizers delete external resources first. The design one-pager keeps provider-defaulted fields optional in spec, with `LateInitialize` filling them without false drift. [[sources/research-self-healing-and-drift-detection]] See [[examples/crossplane-managed-resource-enforces-forprovider-and-observes-adopted-resources]], [[findings/late-initialized-fields-create-false-drift]], and [[comparisons/drift-detection-mechanisms-across-tools]]. Crossplane drift pitfalls such as conflicts with autoscalers were not covered.

## Hosting Crossplane under a GitOps agent

Crossplane's own guide for Argo CD requires annotation-based resource tracking, custom Lua health checks for `crossplane.io` and `upbound.io` resources, exclusion of `ProviderConfigUsage` objects, and a client QPS of 300 because of the many CRDs. A generic GitOps agent does not understand custom-resource health unless told. [[sources/research-gitops-pull-based-delivery]] See [[examples/crossplane-resources-hosted-by-argo-cd]] and [[findings/generic-gitops-agents-cannot-judge-custom-resource-health]].

## XRDs as GVK factories

An XRD declares `group`, `kind`, `plural`, a version list, and a `scope`, and Crossplane generates the CRD from it, so the platform team authors a new GVK and GVR. The XRD name must be `<plural>.<group>`, group and names are immutable, breaking schema changes should ship as new XRDs or through conversion webhooks, and schema edits need a Crossplane pod restart. How v1 claims differ from v2 namespaced composite resources was not clarified. [[sources/research-gvk-and-gvr]] See [[examples/xrd-and-rgd-declare-platform-gvks]], [[findings/group-and-plural-names-are-effectively-permanent]], and [[decisions/conversion-webhook-versus-new-xrd-for-breaking-changes]].

## XRD scope, versions, and immutability

An XRD generates a CRD for the composite resource and, in older modes, a claim CRD. Scope can be Namespaced (the default in v2), Cluster, or LegacyCluster, multiple versions are allowed, breaking schema changes need conversion webhooks, schema changes may need a pod restart, and group and names cannot change after creation. The dossier read the latest documentation because the v1.14 URL returned 404. [[sources/research-custom-resource-definition]] See [[comparisons/crossplane-xrds-versus-kro-resourcegraphdefinitions-as-crd-generators]].

## Spec and status of composite resources

A composite resource's spec carries composition selection and pinning (`compositionRef`, `compositionSelector`, `compositionUpdatePolicy`, revision references) plus pause and poll-interval annotations. Its status reports `Synced` and `Ready`, so an operator can tell a broken platform from a resource that is still coming up. Issue 4094 showed a claim putting free text into the `Ready` condition's `reason`, fixed in v1.13. The dossier did not read Crossplane v2 function-pipeline status propagation. [[sources/research-spec-status-split]] See [[examples/crossplane-xr-spec-pins-composition-and-status-reports-synced-and-ready]] and [[findings/free-text-in-a-condition-reason-breaks-consumers]].

## Server-side apply

Crossplane uses server-side apply to sync claims to composite resources (behind `--enable-ssa-claims` in the v1.20 documentation, where it is alpha) and composite resources to composed resources when composition functions are used. Spec and metadata flow forward and status flows back, deleted fields and labels propagate downstream, and complex-field merging needs merge markers in the provider CRDs. The move to composition functions required a managed-fields migration, and issue 7453 on v2.3.1 is an unresolved claim that an external controller's forced field disappears, possibly because `managedFields` was hidden in the output. Crossplane v2 behavior may differ from the v1.20 page. [[sources/research-server-side-apply-and-field-ownership]] See [[examples/crossplane-clears-managed-fields-when-migrating-to-composition-functions]] and [[findings/managedfields-are-hidden-from-kubectl-output-by-default]].

## Admission coverage gap

The admission dossier found no primary Crossplane material, so this wiki makes no claim about Crossplane's own webhooks or about CRD-level CEL in composed APIs. [[sources/research-admission-webhooks-and-cel]] See [[concepts/admission-webhooks-and-cel]] and [[open-knowledge-gaps]].

## Composition as a replacement for a bespoke controller

The operator-pattern dossier presents Crossplane compositions as a way to expose a custom API without hand-writing a controller: platform teams define composite resource APIs (XRD, XR) and map them to managed resources with a Composition that runs a function pipeline, so controller logic is configured. The page at `/latest/concepts/composition/` returned 404 during the research, so current documentation paths need checking. [[sources/research-operator-pattern]] See [[examples/crossplane-composition-replaces-a-hand-written-controller-for-composed-apis]] and [[decisions/build-a-custom-operator-or-compose-existing-resources]].

## Observe, Create, Update, Delete and create tracking

The managed resource design one-pager describes a CRUD-style external client (Observe, Create, Update, Delete) with `spec.forProvider` for desired state and `status.atProvider` for observed provider state. The managed resources documentation adds create-tracking annotations that prevent a repeated or leaked create when the status write fails, the `crossplane.io/paused` annotation, `managementPolicies`, and `deletionPolicy` with `Delete` or `Orphan`. [[sources/research-reconciliation-loop]] See [[findings/a-create-that-succeeds-while-the-status-write-fails-can-leak-an-external-resource]] and [[concepts/reconciliation-loop]].

## Idempotency and external names

The idempotency dossier adds detail on how Crossplane keeps creates safe. The managed resources documentation treats `spec.forProvider` as the source of truth, keeps a stable `crossplane.io/external-name` (a VPC named `my-test-vpc` has external name `vpc-01353cfe93950a8ff`) for Observe, Update, and Delete, offers `initProvider` for creation-only settings, and lets `managementPolicies` grant any subset of Observe, Create, Update, Delete, and LateInitialize, where an empty list pauses the resource. A provider writes `external-create-pending` before a cloud create and stops with "cannot determine creation result" when the outcome is unknown, which needs a human to remove the annotation. Issue 1863 on the annotation's role was closed without a decision. [[sources/research-idempotency]] See [[findings/an-ambiguous-create-result-halts-reconciliation-until-a-human-intervenes]], [[findings/external-identity-takes-different-forms-across-cloud-apis]], [[examples/crossplane-initprovider-lets-an-autoscaler-own-node-group-size]], [[entities/crossplane-provider-btp]], and [[comparisons/ambiguous-create-and-adoption-strategies-across-crossplane-sap-ack-and-config-connector]].

## Reconcile rate as an external API budget

Crossplane issue 2595 led to a `--max-reconcile-rate` flag, merged for Crossplane 1.6 and adopted by providers, that caps reconciles per second and stands in for the cloud API call rate. It replaced scattered knobs (`QPS`, `PollInterval`, `MaxConcurrentReconciles`, `RateLimiter`). Crossplane's current performance guide was not read, so present defaults are unknown. [[sources/research-informers-reflectors-and-workqueues]] See [[examples/crossplane-max-reconcile-rate-turns-reconcile-rate-into-an-api-call-budget]].

## Finalizers, deletion policy, and teardown ordering

A managed resource holds a finalizer until the external resource is fully gone, and `deletionPolicy` is Delete by default, with Orphan keeping the cloud resource. Enabled `managementPolicies` take precedence over `deletionPolicy`. Issue 7801 describes a failure in which, on namespace deletion, a credentials Secret without a finalizer disappears before managed resources finish cleanup and leaves them stuck Terminating. Its resolution was not confirmed. [[sources/research-finalizers]] See [[examples/crossplane-ack-and-config-connector-delete-the-cloud-resource-before-the-kubernetes-object]], [[findings/a-credentials-secret-without-a-finalizer-can-vanish-before-managed-resources-finish-cleanup]], and [[decisions/protect-shared-credentials-with-finalizers-caching-or-ordered-teardown]].

## Owner references and composite deletion policy

Composed resources carry owner references to their composite resource. The composite deletion policy is Background by default, with Foreground and Pipeline as options for ordered teardown, and a composed resource that a function stops returning is deleted. Claims order deletion through `compositeDeletePolicy` because the composite has no owner reference to the claim. Issue 6084 on per-resource deletion behavior was closed as stale in April 2025. [[sources/research-owner-references-and-garbage-collection]] See [[examples/crossplane-foreground-and-pipeline-deletion-policies-order-composed-resource-teardown]] and [[decisions/choose-foreground-or-a-pipeline-policy-for-ordered-composite-teardown]].

## Conditions: Synced and Ready

Crossplane managed resources use `Ready` (reasons `Available`, `Creating`, `Unavailable`, `Deleting`) for whether the external resource is operational and `Synced` (reasons `ReconcileSuccess`, `ReconcileError`, `ReconcilePaused`) for whether the provider reconcile succeeded. Read together, `Synced=False` points to credentials, configuration, or provider problems, and `Ready=False` with `Synced=True` points to the cloud side. Upjet-based providers add `AsyncOperation`. The semantics are fixed by the framework, and provider-aws issue 2287 shows that a framework-level overwrite can leave `Synced=True` through a 60-minute update. The page read was v1.20, so Crossplane v2 behavior is unconfirmed. [[sources/research-conditions]] See [[examples/crossplane-synced-stays-true-through-a-sixty-minute-async-msk-update]], [[findings/a-summary-condition-can-stay-true-while-a-long-async-operation-is-running]], and [[comparisons/provider-fixed-versus-author-defined-condition-semantics-crossplane-versus-kro]].

## Managed resource management policies, usages, and scale

The managed resource dossier adds the operating details of Crossplane's lowest layer. `spec.managementPolicies` lists the permitted verbs (Observe, Create, Update, Delete, LateInitialize, or `*`), so import, read-only reference, orphan-on-delete, and pause are all one field, and the import recipe sets the external-name annotation and Observe before promoting to `["*"]`. Usages block deletion of a resource that is in use, which gives deletion ordering and accidental-deletion protection. Crossplane v2 represents each managed resource type as a ManagedResourceDefinition and activates only the needed ones through activation policies, which answers the CRD-count scale problem. Self-reported adopters range from thousands of managed resources to Akamai's reported 200,000. [[sources/research-managed-resource]] See [[concepts/managed-resource]], [[examples/crossplane-import-of-an-existing-gcp-database-observes-first-then-takes-control]], [[examples/crossplane-usages-order-deletion-and-guard-against-accidental-removal]], [[examples/crossplane-managed-resource-activation-policies-install-only-the-resource-types-a-cluster-needs]], [[examples/crossplane-adopters-report-managed-resource-counts-from-thousands-to-two-hundred-thousand]], and [[findings/synced-false-with-ready-true-is-a-silent-failure-where-drift-correction-stops]].

## Composite resources, composition functions, claims, and v2

The composite resources dossier read the XR, XRD, Composition, claims, v2 upgrade, and function design pages. An XR is selected onto a Composition by `compositeTypeRef`, can follow or pin CompositionRevisions, and can be paused or forced to reconcile by annotation. A Composition is a pipeline of gRPC functions that receive observed state and return desired state, and since v1.17 this is the standard form. In v1 a namespaced claim fronted a cluster-scoped XR, while v2 makes the XR namespaced, removes claims for new-style XRDs, removes native patch-and-transform, ControllerConfig, external secret stores, and XR connection details, and has no automated migration for v1 cluster-scoped XRs. The alpha composite deletion policy can be bypassed by Argo CD's foreground propagation. [[sources/research-composite-resource]]

The project also shipped `function-kro` in March 2026. See [[concepts/composite-resource]], [[concepts/composition]], [[entities/function-kro]], [[comparisons/crossplane-v1-claims-versus-v2-namespaced-composite-resources]], [[comparisons/crossplane-composition-functions-versus-kro-resource-graph-execution-models]], [[findings/crossplane-v2-removed-features-and-offers-no-automated-migration-for-v1-composites]], [[findings/argo-cd-foreground-deletion-makes-crossplane-ignore-the-composite-deletion-policy]], and [[examples/crossplane-adopters-build-self-service-platforms-and-service-catalogs-on-composite-resources]]. Claim support in v2 rests partly on a third-party blog, so it needs checking against the v2 XRD documentation.

## Composition authoring history and function operations

The Compositions dossier traces patch and transform, then composition functions, then Crossplane 2.0. Functions are long-running gRPC servers deployed by the package manager, reached through a headless Service and secured with mTLS. Composites pin to a CompositionRevision, are polled every 60 seconds by default, and function calls therefore scale with composite count. Composition functions do not run on deletion. Version 2.0 (12 August 2025) made XRs namespaced by default, removed the claim and XR split, added the `Operation` type, and added activation policies so a cluster installs only the managed resource CRDs it needs. [[sources/research-composition]]

Operationally, a function that omits a resource from desired state deletes it, see [[findings/a-composition-function-that-omits-a-resource-from-its-desired-state-deletes-it]], and load and memory are discussed in [[findings/function-calls-scale-with-composite-count-and-large-composites-can-exhaust-function-memory]]. Case studies are [[examples/vshn-appcat-sells-self-service-databases-queues-and-object-storage-through-composition-functions]] and [[examples/imagine-learning-replaces-thousand-line-patch-and-transform-files-with-a-looping-composition-function]]. Running under Argo CD needs annotation-based resource tracking, custom Lua health checks, and a higher client QPS (50 by default, 300 suggested), see [[entities/argo-cd]].

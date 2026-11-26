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

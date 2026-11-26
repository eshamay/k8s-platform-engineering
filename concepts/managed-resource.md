---
title: Managed Resource (MR)
type: concept
status: active
created: 2026-11-25
updated: 2026-11-26
sources:
  - id: krm-platform-vocabulary
    hash: 731a6941f9db
    ingested: 2026-11-25
  - id: research-self-healing-and-drift-detection
    hash: 98edc2019c6b
    ingested: 2026-11-25
  - id: research-managed-resource
    hash: 09ca2f9dcdc6
    ingested: 2026-11-25
  - id: research-gap-g3-crossplane-v2
    hash: 073a1fe74dec
    ingested: 2026-11-26
aliases: [MR]
tags: [abstraction, crossplane]
---

# Managed Resource (MR)

## Definition

A low-level, one-to-one KRM representation of a single cloud provider primitive, such as an individual VPC, Subnet, or IAM Role. [[sources/krm-platform-vocabulary]] More concretely, a Crossplane managed resource is a Kubernetes object that stands for exactly one external thing, and the Crossplane documentation says "Crossplane calls the object inside Kubernetes a managed resource and the external object inside the Provider an external resource." A provider controller reads the real thing, compares it to what the object asks for, and creates, updates, or deletes the real thing to close the gap, so the shortest framing is a Deployment-style controller loop whose pods are cloud resources. [[sources/research-managed-resource]]

## Why it matters

Managed resources are the building blocks that a [[concepts/composition]] assembles into a [[concepts/composite-resource]]. They are delivered by a [[concepts/provider]] and rely on [[concepts/finalizers]] for safe external cleanup. They are also where the platform's safety properties live, because deleting the object deletes the real resource by default.

## Anatomy

Every managed resource has the same skeleton. `spec.forProvider` is the authoritative desired state. `spec.initProvider` holds values applied only at creation, which is useful for fields that something else later changes, such as an autoscaled count (see [[examples/crossplane-initprovider-lets-an-autoscaler-own-node-group-size]]). `status.atProvider` is what the provider last observed. The `crossplane.io/external-name` annotation says which external resource the object maps to, and it defaults to the object name for many kinds or to an ID the cloud assigns. Crossplane also writes create-pending, succeeded, and failed annotations so that an interrupted create does not leak a resource. Two conditions diagnose different failures: `Synced` says whether the last reconcile succeeded and `Ready` says whether the external thing is usable. See [[concepts/conditions]] and [[findings/synced-false-with-ready-true-is-a-silent-failure-where-drift-correction-stops]]. The reconciler behind every provider has the same phases (Connect, Observe, Create, Update, Delete) with idempotent create and delete, see [[examples/provider-authors-implement-an-external-client-behind-the-shared-managed-reconciler]]. [[sources/research-managed-resource]]

## Source of truth and management policies

Crossplane treats `spec.forProvider` as the source of truth and reverts external edits. The `Ready` and `Synced` conditions separate existence from last-reconcile success, and `managementPolicies` (Observe, Create, Update, Delete, LateInitialize) scope what the controller may do. [[sources/research-self-healing-and-drift-detection]] See [[examples/crossplane-managed-resource-enforces-forprovider-and-observes-adopted-resources]] and [[findings/late-initialized-fields-create-false-drift]].

The list is the main safety and import lever. A value of `*` means all verbs and is the default. `["Observe"]` gives read-only import or a permanent reference, a list without Delete gives "manage but orphan on delete", and an empty list pauses reconciliation. The `crossplane.io/paused: "true"` annotation also pauses. The feature began as a three-value enum (FullControl, OrphanOnDelete, ObserveOnly) in the observe-only design document and shipped as a list, and the import guide labels it beta. See [[decisions/choose-management-policies-for-an-imported-resource]] and [[findings/older-observeonly-and-deletionpolicy-advice-needs-translation-to-managementpolicies]]. [[sources/research-managed-resource]]

## Importing existing resources

Import follows a standard recipe: set the external-name annotation to the existing resource's identifier, set Observe, apply, inspect `status.atProvider`, copy the needed values into `spec.forProvider`, and switch to `["*"]`. The hazards are the manual copy, ambiguous names across regions, relaxed validation, and disabled late initialization. See [[examples/crossplane-import-of-an-existing-gcp-database-observes-first-then-takes-control]], [[examples/an-observe-only-managed-resource-lets-a-composition-read-a-database-owned-by-another-team]], and [[findings/observe-based-import-has-manual-copy-steps-ambiguous-names-and-relaxed-validation]]. Other controllers solve the same ownership question differently, see [[comparisons/observe-only-and-keep-controls-across-crossplane-config-connector-and-ack]].

## Deletion, ordering, and protection

Deleting the Kubernetes object deletes the cloud resource by default in Crossplane, Config Connector, and ACK. Crossplane answers with policies that omit Delete, and adds Usages for deletion ordering and accidental-deletion protection. Every managed resource carries a finalizer, so deletion hangs if the provider is absent, and removing the finalizer by hand orphans the real resource. Crossplane does not delete and recreate to change an immutable field. See [[examples/crossplane-usages-order-deletion-and-guard-against-accidental-removal]], [[findings/destructive-deletion-of-external-resources]], [[findings/crossplane-does-not-delete-and-recreate-to-change-immutable-fields]], and [[comparisons/deletion-policies-across-gitops-and-provider-tools]].

## Scale and operation

Because each external resource type is its own CRD, multi-cloud provider sets imply thousands of CRDs, which strain API server discovery and OpenAPI computation. Crossplane v2 activates only needed types through ManagedResourceDefinitions and activation policies. Self-reported adopters run thousands to as many as 200,000 managed resources. See [[findings/one-crd-per-external-resource-type-overloads-api-server-discovery-and-openapi-computation]], [[examples/crossplane-managed-resource-activation-policies-install-only-the-resource-types-a-cluster-needs]], and [[examples/crossplane-adopters-report-managed-resource-counts-from-thousands-to-two-hundred-thousand]].

## Related

[[entities/crossplane]], [[entities/config-connector]], [[entities/ack]], [[concepts/gvk-and-gvr]], [[concepts/self-healing-and-drift-detection]]

## To research

Open questions are tracked in [[open-knowledge-gaps]]: the feature-lifecycle status of management policies, the old-enum-to-list mapping, per-provider external-name defaults, and behavior of namespaced v2 managed resources when a provider is down.

## Update from the v2.5 verification pass (2026-11-26)

`managementPolicies` is still beta in the v2.5 docs and on by default, with values `*` (the default), Create, Delete, LateInitialize, Observe, and Update, and an empty list pauses the resource. Namespaced managed resources, new in v2.0.0, have no `deletionPolicy`, while cluster-scoped ones keep it and a deprecated resolver combines the two fields. Managed resource definitions and activation policies are alpha, and the default Helm install activates every definition. [[sources/research-gap-g3-crossplane-v2]] See [[examples/crossplane-issue-5283-has-left-deletionpolicy-deprecation-open-since-2024]], [[findings/a-managed-resource-without-delete-in-its-management-policies-is-removed-from-kubernetes-but-its-cloud-resource-stays]], [[findings/the-default-crossplane-helm-install-activates-every-managed-resource-so-activation-policies-need-the-default-turned-off]], and [[findings/crossplane-v2-5-docs-and-source-disagree-on-stage-labels-condition-status-and-group-suffixes]].

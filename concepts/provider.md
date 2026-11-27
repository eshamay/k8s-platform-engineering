---
title: Provider
type: concept
status: active
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: krm-platform-vocabulary
    hash: 731a6941f9db
    ingested: 2026-11-25
  - id: research-managed-resource
    hash: 09ca2f9dcdc6
    ingested: 2026-11-25
  - id: research-provider
    hash: 7e43edcd71be
    ingested: 2026-11-25
aliases: []
tags: [abstraction, crossplane, ack, config-connector, upjet, cluster-api]
---

# Provider

## Definition

A packaged controller plus a set of CRDs that teaches the control plane how to speak to a specific external API, for example provider-aws, provider-azure, or provider-github. [sources/krm-platform-vocabulary](../sources/krm-platform-vocabulary.md)

## Why it matters

Providers are how the [concepts/universal-control-plane](universal-control-plane.md) reaches outside the cluster. Each is an [operator](operator-pattern.md) that defines [managed resources](managed-resource.md). Large providers ship hundreds of CRDs, which creates scale and upgrade questions.

## Related

[entities/crossplane](../entities/crossplane.md), [concepts/custom-resource-definition](custom-resource-definition.md), [concepts/self-healing-and-drift-detection](self-healing-and-drift-detection.md)

## To research

Open points are listed in [open-knowledge-gaps](../open-knowledge-gaps.md): how Upjet runs Terraform at runtime, which Config Connector resources use which controller kind, and how Flux and Argo CD treat provider-managed resources.

## Managed reconciler and activation policies

Every provider reuses the shared managed reconciler (Connect, Observe, Create, Update, Delete) and implements the external client interface, see [examples/provider-authors-implement-an-external-client-behind-the-shared-managed-reconciler](../examples/provider-authors-implement-an-external-client-behind-the-shared-managed-reconciler.md). Because each external resource type is a CRD, large providers strain the API server, and Crossplane v2 lets clusters activate only the types they need, see [examples/crossplane-managed-resource-activation-policies-install-only-the-resource-types-a-cluster-needs](../examples/crossplane-managed-resource-activation-policies-install-only-the-resource-types-a-cluster-needs.md). [sources/research-managed-resource](../sources/research-managed-resource.md)

## Anatomy of a provider

A provider pairs CustomResourceDefinitions that describe an external resource as a Kubernetes API with a controller that watches those objects and calls the external API, running the usual observe, compare, act loop from the [concepts/reconciliation-loop](reconciliation-loop.md). In Crossplane the provider is an installable OCI package. A `Provider` object installs it, each upgrade creates a `ProviderRevision`, a `ProviderConfig` or `ClusterProviderConfig` selects credentials, and a `DeploymentRuntimeConfig` customizes the pod. [sources/research-provider](../sources/research-provider.md)

## Packaging models

Crossplane splits large catalogs into provider families, see [examples/crossplane-provider-families-let-operators-install-only-the-cloud-services-they-use](../examples/crossplane-provider-families-let-operators-install-only-the-cloud-services-they-use.md). ACK ships one controller per AWS service, Config Connector and Azure Service Operator are cloud-vendor add-ons, and Cluster API uses the word for contract implementations rather than catalogs. The comparisons are in [comparisons/crossplane-versus-cloud-vendor-add-ons-ack-config-connector-and-aso](../comparisons/crossplane-versus-cloud-vendor-add-ons-ack-config-connector-and-aso.md), [comparisons/provider-families-versus-per-service-controllers](../comparisons/provider-families-versus-per-service-controllers.md), and [comparisons/crossplane-providers-versus-cluster-api-providers](../comparisons/crossplane-providers-versus-cluster-api-providers.md). [sources/research-provider](../sources/research-provider.md)

## How catalogs are produced

Most large catalogs are generated, by Upjet from Terraform, by ACK from AWS API models, and by Azure Service Operator from Azure Resource Manager schemas, see [examples/upjet-generates-crossplane-providers-from-terraform-providers](../examples/upjet-generates-crossplane-providers-from-terraform-providers.md) and [findings/generated-provider-catalogs-inherit-the-behavior-and-bugs-of-their-generator](../findings/generated-provider-catalogs-inherit-the-behavior-and-bugs-of-their-generator.md). Hand-written providers follow the pattern in [findings/hand-written-providers-that-treat-not-found-as-an-error-break-the-create-flow](../findings/hand-written-providers-that-treat-not-found-as-an-error-break-the-create-flow.md).

## Operational risks

The sources consistently name four risks. Removing a provider first can abandon real infrastructure, see [findings/removing-a-crossplane-provider-before-its-managed-resources-abandons-the-cloud-resources](../findings/removing-a-crossplane-provider-before-its-managed-resources-abandons-the-cloud-resources.md). Reconciliation reverts out-of-band changes, see [examples/cloud-console-changes-reverted-by-provider-controllers](../examples/cloud-console-changes-reverted-by-provider-controllers.md). Controllers hold broad cloud credentials, see [findings/anyone-who-can-create-a-provider-managed-object-gets-the-controllers-cloud-permissions](../findings/anyone-who-can-create-a-provider-managed-object-gets-the-controllers-cloud-permissions.md) and [decisions/scope-provider-credentials-per-namespace-or-cluster-wide](../decisions/scope-provider-credentials-per-namespace-or-cluster-wide.md). Upgrades leave revisions behind, see [findings/provider-upgrades-leave-old-revisions-and-block-automatic-downgrades](../findings/provider-upgrades-leave-old-revisions-and-block-automatic-downgrades.md). Stateful deletion can lose data, see [findings/deleting-stateful-resources-through-a-provider-can-lose-data](../findings/deleting-stateful-resources-through-a-provider-can-lose-data.md). The page is promoted to active because it now has a definition, packaging models, a catalog-building story, and a sourced risk list. [sources/research-provider](../sources/research-provider.md)

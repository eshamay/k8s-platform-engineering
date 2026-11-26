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

A packaged controller plus a set of CRDs that teaches the control plane how to speak to a specific external API, for example provider-aws, provider-azure, or provider-github. [[sources/krm-platform-vocabulary]]

## Why it matters

Providers are how the [[concepts/universal-control-plane]] reaches outside the cluster. Each is an [[concepts/operator-pattern|operator]] that defines [[concepts/managed-resource|managed resources]]. Large providers ship hundreds of CRDs, which creates scale and upgrade questions.

## Related

[[entities/crossplane]], [[concepts/custom-resource-definition]], [[concepts/self-healing-and-drift-detection]]

## To research

Open points are listed in [[open-knowledge-gaps]]: how Upjet runs Terraform at runtime, which Config Connector resources use which controller kind, and how Flux and Argo CD treat provider-managed resources.

## Managed reconciler and activation policies

Every provider reuses the shared managed reconciler (Connect, Observe, Create, Update, Delete) and implements the external client interface, see [[examples/provider-authors-implement-an-external-client-behind-the-shared-managed-reconciler]]. Because each external resource type is a CRD, large providers strain the API server, and Crossplane v2 lets clusters activate only the types they need, see [[examples/crossplane-managed-resource-activation-policies-install-only-the-resource-types-a-cluster-needs]]. [[sources/research-managed-resource]]

## Anatomy of a provider

A provider pairs CustomResourceDefinitions that describe an external resource as a Kubernetes API with a controller that watches those objects and calls the external API, running the usual observe, compare, act loop from the [[concepts/reconciliation-loop]]. In Crossplane the provider is an installable OCI package. A `Provider` object installs it, each upgrade creates a `ProviderRevision`, a `ProviderConfig` or `ClusterProviderConfig` selects credentials, and a `DeploymentRuntimeConfig` customizes the pod. [[sources/research-provider]]

## Packaging models

Crossplane splits large catalogs into provider families, see [[examples/crossplane-provider-families-let-operators-install-only-the-cloud-services-they-use]]. ACK ships one controller per AWS service, Config Connector and Azure Service Operator are cloud-vendor add-ons, and Cluster API uses the word for contract implementations rather than catalogs. The comparisons are in [[comparisons/crossplane-versus-cloud-vendor-add-ons-ack-config-connector-and-aso]], [[comparisons/provider-families-versus-per-service-controllers]], and [[comparisons/crossplane-providers-versus-cluster-api-providers]]. [[sources/research-provider]]

## How catalogs are produced

Most large catalogs are generated, by Upjet from Terraform, by ACK from AWS API models, and by Azure Service Operator from Azure Resource Manager schemas, see [[examples/upjet-generates-crossplane-providers-from-terraform-providers]] and [[findings/generated-provider-catalogs-inherit-the-behavior-and-bugs-of-their-generator]]. Hand-written providers follow the pattern in [[findings/hand-written-providers-that-treat-not-found-as-an-error-break-the-create-flow]].

## Operational risks

The sources consistently name four risks. Removing a provider first can abandon real infrastructure, see [[findings/removing-a-crossplane-provider-before-its-managed-resources-abandons-the-cloud-resources]]. Reconciliation reverts out-of-band changes, see [[examples/cloud-console-changes-reverted-by-provider-controllers]]. Controllers hold broad cloud credentials, see [[findings/anyone-who-can-create-a-provider-managed-object-gets-the-controllers-cloud-permissions]] and [[decisions/scope-provider-credentials-per-namespace-or-cluster-wide]]. Upgrades leave revisions behind, see [[findings/provider-upgrades-leave-old-revisions-and-block-automatic-downgrades]]. Stateful deletion can lose data, see [[findings/deleting-stateful-resources-through-a-provider-can-lose-data]]. The page is promoted to active because it now has a definition, packaging models, a catalog-building story, and a sourced risk list. [[sources/research-provider]]

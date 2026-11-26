---
title: "Azure Service Operator"
type: entity
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-provider
    hash: 7e43edcd71be
    ingested: 2026-11-25
  - id: research-landscape
    hash: d28204a90545
    ingested: 2026-11-25
aliases: []
tags: [azure-service-operator, azure, provider, code-generation]
---

# Azure Service Operator

## What it is

Azure Service Operator version 2 (ASO) lets teams deploy and maintain Azure resources using Kubernetes tooling. The documentation says it manages 150 or more Azure resources, with CRDs generated from Azure Resource Manager schemas so that coverage tracks Azure. It uses ownership references for Azure lifecycle relationships. [[sources/research-provider]]

## Position among provider tools

ASO is one of the cloud-vendor add-ons, alongside [[entities/ack]] for AWS and [[entities/config-connector]] for Google Cloud, which expose cloud resources close to one-to-one without a built-in composition layer, see [[comparisons/crossplane-versus-cloud-vendor-add-ons-ack-config-connector-and-aso]]. The documentation mentions Crossplane only as a code-generation target and gives no comparison. [[sources/research-provider]]

## Related

[[examples/azure-service-operator-generates-crds-from-azure-resource-manager-schemas]], [[concepts/provider]], [[concepts/owner-references-and-garbage-collection]].

## Open points

The dossier does not cover ASO's credential scoping, deletion policy, or drift cadence.

## Landscape view

The official documentation confirms that CRDs are code-generated from Azure Resource Manager schemas, that conventions such as owner references and asynchronous reconciliation are followed, and that workload identity, multi-tenant deployment modes, and reduced-permission setups are supported (https://azure.github.io/azure-service-operator/). The multi-tenant and reduced-permission modes address the blast-radius concern in [[findings/controllers-that-act-with-their-own-cloud-identity-give-whoever-can-create-a-resource-that-identity-s-rights]]. See [[examples/single-cloud-teams-pick-ack-per-service-or-azure-service-operator-v2-with-code-generated-crds]] and [[concepts/tooling-landscape]]. [[sources/research-landscape]]

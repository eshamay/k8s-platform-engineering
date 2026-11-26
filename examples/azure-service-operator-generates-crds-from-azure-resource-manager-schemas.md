---
title: "Azure Service Operator generates CRDs from Azure Resource Manager schemas"
type: example
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-provider
    hash: 7e43edcd71be
    ingested: 2026-11-25
aliases: []
tags: [azure-service-operator, azure, code-generation, provider]
---

# Azure Service Operator generates CRDs from Azure Resource Manager schemas

## Scenario

An Azure-centric team wants to deploy and maintain Azure resources using the Kubernetes tooling it already uses. Azure Service Operator v2 supplies that, and the documentation says it manages 150 or more Azure resources. [[sources/research-provider]]

## How it works

The CRDs are generated from Azure Resource Manager schemas, so the set of supported resources and fields tracks what Azure itself publishes. The operator uses ownership references to express Azure lifecycle relationships, such as a resource group owning the resources inside it. The documentation mentions Crossplane only as a code-generation target and gives no comparison, so none is inferred here. [[sources/research-provider]]

## Lesson

Azure Service Operator is a third example of schema-driven generation, alongside [[examples/upjet-generates-crossplane-providers-from-terraform-providers]] for Terraform and ACK's generation from AWS API models. Generation buys coverage that follows the cloud, at the price of a very large API surface, see [[findings/one-crd-per-external-resource-type-overloads-api-server-discovery-and-openapi-computation]]. Ownership references here echo [[concepts/owner-references-and-garbage-collection]]. See [[entities/azure-service-operator]].

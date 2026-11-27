---
title: "Upjet generates Crossplane providers from Terraform providers"
type: example
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-provider
    hash: 7e43edcd71be
    ingested: 2026-11-25
aliases: []
tags: [upjet, crossplane, terraform, code-generation, provider]
---

# Upjet generates Crossplane providers from Terraform providers

## Scenario

A team wants Kubernetes-native management of a SaaS target that already has a Terraform provider, such as GitHub repositories or Grafana dashboards, and does not want to hand-write a controller for every resource type. The dossier describes this as the same workflow the official AWS, Azure, and GCP Crossplane providers use. [sources/research-provider](../sources/research-provider.md)

## How it works

The author sets the Terraform provider source, repository, and version in the Makefile, then defines an `ExternalNameConfig` for each resource that says how the resource is identified and imported. Per-resource customizations are added where the defaults are not enough, and `make generate` emits the CRDs, Go types, and controllers. Only resources that have an external name configuration are generated. At runtime the generated controllers reuse Terraform's resource logic, while users see only a Kubernetes API. [sources/research-provider](../sources/research-provider.md)

## Lesson

Writing a provider can mean configuring a generator and not hand-coding controllers, which is why generated catalogs grow so quickly and why they share behavior and bugs with their source, see [findings/generated-provider-catalogs-inherit-the-behavior-and-bugs-of-their-generator](../findings/generated-provider-catalogs-inherit-the-behavior-and-bugs-of-their-generator.md). The external name configuration is where idempotent identification is decided, so it connects to [concepts/idempotency](../concepts/idempotency.md) and to [concepts/managed-resource](../concepts/managed-resource.md). See also [entities/upjet](../entities/upjet.md) and [entities/crossplane](../entities/crossplane.md).

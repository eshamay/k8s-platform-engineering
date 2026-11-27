---
title: A platform API hides provider features to enforce tagging and tenant segregation
type: example
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-composite-resource
    hash: 8640896d06b9
    ingested: 2026-11-25
aliases: []
tags: [crossplane, compliance, governance, tagging, multi-tenancy]
---

# A platform API hides provider features to enforce tagging and tenant segregation

## Scenario

Compliance and governance are a motivation for composite resources in the dossier, not a named deployment. The Crossplane blog on designing compositions for organizational needs (Markus Schweig, Upbound, 2023-10-06) argues for the pattern. [sources/research-composite-resource](../sources/research-composite-resource.md)

## How it works

The platform team exposes well understood features behind its own versioned API and does not pass every provider feature through. The post warns that native provider features can break proprietary environments or reduce compliance. Inside the Composition, the platform team can apply automated tagging to every composed resource, wire connection details to an external secret store, and keep the whole definition in GitOps. For tenants, "Multi-tenant access segregation for resource claims is an excellent pattern for proper cloud governance and security." The `function-kro` post adds that extra pipeline steps can perform policy checks and cost-allocation tagging. URL: https://blog.crossplane.io/design-compositions-for-your-organizational-needs-with-crossplane/.

The post also describes a test-driven loop using kind, Kuttl, and Skaffold in which each Kuttl run takes 2 to 5 minutes, which is the short feedback loop it recommends for composition authors.

## Caveats

The post is vendor-authored and predates v2, so claims, external secret stores, and native patch-and-transform appear in it although v2 removed or changed them. See [findings/older-claims-and-patch-and-transform-material-no-longer-matches-current-crossplane](../findings/older-claims-and-patch-and-transform-material-no-longer-matches-current-crossplane.md). For the API-as-contract idea see [findings/platform-api-schemas-are-contracts-and-breaking-changes-are-blocked-or-need-conversion](../findings/platform-api-schemas-are-contracts-and-breaking-changes-are-blocked-or-need-conversion.md), and for related examples see [examples/crossplane-adopters-build-self-service-platforms-and-service-catalogs-on-composite-resources](crossplane-adopters-build-self-service-platforms-and-service-catalogs-on-composite-resources.md).

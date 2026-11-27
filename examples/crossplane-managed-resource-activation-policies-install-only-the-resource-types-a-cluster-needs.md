---
title: Crossplane managed resource activation policies install only the resource types a cluster needs
type: example
status: active
created: 2026-11-25
updated: 2026-11-26
sources:
  - id: research-managed-resource
    hash: 09ca2f9dcdc6
    ingested: 2026-11-25
  - id: research-gap-g3-crossplane-v2
    hash: 073a1fe74dec
    ingested: 2026-11-26
aliases: []
tags: [crossplane, scale, crd, managed-resource-definition, activation-policy]
---

# Crossplane managed resource activation policies install only the resource types a cluster needs

## Scenario

A cluster installs a large cloud provider, but the platform needs only a handful of its resource types. Without a remedy, every type becomes a CRD, and thousands of CRDs overload the API server, as described in [findings/one-crd-per-external-resource-type-overloads-api-server-discovery-and-openapi-computation](../findings/one-crd-per-external-resource-type-overloads-api-server-discovery-and-openapi-computation.md). [sources/research-managed-resource](../sources/research-managed-resource.md)

## How it works

Crossplane v2 represents each managed resource type as a ManagedResourceDefinition (MRD). A ManagedResourceActivationPolicy (MRAP) lists exact names or prefix-wildcard patterns, and only the definitions that match are activated and turned into served CRDs. Providers that implement "safe-start" can activate definitions on demand. URL: https://docs.crossplane.io/latest/managed-resources/managed-resource-activation-policies/.

## Lesson

This is the official Crossplane answer to the scale cost of "one CRD per external resource type", and it makes managed resource types selectively installed instead of all installed. It trades completeness for a smaller API surface, so platform teams must know which types they use. For the underlying API machinery cost see [concepts/custom-resource-definition](../concepts/custom-resource-definition.md) and [findings/etcd-scale-limits-of-the-shared-store](../findings/etcd-scale-limits-of-the-shared-store.md), and for the related client tuning that Argo CD needs see [examples/crossplane-resources-hosted-by-argo-cd](crossplane-resources-hosted-by-argo-cd.md).

## Update from the v2.5 verification pass (2026-11-26)

Mechanism and defaults, from the v2.5 docs and source ([sources/research-gap-g3-crossplane-v2](../sources/research-gap-g3-crossplane-v2.md)): an MRAP's `spec.activate` patterns match MRD names with prefix-only wildcards, matching MRDs become `Active` one way only, and `status.activated` records the result. The Helm chart creates a default MRAP with `"*"`, so the stock install activates everything. A provider needs the `safe-start` capability for its MRDs to start Inactive, and v2.4.0 scales such a provider's runtime to zero until the first MRD is active. MRDs and MRAPs are alpha in the docs. The original statement that this is "the official Crossplane answer" to CRD count should be read with that maturity label. See [findings/the-default-crossplane-helm-install-activates-every-managed-resource-so-activation-policies-need-the-default-turned-off](../findings/the-default-crossplane-helm-install-activates-every-managed-resource-so-activation-policies-need-the-default-turned-off.md) and [examples/crossplane-v2-4-and-v2-5-cut-memory-on-clusters-with-hundreds-to-two-thousand-crds](crossplane-v2-4-and-v2-5-cut-memory-on-clusters-with-hundreds-to-two-thousand-crds.md).

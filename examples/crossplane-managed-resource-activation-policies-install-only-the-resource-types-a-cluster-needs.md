---
title: Crossplane managed resource activation policies install only the resource types a cluster needs
type: example
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-managed-resource
    hash: 09ca2f9dcdc6
    ingested: 2026-11-25
aliases: []
tags: [crossplane, scale, crd, managed-resource-definition, activation-policy]
---

# Crossplane managed resource activation policies install only the resource types a cluster needs

## Scenario

A cluster installs a large cloud provider, but the platform needs only a handful of its resource types. Without a remedy, every type becomes a CRD, and thousands of CRDs overload the API server, as described in [[findings/one-crd-per-external-resource-type-overloads-api-server-discovery-and-openapi-computation]]. [[sources/research-managed-resource]]

## How it works

Crossplane v2 represents each managed resource type as a ManagedResourceDefinition (MRD). A ManagedResourceActivationPolicy (MRAP) lists exact names or prefix-wildcard patterns, and only the definitions that match are activated and turned into served CRDs. Providers that implement "safe-start" can activate definitions on demand. URL: https://docs.crossplane.io/latest/managed-resources/managed-resource-activation-policies/.

## Lesson

This is the official Crossplane answer to the scale cost of "one CRD per external resource type", and it makes managed resource types selectively installed instead of all installed. It trades completeness for a smaller API surface, so platform teams must know which types they use. For the underlying API machinery cost see [[concepts/custom-resource-definition]] and [[findings/etcd-scale-limits-of-the-shared-store]], and for the related client tuning that Argo CD needs see [[examples/crossplane-resources-hosted-by-argo-cd]].

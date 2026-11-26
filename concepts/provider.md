---
title: Provider
type: concept
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: krm-platform-vocabulary
    hash: 731a6941f9db
    ingested: 2026-11-25
  - id: research-managed-resource
    hash: 09ca2f9dcdc6
    ingested: 2026-11-25
aliases: []
tags: [abstraction, crossplane]
---

# Provider

## Definition

A packaged controller plus a set of CRDs that teaches the control plane how to speak to a specific external API, for example provider-aws, provider-azure, or provider-github. [[sources/krm-platform-vocabulary]]

## Why it matters

Providers are how the [[concepts/universal-control-plane]] reaches outside the cluster. Each is an [[concepts/operator-pattern|operator]] that defines [[concepts/managed-resource|managed resources]]. Large providers ship hundreds of CRDs, which creates scale and upgrade questions.

## Related

[[entities/crossplane]], [[concepts/custom-resource-definition]], [[concepts/self-healing-and-drift-detection]]

## To research

Provider families and sharding, credential handling, and the cost of CRD count.

## Managed reconciler and activation policies

Every provider reuses the shared managed reconciler (Connect, Observe, Create, Update, Delete) and implements the external client interface, see [[examples/provider-authors-implement-an-external-client-behind-the-shared-managed-reconciler]]. Because each external resource type is a CRD, large providers strain the API server, and Crossplane v2 lets clusters activate only the types they need, see [[examples/crossplane-managed-resource-activation-policies-install-only-the-resource-types-a-cluster-needs]]. [[sources/research-managed-resource]]

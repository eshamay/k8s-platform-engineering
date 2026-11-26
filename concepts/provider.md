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

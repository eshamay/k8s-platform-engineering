---
title: Operator Pattern
type: concept
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: krm-platform-vocabulary
    hash: 731a6941f9db
    ingested: 2026-11-25
aliases: [Operator, Kubernetes operator]
tags: [controllers]
---

# Operator Pattern

## Definition

Packaging domain-specific operational knowledge, such as how to create, back up, upgrade, and delete a resource, into a custom controller paired with one or more CRDs. [[sources/krm-platform-vocabulary]]

## Why it matters

Operators turn runbooks into software. A [[concepts/provider]] in Crossplane is an operator whose domain is an external API. The pattern combines [[concepts/custom-resource-definition]] and [[concepts/reconciliation-loop]].

## Related

[[concepts/finalizers]], [[concepts/conditions]], [[entities/crossplane]]

## To research

Operator maturity models, frameworks (Operator SDK, Kubebuilder), and anti-patterns such as operators that hide too much.

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
  - id: research-declarative-vs-imperative
    hash: 570767ba4094
    ingested: 2026-11-25
aliases: [Operator, Kubernetes operator]
tags: [controllers]
---

# Operator Pattern

## Definition

Packaging domain-specific operational knowledge, such as how to create, back up, upgrade, and delete a resource, into a custom controller paired with one or more CRDs. [[sources/krm-platform-vocabulary]]

## Why it matters

Operators turn runbooks into software. A [[concepts/provider]] in Crossplane is an operator whose domain is an external API. The pattern combines [[concepts/custom-resource-definition]] and [[concepts/reconciliation-loop]].

## Definition in the Kubernetes docs

The Kubernetes documentation says "Operators are clients of the Kubernetes API that act as controllers for a Custom Resource." Its SampleDB example has a user edit a custom resource while the operator creates PVCs, StatefulSets, and Jobs. [[sources/research-declarative-vs-imperative]] See [[examples/database-operator-encodes-runbooks]] and [[entities/kubebuilder]].

## Related

[[concepts/finalizers]], [[concepts/conditions]], [[entities/crossplane]]

## To research

Operator maturity models, frameworks (Operator SDK, Kubebuilder), and anti-patterns such as operators that hide too much.

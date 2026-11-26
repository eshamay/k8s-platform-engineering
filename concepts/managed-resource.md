---
title: Managed Resource (MR)
type: concept
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: krm-platform-vocabulary
    hash: 731a6941f9db
    ingested: 2026-11-25
  - id: research-self-healing-and-drift-detection
    hash: 98edc2019c6b
    ingested: 2026-11-25
aliases: [MR]
tags: [abstraction, crossplane]
---

# Managed Resource (MR)

## Definition

A low-level, one-to-one KRM representation of a single cloud provider primitive, such as an individual VPC, Subnet, or IAM Role. [[sources/krm-platform-vocabulary]]

## Why it matters

Managed resources are the building blocks that a [[concepts/composition]] assembles into a [[concepts/composite-resource]]. They are delivered by a [[concepts/provider]] and rely on [[concepts/finalizers]] for safe external cleanup.

## Related

[[entities/crossplane]], [[concepts/gvk-and-gvr]], [[concepts/self-healing-and-drift-detection]]

## To research

Deletion and management policies, external-name handling, import of existing resources, and provider generation approaches.

## Source of truth and management policies

Crossplane treats `spec.forProvider` as the source of truth and reverts external edits. The `Ready` and `Synced` conditions separate existence from last-reconcile success, and `managementPolicies` (Observe, Create, Update, Delete, LateInitialize) scope what the controller may do. [[sources/research-self-healing-and-drift-detection]] See [[examples/crossplane-managed-resource-enforces-forprovider-and-observes-adopted-resources]] and [[findings/late-initialized-fields-create-false-drift]].

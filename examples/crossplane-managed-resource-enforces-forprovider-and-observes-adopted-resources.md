---
title: Crossplane managed resources enforce forProvider and can observe adopted resources
type: example
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-self-healing-and-drift-detection
    hash: 98edc2019c6b
    ingested: 2026-11-25
aliases: []
tags: [crossplane, drift, management-policies, adoption]
---

# Crossplane managed resources enforce forProvider and can observe adopted resources

## Scenario

A platform team exposes a database or bucket as a [[concepts/managed-resource]] through [[entities/crossplane]]. The documentation at https://docs.crossplane.io/latest/managed-resources/managed-resources/ states that "Crossplane considers the `forProvider` field of a managed resource the 'source of truth' for external resources." Edits made outside Kubernetes are therefore reverted on the next poll. [[sources/research-self-healing-and-drift-detection]]

## Controls

The `Ready` and `Synced` conditions separate "it exists" from "the last reconcile succeeded". `managementPolicies` (Observe, Create, Update, Delete, LateInitialize) limit what the controller may do, so an existing resource can be imported with Observe and never modified. The poll interval is configurable, and the `crossplane.io/paused` annotation stops reconciliation entirely. Finalizers delete the external resource before the Kubernetes object disappears.

## Lesson

The same object can be an enforcer, an observer, or paused, depending on policy. See [[comparisons/exemption-and-ignore-controls-across-tools]], [[decisions/staged-adoption-of-automated-drift-correction]], [[findings/late-initialized-fields-create-false-drift]], and [[examples/crossplane-database-claim-reports-synced-and-ready]].

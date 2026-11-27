---
title: Crossplane does not delete and recreate to change immutable fields
type: finding
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-managed-resource
    hash: 09ca2f9dcdc6
    ingested: 2026-11-25
aliases: []
tags: [pitfall, crossplane, immutable-fields, terraform]
---

# Crossplane does not delete and recreate to change immutable fields

## Observation

The Crossplane managed resources documentation notes that Crossplane keeps immutable fields unchanged and does not delete and recreate the resource to apply a change, which is what Terraform does. A change to such a field in `spec.forProvider` may therefore simply not take effect. URL: https://docs.crossplane.io/latest/managed-resources/managed-resources/. The dossier read this page through a summarizing fetch, so the exact failure signal was not confirmed. [sources/research-managed-resource](../sources/research-managed-resource.md)

## Why it matters

The behavior is safer for stateful resources, since a casual edit cannot destroy a database, but it surprises people who expect Terraform semantics. A mismatch between the desired and the external value can show up as a reconcile error or as a quietly unapplied change. Replacement has to be a deliberate act, for example by creating a new [concepts/managed-resource](../concepts/managed-resource.md) and migrating data.

## Mitigations

Treat immutable fields as part of resource identity, decide them before the first apply, and watch the `Synced` condition after any edit, see [findings/synced-false-with-ready-true-is-a-silent-failure-where-drift-correction-stops](synced-false-with-ready-true-is-a-silent-failure-where-drift-correction-stops.md). For admission-time immutability on custom resources see [examples/cel-transition-rules-enforce-crd-immutability](../examples/cel-transition-rules-enforce-crd-immutability.md), and for the wider hazards of deleting external resources see [findings/destructive-deletion-of-external-resources](destructive-deletion-of-external-resources.md).

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
  - id: research-managed-resource
    hash: 09ca2f9dcdc6
    ingested: 2026-11-25
aliases: []
tags: [crossplane, drift, management-policies, adoption]
---

# Crossplane managed resources enforce forProvider and can observe adopted resources

## Scenario

A platform team exposes a database or bucket as a [concepts/managed-resource](../concepts/managed-resource.md) through [entities/crossplane](../entities/crossplane.md). The documentation at https://docs.crossplane.io/latest/managed-resources/managed-resources/ states that "Crossplane considers the `forProvider` field of a managed resource the 'source of truth' for external resources." Edits made outside Kubernetes are therefore reverted on the next poll. [sources/research-self-healing-and-drift-detection](../sources/research-self-healing-and-drift-detection.md)

## Controls

The `Ready` and `Synced` conditions separate "it exists" from "the last reconcile succeeded". `managementPolicies` (Observe, Create, Update, Delete, LateInitialize) limit what the controller may do, so an existing resource can be imported with Observe and never modified. The poll interval is configurable, and the `crossplane.io/paused` annotation stops reconciliation entirely. Finalizers delete the external resource before the Kubernetes object disappears.

## Lesson

The same object can be an enforcer, an observer, or paused, depending on policy. See [comparisons/exemption-and-ignore-controls-across-tools](../comparisons/exemption-and-ignore-controls-across-tools.md), [decisions/staged-adoption-of-automated-drift-correction](../decisions/staged-adoption-of-automated-drift-correction.md), [findings/late-initialized-fields-create-false-drift](../findings/late-initialized-fields-create-false-drift.md), and [examples/crossplane-database-claim-reports-synced-and-ready](crossplane-database-claim-reports-synced-and-ready.md).

## Further reading from the managed resource dossier

The managed resource dossier explains the same controls in detail: [examples/crossplane-import-of-an-existing-gcp-database-observes-first-then-takes-control](crossplane-import-of-an-existing-gcp-database-observes-first-then-takes-control.md) for the import recipe, [examples/an-observe-only-managed-resource-lets-a-composition-read-a-database-owned-by-another-team](an-observe-only-managed-resource-lets-a-composition-read-a-database-owned-by-another-team.md) for permanent Observe, and [findings/synced-false-with-ready-true-is-a-silent-failure-where-drift-correction-stops](../findings/synced-false-with-ready-true-is-a-silent-failure-where-drift-correction-stops.md) for the silent loss of management. [sources/research-managed-resource](../sources/research-managed-resource.md)

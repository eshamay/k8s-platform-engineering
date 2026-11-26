---
title: Editing a live Composition can disrupt or replace existing composed resources
type: finding
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-composite-resource
    hash: 8640896d06b9
    ingested: 2026-11-25
aliases: []
tags: [pitfall, crossplane, composition, revisions, rollout]
---

# Editing a live Composition can disrupt or replace existing composed resources

## Observation

The Crossplane v2 upgrade guide warns against editing a live Composition that existing XRs use, because the change could disrupt or replace resources. [[sources/research-composite-resource]] URL: https://docs.crossplane.io/latest/guides/upgrade-to-crossplane-v2/.

## Why it matters

Crossplane tracks Composition changes as CompositionRevisions, and an XR defaults to the Automatic update policy, which means it adopts the latest revision. An edit to a shared Composition therefore propagates to every composite that follows the latest revision, and each composite then reconciles its children toward the new desired state. A careless change can alter or recreate real infrastructure.

## Mitigations

An XR can use `compositionUpdatePolicy: Manual` with `compositionRevisionRef` to pin a revision, or `compositionRevisionSelector` to choose one by label. The `function-kro` post lists revision pinning and rollback as a benefit of running graphs inside Crossplane, and `crossplane render` allows local testing before a change ships. The dossier also recommends unit tests and a Kuttl loop. See [[decisions/choose-automatic-or-manual-composition-update-policy]], [[comparisons/composition-revisions-versus-graph-revisions-for-rolling-out-platform-api-changes]], and [[examples/crossplane-xr-spec-pins-composition-and-status-reports-synced-and-ready]].

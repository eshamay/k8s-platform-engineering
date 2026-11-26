---
title: Choose automatic or manual composition update policy
type: decision
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-composite-resource
    hash: 8640896d06b9
    ingested: 2026-11-25
aliases: []
tags: [decision, crossplane, composition-revision, rollout]
---

# Choose automatic or manual composition update policy

## Status

Open question framed by the sources, not an ADR authored by this wiki. The Crossplane documentation describes the options and the upgrade guide warns about one of them, but no source says which teams choose. [[sources/research-composite-resource]]

## Context

A [[concepts/composite-resource]] follows a Composition through CompositionRevisions. The XR's `compositionUpdatePolicy` is Automatic by default, so it takes the latest revision, or Manual, so it stays on a pinned `compositionRevisionRef` or one chosen by `compositionRevisionSelector`. The XRD can also set `defaultCompositionUpdatePolicy` and enforce a Composition. The v2 upgrade guide warns that editing a live Composition used by existing XRs could disrupt or replace resources.

## Options

Keep Automatic, so every composite converges on the newest platform behavior without work from consumers. Use Manual with pinned revisions, so each team upgrades on its own schedule and a bad revision reaches only those who adopt it. Mix the two, with Automatic for non-production and Manual for production.

## Consequences

Automatic keeps the fleet uniform but makes every Composition edit a fleet-wide rollout, see [[findings/editing-a-live-composition-can-disrupt-or-replace-existing-composed-resources]]. Manual shifts risk to consumers and can leave old revisions running for a long time, and it needs someone to track which composite is on which revision. kro has no per-instance choice, see [[comparisons/composition-revisions-versus-graph-revisions-for-rolling-out-platform-api-changes]]. See also [[examples/crossplane-xr-spec-pins-composition-and-status-reports-synced-and-ready]] and [[decisions/conversion-webhook-versus-new-xrd-for-breaking-changes]].

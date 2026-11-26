---
title: Composition revisions versus graph revisions for rolling out platform API changes
type: comparison
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-composite-resource
    hash: 8640896d06b9
    ingested: 2026-11-25
aliases: []
tags: [crossplane, kro, revisions, rollout, versioning]
---

# Composition revisions versus graph revisions for rolling out platform API changes

## Summary

Both tools snapshot changes to the definition, but they differ on who chooses which snapshot an instance uses and on what happens when a snapshot is bad. [[sources/research-composite-resource]]

## Side by side

| Aspect | Crossplane CompositionRevision | kro GraphRevision |
|---|---|---|
| Created when | The Composition changes | The RGD spec changes |
| Immutable | Tracked as revisions | Yes |
| Who picks the revision | Each XR, through `compositionUpdatePolicy` (Automatic by default, or Manual) with `compositionRevisionRef` or `compositionRevisionSelector` | The latest revision applies to all instances |
| Pinning and rollback | Supported per XR | Not described |
| Failure of the newest revision | Only XRs following the latest are affected | If the latest fails compilation, instances stop progressing with no fallback |
| Schema guard | Versioning and conversion webhooks | Breaking changes blocked unless `kro.run/allow-breaking-changes` is set |
| Condition | Not read | `GraphRevisionsResolved` among the RGD conditions |

## Reading the table

Crossplane makes rollout a per-instance choice, which suits platforms where many teams consume one API and cannot all move at once, but the Automatic default means an edit to a shared Composition still reaches followers immediately, see [[findings/editing-a-live-composition-can-disrupt-or-replace-existing-composed-resources]]. kro treats the definition as a single latest version, see [[findings/a-kro-graph-revision-that-fails-compilation-stops-all-instances-with-no-fallback]]. The `function-kro` post argues that embedding kro-style graphs in a Crossplane pipeline gives them revision pinning and rollback. See [[decisions/choose-automatic-or-manual-composition-update-policy]] and [[findings/platform-api-schemas-are-contracts-and-breaking-changes-are-blocked-or-need-conversion]].

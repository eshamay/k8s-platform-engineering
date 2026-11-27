---
title: Composition revisions versus graph revisions for rolling out platform API changes
type: comparison
status: draft
created: 2026-11-25
updated: 2026-11-26
sources:
  - id: research-composite-resource
    hash: 8640896d06b9
    ingested: 2026-11-25
  - id: research-gap-g3-kro
    hash: e8d7c5923d98
    ingested: 2026-11-26
aliases: []
tags: [crossplane, kro, revisions, rollout, versioning]
---

# Composition revisions versus graph revisions for rolling out platform API changes

## Summary

Both tools snapshot changes to the definition, but they differ on who chooses which snapshot an instance uses and on what happens when a snapshot is bad. [sources/research-composite-resource](../sources/research-composite-resource.md)

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

Crossplane makes rollout a per-instance choice, which suits platforms where many teams consume one API and cannot all move at once, but the Automatic default means an edit to a shared Composition still reaches followers immediately, see [findings/editing-a-live-composition-can-disrupt-or-replace-existing-composed-resources](../findings/editing-a-live-composition-can-disrupt-or-replace-existing-composed-resources.md). kro treats the definition as a single latest version, see [findings/a-kro-graph-revision-that-fails-compilation-stops-all-instances-with-no-fallback](../findings/a-kro-graph-revision-that-fails-compilation-stops-all-instances-with-no-fallback.md). The `function-kro` post argues that embedding kro-style graphs in a Crossplane pipeline gives them revision pinning and rollback. See [decisions/choose-automatic-or-manual-composition-update-policy](../decisions/choose-automatic-or-manual-composition-update-policy.md) and [findings/platform-api-schemas-are-contracts-and-breaking-changes-are-blocked-or-need-conversion](../findings/platform-api-schemas-are-contracts-and-breaking-changes-are-blocked-or-need-conversion.md).

## Update from kro v0.10.0

At v0.10.0 the RGD controller runs on the graph engine and issues `GraphRevision` objects, and the docs describe each as an immutable snapshot created on every spec change. The alpha `Graph` kind does not get revisions: "kro does not create GraphRevision objects for Graphs". The table's "Not described" cell for kro pinning and rollback still holds, because the dossier found no pinning mechanism. See [findings/a-kro-graph-has-no-revision-history-and-sets-no-owner-references-on-the-resources-it-creates](../findings/a-kro-graph-has-no-revision-history-and-sets-no-owner-references-on-the-resources-it-creates.md). [sources/research-gap-g3-kro](../sources/research-gap-g3-kro.md)

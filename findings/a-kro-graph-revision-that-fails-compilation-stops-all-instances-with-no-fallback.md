---
title: A kro graph revision that fails compilation stops all instances with no fallback
type: finding
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-composite-resource
    hash: 8640896d06b9
    ingested: 2026-11-25
aliases: []
tags: [pitfall, kro, graph-revision, rollout]
---

# A kro graph revision that fails compilation stops all instances with no fallback

## Observation

kro snapshots each change to a ResourceGraphDefinition as an immutable GraphRevision. The overview documentation states that if the latest revision fails compilation, instances stop progressing, and kro does not fall back to an older revision. [[sources/research-composite-resource]] URL: https://kro.run/docs/concepts/rgd/overview/.

## Why it matters

A bad edit to a shared definition therefore affects every instance of the API at once, and the previous good revision does not keep serving them. Crossplane works differently. A composite can stay on a pinned CompositionRevision with the Manual update policy, so a bad new revision only reaches composites that follow the latest. The dossier notes that running kro logic inside Crossplane through `function-kro` is argued to bring that pinning to kro-style graphs.

## Mitigations

Static analysis catches many mistakes at definition time, including schema errors, missing kinds, CEL type errors, and cycles, and breaking schema changes are blocked without an explicit annotation, see [[findings/platform-api-schemas-are-contracts-and-breaking-changes-are-blocked-or-need-conversion]]. Beyond that the sources give no rollback mechanism for kro, so changes to shared definitions should be treated as high risk. See [[comparisons/composition-revisions-versus-graph-revisions-for-rolling-out-platform-api-changes]], [[entities/kro]], and [[findings/immature-abstractions-in-the-control-plane-ecosystem]].

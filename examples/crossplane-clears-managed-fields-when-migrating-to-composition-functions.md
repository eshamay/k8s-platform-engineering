---
title: Crossplane clears managed fields when migrating to composition functions
type: example
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-server-side-apply-and-field-ownership
    hash: 1f12c486354e
    ingested: 2026-11-25
aliases: []
tags: [crossplane, server-side-apply, managedfields, migration]
---

# Crossplane clears managed fields when migrating to composition functions

## Scenario

Crossplane composed resources created by the older, Update-style path have every field owned by the manager `crossplane` with operation `Update`. When the composite resource controller moves to composition functions, it applies desired state with server-side apply instead. [[sources/research-server-side-apply-and-field-ownership]]

## What happened

Issue 5639 (April 2024) documents a four-step managed-fields migration in code comments. Step one is the starting state described above. Step two deletes all field managers. Step three has the controller server-side apply its intent under a manager whose name starts with `apiextensions.crossplane.io/composed/`, which leaves every field it did not specify owned by a `before-first-apply` entry with operation `Update`. Step four deletes the `before-first-apply` entry. URL: https://github.com/crossplane/crossplane/issues/5639.

## Why it was needed

The issue states that "Without this managedFields upgrade, the composed resources ends up having shared ownership of fields and field removals won't sync properly." The same stale co-owner problem that hit Flux applies here.

## Lesson

The recipe is reusable by any controller moving from Update-style writes to Apply. It also shows how a platform layer depends on SSA, since claim to composite resource to composed resource propagation relies on correct ownership. Crossplane's own page (v1.20, alpha) says deleted fields and labels propagate downstream and that complex-field merging needs CRD merge markers. See [[findings/client-side-to-server-side-migration-leaves-stale-co-owners]], [[findings/atomic-lists-and-unmarked-crds-block-shared-field-ownership]], and [[entities/crossplane]].

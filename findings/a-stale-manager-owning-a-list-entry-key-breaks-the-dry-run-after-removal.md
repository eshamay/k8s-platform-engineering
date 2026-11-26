---
title: A stale manager owning a list entry key breaks the dry-run after removal
type: finding
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-server-side-apply-and-field-ownership
    hash: 1f12c486354e
    ingested: 2026-11-25
aliases: []
tags: [pitfall, flux, server-side-apply, dry-run, lists]
---

# A stale manager owning a list entry key breaks the dry-run after removal

## Observation

Flux issue 1722 describes an operator who disables Flux, patches a workload with a legacy controller using Update operations, and re-enables Flux. The legacy manager now co-owns a container entry's key but not its required `image` field. When a later commit removes the container, server-side apply drops the field Flux solely owned and leaves an invalid half-removed container. The dry-run then fails on every reconcile. [[sources/research-server-side-apply-and-field-ownership]]

## Why the usual cleanup does not run

Flux reclaims known managers only after a successful dry-run, through `--override-manager`, so that a failed apply never reassigns ownership. Here the dry-run fails first, so the cleanup never runs. The proposed fix was an opt-in `--override-manager-before-dry-run=<manager>` flag. A maintainer agreed that "doing operations before dry-run is dangerous and can have unintended consequences", and the flag is meant only for targeted migrations from legacy controllers to Flux. URL: https://github.com/fluxcd/kustomize-controller/issues/1722.

## Status

The issue was opened in August 2026 and closed in October 2026 as completed through kustomize-controller PR 1747. The dossier did not read the shipped documentation, so the final flag semantics should be checked against current Flux documentation. See [[open-knowledge-gaps]].

## Related

[[findings/field-ownership-blocks-drift-correction]], [[findings/client-side-to-server-side-migration-leaves-stale-co-owners]], [[concepts/server-side-apply-and-field-ownership]], [[entities/flux]]

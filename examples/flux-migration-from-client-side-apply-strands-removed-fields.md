---
title: Flux migration from client-side apply strands removed fields
type: example
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-server-side-apply-and-field-ownership
    hash: 1f12c486354e
    ingested: 2026-11-25
aliases: []
tags: [flux, server-side-apply, migration, managedfields]
---

# Flux migration from client-side apply strands removed fields

## Scenario

Flux 0.17 applied manifests by running `kubectl` client-side apply, and Flux 0.18 switched kustomize-controller to server-side apply. Users who upgraded, and users who adopted manually applied resources into Flux, found that fields removed from Git remained in the cluster. [[sources/research-server-side-apply-and-field-ownership]]

## What happened

Issue 486 in the kustomize-controller repository, opened by Stefan Prodan in November 2021, records the cause. The old manager still co-owned the fields, and Flux's force option cannot take ownership of a field that no longer appears in the applied object. The maintainer's phrase is "you can't force ownerships for non existing fields." URL: https://github.com/fluxcd/kustomize-controller/issues/486.

## Workarounds

The maintainer workaround was to delete the offending entry in `metadata.managedFields` so the controller owns everything on the next reconcile. One commenter reported that this did not remove a stale environment variable and recreated the Deployment with `--cascade=orphan` instead. The issue was labeled blocked on an upstream Kubernetes issue and was closed by a later fix pull request. The dossier also reports an `--override-manager` flag that reclaims named managers after a successful dry-run.

## Lesson

A migration between apply mechanisms leaves ownership records that no applied manifest will ever mention, so cleanup has to be explicit. See [[findings/client-side-to-server-side-migration-leaves-stale-co-owners]], [[examples/crossplane-clears-managed-fields-when-migrating-to-composition-functions]], and [[entities/flux]].

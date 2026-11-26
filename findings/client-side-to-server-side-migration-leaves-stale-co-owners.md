---
title: Migrating from client-side to server-side apply leaves stale co-owners
type: finding
status: draft
created: 2026-11-25
updated: 2026-11-26
sources:
  - id: research-server-side-apply-and-field-ownership
    hash: 1f12c486354e
    ingested: 2026-11-25
  - id: research-gap-g3-flux-ssa-helm
    hash: e825557fc5c4
    ingested: 2026-11-26
aliases: []
tags: [pitfall, server-side-apply, migration, managedfields]
---

# Migrating from client-side to server-side apply leaves stale co-owners

## Observation

When a tool or controller moves from client-side apply or Update-style writes to server-side apply, the old manager entries (`kubectl` with operation `Update`, and `before-first-apply`) keep co-owning fields. Fields then cannot be pruned: removing one from the manifest leaves it in the cluster, because someone else still owns it and force cannot take ownership of a field that is no longer in the applied object. [[sources/research-server-side-apply-and-field-ownership]]

## Evidence

Flux hit this when moving from 0.17 to 0.18 and when adopting hand-applied resources (kustomize-controller issue 486). Crossplane hit it when moving composed resources to composition functions (issue 5639), where the issue states that without a managed-fields upgrade "field removals won't sync properly." Kubernetes documents `kubectl apply --server-side` as the supported upgrade path and warns that fields changed outside client-side apply, for example with `kubectl scale`, then produce conflicts. See [[examples/flux-migration-from-client-side-apply-strands-removed-fields]] and [[examples/crossplane-clears-managed-fields-when-migrating-to-composition-functions]].

## Mitigations

Each tool chose a different cleanup. Flux's workaround was deleting the `managedFields` entry and later an `--override-manager` flag that reclaims named managers after a successful dry-run. Since kustomize-controller v1.10.0, a separate `--override-manager-before-dry-run` flag does the same before the dry-run, for objects the dry-run itself rejects ([[findings/the-flux-pre-dry-run-takeover-transfers-all-fields-of-the-named-managers-and-is-not-reverted-if-the-apply-fails]]). Argo CD automates the move to its `argocd-controller` manager with a client-side apply migration feature that deletes the old entry. Crossplane clears all managers, applies under a new manager, and deletes `before-first-apply`. Argo CD's proposal also notes the risk of alternating client-side and server-side syncs. See [[comparisons/client-side-apply-versus-server-side-apply]].

## Related

[[concepts/server-side-apply-and-field-ownership]], [[findings/a-stale-manager-owning-a-list-entry-key-breaks-the-dry-run-after-removal]], [[findings/mixing-management-techniques-on-one-object]], [[entities/flux]], [[entities/argo-cd]], [[entities/crossplane]]

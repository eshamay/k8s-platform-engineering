---
title: "Argo CD ignoreDifferences only affects the diff unless RespectIgnoreDifferences is set, and then only for resources that already exist"
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-o1-argocd-flux-gitops
    hash: 3a5f956bbd5a
    ingested: 2026-11-26
aliases: []
tags: [argo-cd, ignore-differences, drift, sync-options]
---

# Argo CD ignoreDifferences only affects the diff unless RespectIgnoreDifferences is set, and then only for resources that already exist

## Observation

Argo CD's sync-options page says "By default, Argo CD uses the `ignoreDifferences` config just for computing the diff between the live and desired state which becomes the basis for the sync status". An ignored field therefore stops showing as OutOfSync, but the next sync still applies the full manifest from Git and can overwrite the ignored field. Setting the sync option `RespectIgnoreDifferences=true` makes the sync honor the ignore rules, and the page adds that it is "only effective when the resource is already created in the cluster", so a first create still applies every field. URL: https://github.com/argoproj/argo-cd/blob/main/docs/user-guide/sync-options.md. Dossier-verified from docs at `main` on 2026-11-26, not a pinned release tag. [[sources/research-gap-o1-argocd-flux-gitops]]

## What the diffing page adds

The diffing page says `ignoreDifferences` uses "RFC6902 JSON patches and JQ path expressions" and can also ignore "differences from fields owned by specific managers" through `managedFieldsManagers`. The same rules can be configured "to be applied to all resources in every Application managed by an Argo CD instance" through resource customizations in `argocd-cm`. URL: https://github.com/argoproj/argo-cd/blob/main/docs/user-guide/diffing.md.

## Why it matters

A team that adds an ignore rule to silence a false OutOfSync can still see the field reset on every sync, which looks like a revert loop even though the diff is clean. The opposite habit, setting `RespectIgnoreDifferences=true` and expecting it to protect a field on first create, does not work. Flux's `.spec.ignore` rules act during drift detection and correction directly, see [[comparisons/flux-ignore-rules-versus-argo-cd-ignoredifferences-and-force-conflicts-for-drift-fights]].

## Related

[[entities/argo-cd]], [[findings/ignoring-a-field-in-flux-or-argo-cd-means-git-changes-to-it-are-no-longer-applied]], [[findings/multiple-writers-on-one-object]], [[comparisons/exemption-and-ignore-controls-across-tools]]

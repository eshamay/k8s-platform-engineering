---
title: Argo CD documents Server-Side Diff as stable since v3.1.0 while the issue tracker holds many open bugs
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-m4-ssa-conflict-policy
    hash: 28e595eae3e0
    ingested: 2026-11-26
aliases: [Server-Side Diff stability]
tags: [argo-cd, server-side-diff, stability, issues, verified]
---

# Argo CD documents Server-Side Diff as stable since v3.1.0 while the issue tracker holds many open bugs

## Observation

The Argo CD diff-strategies page says "_Current Status: Stable (Since v3.1.0)_". It says Server-Side Diff runs a dry-run server-side apply per resource, is used automatically for Applications that enable the Server-Side Apply sync option, can be turned off with `ServerSideDiff=false`, and is skipped for resources that do not exist yet. It also says the older Structured-Merge Diff strategy "has been discontinued in favour of Server-Side Diff". [[sources/research-gap-m4-ssa-conflict-policy]] URL: https://argo-cd.readthedocs.io/en/latest/user-guide/diff-strategies/ (read 2026-11-26).

## The tracker disagrees in practice

A search of the Argo CD tracker found 20 or more open issues that mention ServerSideDiff. The dossier names 28861 (stale `managedFields` cause permanent phantom OutOfSync, 2026-07-22), 27625 (reverts target changes for CRDs with `x-kubernetes-preserve-unknown-fields`, 2026-04-30), 27237 (hides manual changes, 2026-04-08), 25533 (misses spec changes of a custom resource, 2025-12-05), and 17717 (duplicate port error, 2024-04-03). Only the titles of most were read. See [[examples/argo-cd-issue-28861-stale-managedfields-leave-an-application-permanently-out-of-sync-under-server-side-diff]], [[examples/argo-cd-issue-25533-server-side-diff-does-not-detect-spec-changes-to-a-custom-resource]], and [[examples/kubernetes-issue-130292-a-forced-server-side-apply-could-not-revert-an-edited-service-port]].

## What this settles

The earlier wiki claim, from a personal blog, that Server-Side Diff is stable since 3.1 is now backed by the primary documentation. "Stable" is a documentation label and not a statement that the issues are closed. No maintainer statement reconciling the label with the open bugs was found, so whether "stable" means issue-free is UNVERIFIED. A secondary blog also says mutating webhooks need `IncludeMutationWebhook=true`; that is SECONDARY-ONLY. The latest Argo CD release read was v3.6.3, published 2026-11-24.

## Related

[[entities/argo-cd]], [[findings/diff-is-not-apply-server-defaults-look-like-drift]], [[examples/argo-cd-server-side-diff-ends-false-out-of-sync-from-server-defaults]]

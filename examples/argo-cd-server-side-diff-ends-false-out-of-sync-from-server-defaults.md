---
title: Argo CD Server-Side Diff ends false OutOfSync from server defaults
type: example
status: active
created: 2026-11-25
updated: 2026-11-26
sources:
  - id: research-server-side-apply-and-field-ownership
    hash: 1f12c486354e
    ingested: 2026-11-25
  - id: research-gap-m4-ssa-conflict-policy
    hash: 28e595eae3e0
    ingested: 2026-11-26
aliases: []
tags: [argo-cd, server-side-apply, diff, out-of-sync]
---

# Argo CD Server-Side Diff ends false OutOfSync from server defaults

## Scenario

A team enables `ServerSideApply=true` on an Argo CD Application and the sync succeeds, yet the Application stays OutOfSync. The affected resources include StatefulSets whose `volumeClaimTemplates` carry fields such as `volumeMode` and `status.phase` that the API server fills in. [sources/research-server-side-apply-and-field-ownership](../sources/research-server-side-apply-and-field-ownership.md)

## What happened

The practitioner article explains that the apply and the comparison are separate operations. With SSA the API server merges and tracks ownership, but Argo CD's default diff compares Git-rendered manifests with live state inside its own process. Server defaults that Git never declared therefore look like drift. URL: https://blog.danielepetrollo.com/en/argocd-outofsync-server-side-diff. The article is a personal blog and discloses AI assistance in drafting.

## Diagnosis and fix

The author recommends proving the cause with `kubectl diff --server-side`, which shows no difference when the server agrees. The fix is `ServerSideDiff=true`, set as an annotation on the Application or globally with `controller.diff.server.side`. Argo CD then sends a dry-run apply for each resource and compares the results. Two caveats apply: changes made by mutating webhooks are excluded unless `IncludeMutationWebhook=true`, and resources that are still being created fall back to the normal diff. The article also claims Server-Side Diff is stable since Argo CD 3.1.0, which the dossier did not verify.

## Lesson

The author prefers this fix over `ignoreDifferences`, because ignoring a field also hides real drift, and writes that "Server-Side Diff hides nothing." `ignoreDifferences` remains the right tool for fields a controller rewrites on purpose, such as `replicas` under an autoscaler. See [findings/diff-is-not-apply-server-defaults-look-like-drift](../findings/diff-is-not-apply-server-defaults-look-like-drift.md), [entities/argo-cd](../entities/argo-cd.md), [comparisons/exemption-and-ignore-controls-across-tools](../comparisons/exemption-and-ignore-controls-across-tools.md), and [concepts/server-side-apply-and-field-ownership](../concepts/server-side-apply-and-field-ownership.md).

## Update from the m4 dossier

Correction note, 2026-11-26: the article's claim that Server-Side Diff is stable since Argo CD 3.1.0, which the first dossier did not verify, is confirmed by the diff-strategies page ("Stable (Since v3.1.0)"), which also says it is used automatically with the Server-Side Apply sync option. Stable does not mean issue-free, because 20 or more Server-Side Diff issues are open, among them 28861 and 25533. [sources/research-gap-m4-ssa-conflict-policy](../sources/research-gap-m4-ssa-conflict-policy.md) See [findings/argo-cd-documents-server-side-diff-as-stable-since-v3-1-0-while-the-issue-tracker-holds-many-open-bugs](../findings/argo-cd-documents-server-side-diff-as-stable-since-v3-1-0-while-the-issue-tracker-holds-many-open-bugs.md), [examples/argo-cd-issue-28861-stale-managedfields-leave-an-application-permanently-out-of-sync-under-server-side-diff](argo-cd-issue-28861-stale-managedfields-leave-an-application-permanently-out-of-sync-under-server-side-diff.md), and [examples/argo-cd-issue-25533-server-side-diff-does-not-detect-spec-changes-to-a-custom-resource](argo-cd-issue-25533-server-side-diff-does-not-detect-spec-changes-to-a-custom-resource.md).

---
title: Argo CD issue 28861, stale managedFields leave an Application permanently out of sync under Server-Side Diff
type: example
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-m4-ssa-conflict-policy
    hash: 28e595eae3e0
    ingested: 2026-11-26
aliases: [Argo CD issue 28861]
tags: [argo-cd, server-side-diff, managed-fields, out-of-sync, issue]
---

# Argo CD issue 28861, stale managedFields leave an Application permanently out of sync under Server-Side Diff

## Scenario

An Application uses Server-Side Diff, and stale entries in the live object's `managedFields` change what the server's dry-run apply reports. [sources/research-gap-m4-ssa-conflict-policy](../sources/research-gap-m4-ssa-conflict-policy.md)

## What the issue says

Issue 28861 in argoproj/argo-cd, filed 2026-07-22 and open on 2026-11-26, reports that the Application "stays **permanently `OutOfSync`**" when stale `managedFields` are present. URL: https://github.com/argoproj/argo-cd/issues/28861. Only the title and the quoted line were read, so the exact trigger and any workaround are not recorded.

## Why it matters

The documentation calls Server-Side Diff stable since v3.1.0, and this issue was filed against a release line after that. It shows that a stable label does not remove the dependence of the diff on clean field ownership, the same dependence that wedges Flux's dry-run in [findings/a-stale-manager-owning-a-list-entry-key-breaks-the-dry-run-after-removal](../findings/a-stale-manager-owning-a-list-entry-key-breaks-the-dry-run-after-removal.md). See [findings/argo-cd-documents-server-side-diff-as-stable-since-v3-1-0-while-the-issue-tracker-holds-many-open-bugs](../findings/argo-cd-documents-server-side-diff-as-stable-since-v3-1-0-while-the-issue-tracker-holds-many-open-bugs.md).

## Related

[entities/argo-cd](../entities/argo-cd.md), [findings/diff-is-not-apply-server-defaults-look-like-drift](../findings/diff-is-not-apply-server-defaults-look-like-drift.md), [concepts/server-side-apply-and-field-ownership](../concepts/server-side-apply-and-field-ownership.md)

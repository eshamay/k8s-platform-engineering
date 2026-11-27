---
title: Argo CD issue 25533, Server-Side Diff does not detect spec changes to a custom resource
type: example
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-m4-ssa-conflict-policy
    hash: 28e595eae3e0
    ingested: 2026-11-26
aliases: [Argo CD issue 25533]
tags: [argo-cd, server-side-diff, custom-resource, issue]
---

# Argo CD issue 25533, Server-Side Diff does not detect spec changes to a custom resource

## Scenario

A team uses Server-Side Diff on an Application that contains a custom resource and changes its spec in Git. [sources/research-gap-m4-ssa-conflict-policy](../sources/research-gap-m4-ssa-conflict-policy.md)

## What the issue says

Issue 25533 in argoproj/argo-cd, filed 2025-12-05, reports that "server-side diff does not detect changes to the spec of a custom resource". URL: https://github.com/argoproj/argo-cd/issues/25533. The dossier read the title and quote only, so the affected CRD and the cause are not recorded. The dossier also lists issue 27625, which reverts target changes for CRDs with `x-kubernetes-preserve-unknown-fields`, and issue 27237, which hides manual changes, by title only.

## Why it matters

This is the opposite failure from the false OutOfSync that Server-Side Diff was designed to end in [examples/argo-cd-server-side-diff-ends-false-out-of-sync-from-server-defaults](argo-cd-server-side-diff-ends-false-out-of-sync-from-server-defaults.md): a diff that reports no change when there is one. Both failures sit behind the single documented label described in [findings/argo-cd-documents-server-side-diff-as-stable-since-v3-1-0-while-the-issue-tracker-holds-many-open-bugs](../findings/argo-cd-documents-server-side-diff-as-stable-since-v3-1-0-while-the-issue-tracker-holds-many-open-bugs.md).

## Related

[entities/argo-cd](../entities/argo-cd.md), [concepts/custom-resource-definition](../concepts/custom-resource-definition.md)

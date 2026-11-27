---
title: Crossplane pull requests 7783 and 7787 say FromStruct drops managedFields on the composite resource
type: example
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-b1-recheck-kro-crossplane
    hash: ccee0efa5bdd
    ingested: 2026-11-26
aliases: []
tags: [crossplane, server-side-apply, managedfields, pull-request, issue-7453]
---

# Crossplane pull requests 7783 and 7787 say FromStruct drops managedFields on the composite resource

## Context

Issue 7453 (opened 2026-05-31, Crossplane v2.3.1 with function-go-templating) reports that a field an external controller applied to a composite resource with force-conflicts disappeared within about 100 milliseconds, and that `metadata.managedFields` was empty (`[]`). It is open with the labels `bug` and `stale`, and its only maintainer comment (2026-08-27) says "I couldn't reproduce this just now on v2.3.1". See [examples/crossplane-issue-7453-reports-an-external-ssa-writer-losing-a-field-on-a-composite-resource](crossplane-issue-7453-reports-an-external-ssa-writer-losing-a-field-on-a-composite-resource.md). [sources/research-gap-b1-recheck-kro-crossplane](../sources/research-gap-b1-recheck-kro-crossplane.md) URL: https://github.com/crossplane/crossplane/issues/7453

## What happened

Two community pull requests assume the report is a real bug. Pull request 7787 ("preserve managedFields in SSA patches", `Fixes #7453`) was last updated on 2026-08-28 and has no discussion. Pull request 7783 ("fix(composite): preserve managed fields during composition") is labeled stale, has review decision CHANGES_REQUESTED, and was updated on 2026-11-26. Both say that `FromStruct()` replaces the whole XR object map and so loses `managedFields` and breaks server-side apply ownership tracking. Neither is merged.

The v2.5.0 source does apply the XR status by replacing the XR content with the function's desired composite through `FromStruct` and then resetting identity fields, with a comment that Crossplane needs "to pass in only our fully specified intent". The dossier's reading is that this status apply goes through the status subresource and sends only status, conditions, and deletion policy, so it should not own or prune a `spec` field set by another manager. The resource-reference patch is spec-only for `resourceRefs`. The source reading therefore does not explain the reported loss of `spec.externalRef`, and it did not trace the finalizer update or claim propagation write paths.

## Lesson

The state is "reported, not reproduced by a maintainer, open", and the source reading is inconclusive and not a refutation. No cluster was run, so whether the bug is real is unverified. The existence of two competing open pull requests shows that contributors consider the `FromStruct` path suspect, which is evidence about their belief and not about the behavior. See [findings/managedfields-are-hidden-from-kubectl-output-by-default](../findings/managedfields-are-hidden-from-kubectl-output-by-default.md), [concepts/server-side-apply-and-field-ownership](../concepts/server-side-apply-and-field-ownership.md), and [entities/crossplane](../entities/crossplane.md).

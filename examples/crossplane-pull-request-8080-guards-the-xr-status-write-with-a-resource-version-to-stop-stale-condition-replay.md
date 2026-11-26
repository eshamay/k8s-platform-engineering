---
title: Crossplane pull request 8080 guards the XR status write with a resource version to stop stale condition replay
type: example
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-b1-recheck-kro-crossplane
    hash: ccee0efa5bdd
    ingested: 2026-11-26
aliases: []
tags: [crossplane, pull-request, conditions, cache, open-fix]
---

# Crossplane pull request 8080 guards the XR status write with a resource version to stop stale condition replay

## Context

Pull request 8080, "fix(composite): stop stale XR condition replay", was opened on 2026-11-20 and last updated on 2026-11-23. On 2026-11-26 it is open and unmerged, has no labels, has review decision REVIEW_REQUIRED, and its merge state is BLOCKED. Reviews so far are comments only from CodeRabbit and the author, plus one community commenter who wrote "I read through the diff but haven't run it." [[sources/research-gap-b1-recheck-kro-crossplane]] URL: https://github.com/crossplane/crossplane/pull/8080

## What happened

The body says function composition writes XR status twice, first from cached XR conditions and then with the current pass, so a lagging cache yields old conditions followed by corrections, extra watch events, and repeated reconciliation. The change moves the status apply into the reconciler and adds `resourceVersion` checks on the resource-reference patch and the final status apply, so "stale reads and concurrent writes cause a conflict and retry instead of overwriting newer status." It also clears stale optional fields such as the condition message, preserves conditions owned by other controllers, and keeps `Synced=False` when finalizer removal fails. It states `Fixes #7062` and `Fixes #8033`, and lists pull request 7159 (closed, "Fix reconciliation loop from stale cached XR conditions"), pull request 7658 (open, "Use server-side apply for composite status updates"), and a reproduction patch as related work. The author reports local kind reproductions on 2.4.2, 2.4.3, and 2.5.0-rc.1, and asks for backports because the issue goes back to 2.1.x.

## Lesson

The pull request addresses an XR-level cache-staleness bug, described in [[findings/crossplane-v2-5-0-writes-xr-status-twice-so-a-lagging-cache-can-replay-old-conditions]]. It does not target the asynchronous managed-resource case in provider-aws issue 2287, where the managed resource keeps `ReconcileSuccess` during a long operation, so it must not be presented as the fix for that case, see [[findings/upjet-and-crossplane-runtime-source-still-reports-reconcilesuccess-while-an-async-operation-runs]]. Whether the XR-level fix would change how a managed resource's `Synced` looks to its XR owner is not addressed in the pull request text. The v2.5.0 source (released 2026-11-24) still has the two-write pattern, so the pull request is not in that release. See [[entities/crossplane]].

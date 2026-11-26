---
title: "Upjet and crossplane-runtime source still reports ReconcileSuccess while an async operation runs"
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-g3-crossplane-v2
    hash: 073a1fe74dec
    ingested: 2026-11-26
aliases: []
tags: [pitfall, crossplane, upjet, conditions, async, synced]
---

# Upjet and crossplane-runtime source still reports ReconcileSuccess while an async operation runs

## Observation

The pitfall reported in provider-aws issue 2287 is not fixed. The issue (opened 2026-03-11) described `Synced=True` and `ReconcileSuccess` rewritten on every reconcile during a 60-minute MSK update, while `AsyncOperation=False` with reason `Ongoing` was set. The stale bot marked it stale on 2026-06-10 and closed it on 2026-06-25 with no maintainer comment and no linked fix. https://github.com/crossplane-contrib/provider-aws/issues/2287 [[sources/research-gap-g3-crossplane-v2]]

## Mechanism in the source

Reading `main` on 2026-11-26 explains why. In upjet's async Terraform plugin SDK client (`pkg/controller/external_async_tfpluginsdk.go`), Observe returns `ResourceExists: true, ResourceUpToDate: true` while an operation is ongoing. The crossplane-runtime managed reconciler (`pkg/reconciler/managed/reconciler.go`), on an up-to-date observation, takes the "We did not need to create, update, or delete our external resource" branch and marks `ReconcileSuccess`. Latest releases read were upjet v2.5.1 (2026-09-30) and crossplane-runtime v2.5.0 (2026-11-23). The dossier searched issues and pull requests in upjet, crossplane-runtime, and provider-aws for a change that sets `Synced=False` or otherwise surfaces in-flight async work and found none.

## Alert surface

The v2.5 managed resources docs list the upjet conditions `AsyncOperation` (reasons Finished, Ongoing) and `LastAsyncOperation` (ApplyFailure, DestroyFailure, Success) as provider-specific detail, not as an alerting recommendation. The reporter's own wording was that the condition "is not part of standard Crossplane alerting conventions". Docs and code also disagree on the status value of `AsyncOperation`, see [[findings/crossplane-v2-5-docs-and-source-disagree-on-stage-labels-condition-status-and-group-suffixes]].

## Related v2 changes

Crossplane v2.0.0 made XR and claim conditions persist `observedGeneration`. An open pull request (8080, "stop stale XR condition replay", 2026-11-20) exists but only its title was read.

## Mitigations

Poll or alert on `AsyncOperation` as well as `Synced` for upjet-based providers, and compare `observedGeneration` where it exists. Do not treat `Synced=True` as proof that no long operation is running. See [[findings/a-summary-condition-can-stay-true-while-a-long-async-operation-is-running]], [[examples/crossplane-synced-stays-true-through-a-sixty-minute-async-msk-update]], [[concepts/conditions]], and [[entities/crossplane]].

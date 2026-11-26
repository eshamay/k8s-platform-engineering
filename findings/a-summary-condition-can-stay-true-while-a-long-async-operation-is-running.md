---
title: A summary condition can stay True while a long async operation is running
type: finding
status: active
created: 2026-11-25
updated: 2026-11-26
sources:
  - id: research-conditions
    hash: 97b224c63502
    ingested: 2026-11-25
  - id: research-gap-g3-crossplane-v2
    hash: 073a1fe74dec
    ingested: 2026-11-26
aliases: []
tags: [pitfall, conditions, crossplane, async, alerting]
---

# A summary condition can stay True while a long async operation is running

## Observation

In provider-aws issue 2287, a Crossplane managed resource kept `Synced=True` through an MSK update that ran for more than 60 minutes. The Upjet-based controller reported "up to date" and crossplane-runtime replaced the pending state with `ReconcileSuccess`. Alerts on `Synced=False` never fired, and automation that polled `Synced` saw false convergence. An `AsyncOperation=False/Ongoing` condition existed but is not part of normal alert conventions. [[sources/research-conditions]] URL: https://github.com/crossplane-contrib/provider-aws/issues/2287.

## Why it matters

A summary condition is only as honest as the code that writes it. When a lower layer overwrites a pending state, every consumer built on the summary inherits the false signal, and the failure is silent because nothing flips to `False`. The report says the fix spans both upjet and crossplane-runtime, so a user of one provider cannot repair it alone. The v2.5 verification pass found no fix: the issue was closed as stale on 2026-06-25 and the current source behaves the same way, see the update below.

## Mitigations

Alert on or poll the operation-specific condition (`AsyncOperation` for Upjet providers) as well as the summary. Consumers should compare `observedGeneration` with `metadata.generation` where it is available. Controller authors should write an in-progress condition at the start of a long call instead of letting a later success path replace it. See [[examples/crossplane-synced-stays-true-through-a-sixty-minute-async-msk-update]], [[findings/misleading-readiness-and-stale-status]], [[entities/crossplane]], and [[concepts/conditions]].

## Update from the v2.5 verification pass (2026-11-26)

Provider-aws issue 2287 was marked stale on 2026-06-10 and closed on 2026-06-25 by the stale bot, with no maintainer comment and no linked fix. The mechanism is visible in upjet and crossplane-runtime source on `main`, and no change that surfaces in-flight async work was found. The docs describe `AsyncOperation` as provider detail and not as an alerting recommendation, and docs and code disagree on its status value. [[sources/research-gap-g3-crossplane-v2]] See [[findings/upjet-and-crossplane-runtime-source-still-reports-reconcilesuccess-while-an-async-operation-runs]] and [[findings/crossplane-v2-5-docs-and-source-disagree-on-stage-labels-condition-status-and-group-suffixes]].

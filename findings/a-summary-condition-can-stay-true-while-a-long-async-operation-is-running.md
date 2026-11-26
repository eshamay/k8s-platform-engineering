---
title: A summary condition can stay True while a long async operation is running
type: finding
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-conditions
    hash: 97b224c63502
    ingested: 2026-11-25
aliases: []
tags: [pitfall, conditions, crossplane, async, alerting]
---

# A summary condition can stay True while a long async operation is running

## Observation

In provider-aws issue 2287, a Crossplane managed resource kept `Synced=True` through an MSK update that ran for more than 60 minutes. The Upjet-based controller reported "up to date" and crossplane-runtime replaced the pending state with `ReconcileSuccess`. Alerts on `Synced=False` never fired, and automation that polled `Synced` saw false convergence. An `AsyncOperation=False/Ongoing` condition existed but is not part of normal alert conventions. [[sources/research-conditions]] URL: https://github.com/crossplane-contrib/provider-aws/issues/2287.

## Why it matters

A summary condition is only as honest as the code that writes it. When a lower layer overwrites a pending state, every consumer built on the summary inherits the false signal, and the failure is silent because nothing flips to `False`. The report says the fix spans both upjet and crossplane-runtime, so a user of one provider cannot repair it alone. The dossier did not confirm the fix status or the behavior in Crossplane v2.

## Mitigations

Alert on or poll the operation-specific condition (`AsyncOperation` for Upjet providers) as well as the summary. Consumers should compare `observedGeneration` with `metadata.generation` where it is available. Controller authors should write an in-progress condition at the start of a long call instead of letting a later success path replace it. See [[examples/crossplane-synced-stays-true-through-a-sixty-minute-async-msk-update]], [[findings/misleading-readiness-and-stale-status]], [[entities/crossplane]], and [[concepts/conditions]].

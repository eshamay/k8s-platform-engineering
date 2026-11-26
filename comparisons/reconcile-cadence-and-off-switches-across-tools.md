---
title: Reconcile cadence and off-switches across tools
type: comparison
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-level-triggered-vs-edge-triggered
    hash: 27a34aa0de59
    ingested: 2026-11-25
aliases: []
tags: [comparison, reconciliation, intervals, backoff]
---

# Reconcile cadence and off-switches across tools

Each tool exposes the cost of level-triggering through its own cadence and pause controls. The values below are as stated on the fetched pages and may change by version. [[sources/research-level-triggered-vs-edge-triggered]]

| Behavior | [[entities/flux]] | [[entities/argo-cd]] | [[entities/config-connector]] | [[entities/crossplane]] | [[entities/controller-runtime]] |
|---|---|---|---|---|---|
| Periodic cadence | `.spec.interval`, minimum 60s | `timeout.reconciliation`, 120s plus up to 60s jitter | Periodic once UpToDate, tunable by annotation | Poll interval, default not confirmed | `RequeueAfter` set by the author |
| Event-triggered reconcile | Source revision or metadata change | Git change seen on poll | Not described | Not described | Watch events enqueue a key |
| Failure handling | `.spec.retryInterval` | No retry of same commit and parameters | Exponential backoff capped at 2 minutes | Not described | Exponential backoff, `TerminalError` stops |
| Pause or disable | `.spec.suspend` | Self-heal toggle, automated sync off | Interval "0" | Pause annotation, Observe-only policy | Not applicable |
| Unfixable fields | `.spec.force` recreates on immutable conflicts | Not described | Unreadable fields only on spec change, recreate for immutables | Not described | Not applicable |

## Reading the table

All five treat the periodic pass as the safety net and events as a latency optimization, which is the hybrid in [[decisions/events-as-hints-state-as-truth]]. They differ in who is expected to intervene when reconciliation fails: Argo CD waits for a new revision, while Config Connector and controller-runtime keep retrying with backoff. See [[findings/failure-retry-loops-and-backoff]], [[findings/cost-of-constant-reconciliation]], [[findings/continuous-loops-override-intentional-changes]], and [[comparisons/flux-versus-argo-cd-drift-and-prune-defaults]].

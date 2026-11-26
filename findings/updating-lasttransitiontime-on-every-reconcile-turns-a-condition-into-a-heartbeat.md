---
title: Updating lastTransitionTime on every reconcile turns a condition into a heartbeat
type: finding
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-conditions
    hash: 97b224c63502
    ingested: 2026-11-25
aliases: []
tags: [pitfall, conditions, status-writes, api-load]
---

# Updating lastTransitionTime on every reconcile turns a condition into a heartbeat

## Observation

A controller-author tutorial lists bumping `lastTransitionTime` on every loop as a pitfall, alongside vague messages, too many conditions, inconsistent types across CRDs, and a missing `observedGeneration`. The tutorial says the practice breaks the meaning of the field and adds API traffic. [[sources/research-conditions]] URL: https://oneuptime.com/blog/post/2026-02-09-crd-status-conditions-conventions/view. The source is a secondary vendor blog, so treat it as explanatory evidence.

## Why it matters

`lastTransitionTime` is meant to record when a condition's status last changed, which lets a reader judge how long an object has been in a state. A heartbeat destroys that information. Each unnecessary status write also adds API traffic, which the tutorial names as a cost. The KEP that standardized conditions makes `lastTransitionTime` required for the same reason: consumers need it to be meaningful.

## Mitigations

Use the shared helpers from KEP-1623 (`SetStatusCondition` and `FindStatusCondition`) and write status only when a condition actually changes; the dossier does not describe the helpers' exact timestamp behavior. Evaluate conditions on every reconcile, but compare before writing. See [[findings/status-writes-through-the-main-resource-retrigger-reconcile-loops]], [[findings/cost-of-constant-reconciliation]], [[concepts/conditions]], and [[findings/self-triggered-reconcile-loops-generate-their-own-events]].

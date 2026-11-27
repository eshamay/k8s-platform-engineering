---
title: Synced False with Ready True is a silent failure where drift correction stops
type: finding
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-managed-resource
    hash: 09ca2f9dcdc6
    ingested: 2026-11-25
aliases: []
tags: [pitfall, crossplane, conditions, synced, ready, drift]
---

# Synced False with Ready True is a silent failure where drift correction stops

## Observation

A [concepts/managed-resource](../concepts/managed-resource.md) carries two independent conditions. `Ready` says whether the external resource is usable, and `Synced` says whether the last reconcile succeeded. The OnCallReady lesson tabulates their combinations and singles out one: "Synced False with Ready True means the thing exists but Crossplane can no longer manage it." The real resource keeps working and applications keep running, but drift is no longer corrected and changes to the spec are not applied. The lesson names expired credentials and removed permissions as typical causes. URL: https://oncallready.dev/learn/platform-engineering-backstage-and-crossplane/managed-resources-synced-ready-external-names-and-policies/. [sources/research-managed-resource](../sources/research-managed-resource.md)

## Why it matters

Nothing user-visible breaks, so the failure can last until someone needs a change or an outside edit goes uncorrected. Teams that alert only on `Ready=False` will not notice it. The same lesson says errors should be read from the right end of the message, because upjet-generated providers wrap them, and that error prefixes (connect, observe, create, update, delete failed) show which phase failed.

## Mitigations

Alert on persistent `Synced=False` and not only on `Ready=False`, and read the error prefix to find the failing phase. The opposite case also exists, where `Synced` stays `True` during a long asynchronous update, see [findings/a-summary-condition-can-stay-true-while-a-long-async-operation-is-running](a-summary-condition-can-stay-true-while-a-long-async-operation-is-running.md). For the condition vocabulary see [concepts/conditions](../concepts/conditions.md), [findings/misleading-readiness-and-stale-status](misleading-readiness-and-stale-status.md), and [examples/crossplane-database-claim-reports-synced-and-ready](../examples/crossplane-database-claim-reports-synced-and-ready.md).

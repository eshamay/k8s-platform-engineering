---
title: Argo CD issue 18151 the 2.11 upgrade raised the Application patch rate on every cluster
type: example
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-g1-operator-loop-failures
    hash: baca2cdf965d
    ingested: 2026-11-26
aliases: [Argo CD issue 18151]
tags: [argo-cd, reconcile-loop, patch-rate, upgrade, unexplained-cause]
---

# Argo CD issue 18151 the 2.11 upgrade raised the Application patch rate on every cluster

## Scenario

On 2024-05-09 a reporter, diranged, wrote that after upgrading to Argo CD 2.11 the application controller's PATCH rate to Application objects jumped across about 10 clusters. The reporter rolled back to 2.10.9 and reproduced the jump again on retry, and the issue was closed on 2024-08-01. [sources/research-gap-g1-operator-loop-failures](../sources/research-gap-g1-operator-loop-failures.md) URL: https://github.com/argoproj/argo-cd/issues/18151

## What happened

The reporter's first comment says "We're reverting back to `2.10.9`... but this is happening on every cluster we have across the board." The reporter suspected a comparison of duplicate `valueFiles` entries (pull request 18061). Later comments, from 2024-06-14, report that custom Lua health checks on Crossplane resources made updates much more frequent, about every second or 300 ms, and that the controller saw a spurious diff in `needRefreshAppStatus` and `status.sync.comparedTo`. Another user, PaulFarver, traced a similar storm to a stale `.path` left in `status.sync.comparedTo` after switching a source from a Git path to a Helm chart. These are user diagnoses and not maintainer-confirmed. No single root cause or fix was confirmed, so the wiki records only the symptom.

## Why it belongs here

It is a widely reproduced write storm with an unproven cause, which is a caution against treating any one of the diagnoses as settled.

## Related

[entities/argo-cd](../entities/argo-cd.md), [findings/self-triggered-reconcile-loops-generate-their-own-events](../findings/self-triggered-reconcile-loops-generate-their-own-events.md), [findings/diff-is-not-apply-server-defaults-look-like-drift](../findings/diff-is-not-apply-server-defaults-look-like-drift.md)

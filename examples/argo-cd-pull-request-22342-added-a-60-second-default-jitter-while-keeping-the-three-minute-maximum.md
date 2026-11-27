---
title: Argo CD pull request 22342 added a 60 second default jitter while keeping the three minute maximum
type: example
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-b1-recheck-capi-argocd
    hash: 832b86e20750
    ingested: 2026-11-26
aliases: [argo cd pr 22342]
tags: [argo-cd, interval, jitter, defaults, version-drift]
---

# Argo CD pull request 22342 added a 60 second default jitter while keeping the three minute maximum

## Scenario

Argo CD polls Git for each Application on the `timeout.reconciliation` interval. Through v2.4.0 and v2.5.0 that interval was a flat 180 seconds, and many Applications refreshing together can spike the refresh queue. The v3.0.0 `argocd-cm.yaml` documents the jitter key as spreading refreshes because "the periodic refresh for each application can cause a spike in the refresh queue". [sources/research-gap-b1-recheck-capi-argocd](../sources/research-gap-b1-recheck-capi-argocd.md)

## How it works

Pull request 22342, "chore!: add 60s default jitter" (merged 2025-03-13), changed the defaults. The v3.0.0 manifest reads "Two minutes by default with additional jitter" with `timeout.reconciliation.jitter: 60s`. The pull request body says the change is absent from the 2.14 to 3.0 migration guide "because the maximum default is the same (at least every 3 minutes)", and the upgrade note searched has no polling entry. The base value fell from 180 to 120 seconds, so one pass now lands between 120 and 180 seconds. URL: https://github.com/argoproj/argo-cd/pull/22342

## Lesson

The stated intent in the primary text is to keep the ceiling. The reason for lowering the base is not stated in the pull request title, body, upgrade note, or issue search. The linked issue and review comments were not opened, so a fuller rationale may exist there. See [findings/argo-cd-changed-its-default-polling-from-a-flat-180-seconds-to-120-seconds-plus-60-seconds-of-jitter-in-v3-0-and-some-docs-still-say-three-minutes](../findings/argo-cd-changed-its-default-polling-from-a-flat-180-seconds-to-120-seconds-plus-60-seconds-of-jitter-in-v3-0-and-some-docs-still-say-three-minutes.md) and [entities/argo-cd](../entities/argo-cd.md).

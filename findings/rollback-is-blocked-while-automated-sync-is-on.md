---
title: Rollback is blocked while automated sync is on
type: finding
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-gitops-pull-based-delivery
    hash: 335ba8f50b2b
    ingested: 2026-11-25
aliases: []
tags: [pitfall, gitops, argo-cd, rollback]
---

# Rollback is blocked while automated sync is on

## Observation

Argo CD's automated sync policy blocks rollback while automation is enabled, because a rollback would put the live state out of line with Git and the controller would immediately re-sync it. A repeated sync of the same commit is also not retried unless self-heal applies, and syncs occur only when the application is OutOfSync. The fix path is therefore a Git revert, not a button in the UI. [[sources/research-gitops-pull-based-delivery]]

## Why it matters

Under a pull model Git is the only legitimate writer, so an emergency rollback has to go through the same commit, review, and fetch path as any change. Teams used to a fast imperative rollback during an incident may find the delay surprising. The interval (about 120 seconds plus up to 60 seconds of jitter) adds latency unless a webhook triggers the refresh.

## Mitigation

Plan for a Git revert as the rollback mechanism, configure webhooks for faster pickup, and keep a documented procedure for temporarily disabling automated sync. See [[decisions/staged-adoption-of-automated-drift-correction]] for adopting automation in stages.

## Related

[[entities/argo-cd]], [[findings/continuous-loops-override-intentional-changes]], [[concepts/gitops-pull-based-delivery]]

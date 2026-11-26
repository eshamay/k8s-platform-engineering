---
title: Cluster API v1.14.0 lists four breaking changes and schedules v1beta1 and Docker removals
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-g1-other-tool-pitfalls
    hash: a942f0ae1b1b
    ingested: 2026-11-26
aliases: []
tags: [cluster-api, upgrade, breaking-changes, v1beta1, webhooks, release-notes]
---

# Cluster API v1.14.0 lists four breaking changes and schedules v1beta1 and Docker removals

## Observation

The Cluster API v1.14.0 release (published 2026-08-11) lists "4 breaking changes". They include a controller-runtime v0.24 bump and "Fix version validation in webhooks" (PR 13874, merged 2026-07-03), which tightens validation that had allowed invalid pre-release or build tags. The same notes say v1beta1 is "on track to be unserved in CAPI v1.16" and that Docker* resources are removed in v1.15. [[sources/research-gap-g1-other-tool-pitfalls]] URL: https://github.com/kubernetes-sigs/cluster-api/releases/tag/v1.14.0

## What an operator should take from it

Manifests or tooling that carry version strings the old webhooks accepted may be rejected after the upgrade, and anything still on v1beta1 has a stated removal path. This matches the v1beta2 renames recorded in [[findings/cluster-api-v1beta1-maxunhealthy-and-unhealthyrange-are-deprecated-and-older-material-uses-the-old-names]]. The latest stable releases read were v1.14.4 and v1.13.8 (2026-11-03), and v1.15.0-rc.0 is a pre-release, so the v1.15 and v1.16 items are plans and not shipped behavior.

## Evidence limits

This is release-note text, not an incident. The dossier found no Cluster API deletion or data-loss incident from the last two years, and a minor issue (11387, the `random` MachineSet delete policy ignoring the delete-machine annotation) is a behavioral inconsistency and not an outage.

## Related

[[entities/cluster-api]], [[findings/cluster-api-clusterclass-maturity-labels-disagree-across-doc-versions-and-the-original-proposal-still-says-provisional]], [[findings/removed-beta-gvks-break-pinned-manifests-and-clients]]

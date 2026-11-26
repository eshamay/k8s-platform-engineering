---
title: A hub-and-spoke Flux user reported nightly reconciliation storms and was told to shard or tune
type: example
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-g1-named-adopters
    hash: 9f6a50098233
    ingested: 2026-11-26
aliases: [flux2 issue 5470]
tags: [flux, hub-and-spoke, sharding, reconciliation-storm, issue-report]
---

# A hub-and-spoke Flux user reported nightly reconciliation storms and was told to shard or tune

## Scenario

On 2025-08-05 an anonymous user opened flux2 issue 5470 describing a hub-and-spoke setup in which many changes merged during nightly deploy windows caused reconciliation storms. [[sources/research-gap-g1-named-adopters]] URL: https://github.com/fluxcd/flux2/issues/5470.

## Maintainer advice

A maintainer suggested several options, including "use sharding to spread out the load", a memory-backed temporary volume, and a higher `--concurrent` value. Sharding is listed as one option among three and not as the required fix.

## Why it belongs here

It is a second issue-level case, after [[examples/an-unnamed-user-with-300-namespaces-saw-5-minute-delays-and-a-flux-maintainer-cited-1k-kustomizations-in-about-3-minutes]], where sharding is recommended to a real user without a named organization. No published incident connects these storms to API Priority and Fairness, so the dossier leaves that part of the gap unanswered.

## Related

[[examples/flux-sharding-splits-reconciliation-across-label-selected-controller-instances]], [[entities/flux]], [[findings/client-side-throttling-and-server-side-apf-are-separate-layers]]

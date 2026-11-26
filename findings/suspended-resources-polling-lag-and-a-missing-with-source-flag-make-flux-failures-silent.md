---
title: Suspended resources, polling lag, and a missing --with-source flag make Flux failures silent
type: finding
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-flux-deep-dive
    hash: e640ec8046bc
    ingested: 2026-11-25
aliases: []
tags: [pitfall, flux, observability, suspend, webhooks]
---

# Suspended resources, polling lag, and a missing --with-source flag make Flux failures silent

## Observation

A practitioner blog in the dossier lists three ways Flux appears healthy while not delivering what an operator expects. A suspended resource stops reconciling and drift builds up unnoticed. Without webhook Receivers, a change waits for the next polling interval. And running `flux reconcile` without `--with-source` reconciles against the source's last fetched revision, so the command succeeds without picking up the new commit. The same post recommends alerting on `gotk_reconcile_error_total` and `gotk_suspend_status`. This is a secondary source that the vendor has not verified. [[sources/research-flux-deep-dive]]

## Mitigations

The notification controller's Alerts and Receivers are the built-in answer, and a metric alert on suspended resources catches forgotten suspensions. The Morgan Stanley team added a central dashboard from kube-state-metrics for the same reason.

## Related

[[examples/flux-notification-receivers-start-reconciliation-without-waiting-for-the-poll-interval]], [[findings/drift-detection-latency-is-the-interval]], [[findings/continuous-loops-override-intentional-changes]], [[examples/flux-kustomization-interval-and-retry-interval-set-the-loop-timing]], [[entities/flux]]

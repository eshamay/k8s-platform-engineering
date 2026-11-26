---
title: Choosing a drift check interval for external resources
type: decision
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-self-healing-and-drift-detection
    hash: 98edc2019c6b
    ingested: 2026-11-25
aliases: []
tags: [drift, intervals, api-cost, ack, kro]
---

# Choosing a drift check interval for external resources

## Status

Guidance drawn from ACK and kro documentation, not an ADR authored by this wiki. [[sources/research-self-healing-and-drift-detection]]

## Context

Every drift check on a cloud resource is an API call that costs money and counts against throttles. Argo CD's roughly 2-minute refresh is cheap because it reads the Kubernetes API and Git, but a controller that reads AWS or Google Cloud cannot afford that cadence for thousands of resources.

## Decision

Default to long intervals and shorten them only where fast correction matters. ACK defaults to about 10 hours after a resource is synced and exposes `reconcile.defaultResyncPeriod` and `reconcile.resourceResyncPeriods` for per-kind overrides, with stateful jobs as the example. kro uses 10 hours for its dynamic controller and shields the API server with a single rate-limited queue.

## Consequences

An out-of-band change can sit uncorrected for hours on the defaults, so detection latency is the interval. Shortening it raises cost and throttling risk. See [[examples/ack-resync-period-tuning-for-stateful-resources]], [[findings/drift-detection-latency-is-the-interval]], and [[findings/cost-of-constant-reconciliation]].

## Related

[[entities/ack]], [[entities/kro]], [[comparisons/drift-detection-mechanisms-across-tools]]

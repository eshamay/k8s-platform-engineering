---
title: Choosing a drift check interval for external resources
type: decision
status: active
created: 2026-11-25
updated: 2026-11-26
sources:
  - id: research-gap-o9-cadence-and-staleness
    hash: eb353fed45cd
    ingested: 2026-11-26
  - id: research-self-healing-and-drift-detection
    hash: 98edc2019c6b
    ingested: 2026-11-25
  - id: research-gap-g3-reconcile-defaults
    hash: b7be72012393
    ingested: 2026-11-26
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

## Verified defaults to weigh

The defaults a team starts from are now primary-source verified: ACK 10 hours after `ResourceSynced`, Config Connector a 10 minute mean with 0.5x to 1.5x jitter (setting 0 is irreversible), Crossplane 1 minute in core and runtime and 10 minutes in Upjet providers with a per-resource annotation and `--max-reconcile-rate` as the API budget, and Cluster API with no verified infrastructure drift period. [[sources/research-gap-g3-reconcile-defaults]] See [[findings/crossplane-poll-interval-defaults-differ-by-layer-with-one-minute-in-core-and-runtime-and-ten-minutes-in-upjet-providers]] and [[findings/setting-a-config-connector-reconcile-interval-to-zero-switches-off-drift-correction-and-the-docs-call-it-irreversible]].

## Config Connector per-kind values from the o9 dossier

Update 2026-11-26: for Config Connector the starting default is the same 10-minute mean for all three controller kinds, and three kinds (ServiceUsage `Service`, BigtableInstance, BigtableTable) ship with an hour while two ship with 0 ([[findings/config-connector-per-kind-reconcile-intervals-exist-only-as-five-terraform-service-mapping-overrides-and-262-of-267-reference-pages-show-600-seconds]]). A team lengthening the interval for one resource uses the annotation, and setting 0 stays irreversible. Page status promoted to active because its defaults are now read from primary sources. [[sources/research-gap-o9-cadence-and-staleness]]

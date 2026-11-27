---
title: Cost of constant reconciliation
type: finding
status: draft
created: 2026-11-25
updated: 2026-11-26
sources:
  - id: research-level-triggered-vs-edge-triggered
    hash: 27a34aa0de59
    ingested: 2026-11-25
  - id: research-self-healing-and-drift-detection
    hash: 98edc2019c6b
    ingested: 2026-11-25
  - id: research-gap-g3-reconcile-defaults
    hash: b7be72012393
    ingested: 2026-11-26
aliases: []
tags: [pitfall, scale, quota, level-triggered]
---

# Cost of constant reconciliation

## Observation

Level-triggering means repeated work: periodic resync, drift checks, and repeated reads. For controllers that manage external systems, every cycle can be an API call against a quota. The ApeiroRA reference architecture frames level-triggering as favoring resilience over efficiency and names the cost of constant monitoring. [sources/research-level-triggered-vs-edge-triggered](../sources/research-level-triggered-vs-edge-triggered.md)

## Interpretation

Tools turn this trade-off into tunable cadence. Config Connector documents that longer intervals reduce API quota use and exposes interval and backoff-cap annotations. Flux requires an explicit `interval` and recommends at least 60 seconds and a separate `retryInterval`. Argo CD v3.x adds up to 60 seconds of jitter to its 120 second default (v2.x used a flat 180 seconds) so that many applications do not poll at once. See [comparisons/reconcile-cadence-and-off-switches-across-tools](../comparisons/reconcile-cadence-and-off-switches-across-tools.md).

## Mitigations

Choose intervals per resource class, use event-triggered reconciles for latency, and reserve short intervals for resources where drift is costly. The dossier does not cover informer sharding or workqueue rate limits, which remain a gap. See [open-knowledge-gaps](../open-knowledge-gaps.md) and [concepts/informers-reflectors-and-workqueues](../concepts/informers-reflectors-and-workqueues.md).

## Caveat

Default values are as stated on the pages and may change by version. The Crossplane poll interval is now confirmed at 1 minute in core and runtime and 10 minutes in Upjet providers, see [findings/crossplane-poll-interval-defaults-differ-by-layer-with-one-minute-in-core-and-runtime-and-ten-minutes-in-upjet-providers](crossplane-poll-interval-defaults-differ-by-layer-with-one-minute-in-core-and-runtime-and-ten-minutes-in-upjet-providers.md).

## Related

[concepts/self-healing-and-drift-detection](../concepts/self-healing-and-drift-detection.md), [concepts/level-triggered-vs-edge-triggered](../concepts/level-triggered-vs-edge-triggered.md)

## Cloud API cost

The ACK drift-recovery page ties its 10-hour default directly to AWS API cost and throttling, and exposes per-kind overrides. kro uses the same figure with a shared rate-limited queue. Argo CD's short refresh is cheaper because it reads the Kubernetes API and Git. [sources/research-self-healing-and-drift-detection](../sources/research-self-healing-and-drift-detection.md) See [examples/ack-resync-period-tuning-for-stateful-resources](../examples/ack-resync-period-tuning-for-stateful-resources.md).

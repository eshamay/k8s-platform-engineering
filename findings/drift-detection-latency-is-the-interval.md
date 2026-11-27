---
title: Drift detection latency is the interval
type: finding
status: active
created: 2026-11-25
updated: 2026-11-26
sources:
  - id: research-gap-o9-cadence-and-staleness
    hash: eb353fed45cd
    ingested: 2026-11-26
  - id: research-eventual-consistency-and-convergence
    hash: bb35eafbd239
    ingested: 2026-11-25
  - id: research-self-healing-and-drift-detection
    hash: 98edc2019c6b
    ingested: 2026-11-25
  - id: research-gap-g3-reconcile-defaults
    hash: b7be72012393
    ingested: 2026-11-26
aliases: []
tags: [drift, intervals, api-load, trade-off]
---

# Drift detection latency is the interval

## Observation

Each tool detects drift by a different mechanism, and the worst-case detection latency equals the interval of that mechanism. Flux detects drift with a server-side apply dry run each `spec.interval`, Crossplane detects external changes with a poll interval, and Argo CD self-heals when it sees live state diverge from Git. The dossier concludes that long intervals trade API load for slower correction. URLs: https://fluxcd.io/flux/components/kustomize/kustomizations/, https://docs.crossplane.io/latest/managed-resources/managed-resources/, and https://argo-cd.readthedocs.io/en/stable/user-guide/auto_sync/. [sources/research-eventual-consistency-and-convergence](../sources/research-eventual-consistency-and-convergence.md)

## Related hazard

Flux needs `force` to change immutable fields, which recreates the object and risks downtime. See [findings/immutable-fields-and-drift-collisions](immutable-fields-and-drift-collisions.md).

## Mitigations

Choose intervals per resource class, with shorter intervals for critical objects and longer ones for slow cloud APIs, and use events such as source revision changes for low-latency reaction. See [findings/cost-of-constant-reconciliation](cost-of-constant-reconciliation.md), [comparisons/reconcile-cadence-and-off-switches-across-tools](../comparisons/reconcile-cadence-and-off-switches-across-tools.md), and [concepts/self-healing-and-drift-detection](../concepts/self-healing-and-drift-detection.md).

## Related

[concepts/eventual-consistency-and-convergence](../concepts/eventual-consistency-and-convergence.md)

## External API latencies

For external resources the interval is long: ACK defaults to about 10 hours and kro to 10 hours, against Argo CD's roughly 2 minutes plus jitter or near-immediate detection with Git webhooks. [sources/research-self-healing-and-drift-detection](../sources/research-self-healing-and-drift-detection.md) See [decisions/choosing-a-drift-check-interval-for-external-resources](../decisions/choosing-a-drift-check-interval-for-external-resources.md) and [comparisons/drift-detection-mechanisms-across-tools](../comparisons/drift-detection-mechanisms-across-tools.md).

## Verified defaults behind the latency figures

The 2026-11-26 dossier fixes the interval values behind this finding: Flux has no default and the author sets it, Argo CD v3.x polls every 120 to 180 seconds (180 seconds flat in v2.x), Crossplane polls managed resources every 1 minute by default in core and runtime and every 10 minutes in Upjet providers, Config Connector uses a 10 minute mean with jitter, and ACK resyncs after 10 hours. [sources/research-gap-g3-reconcile-defaults](../sources/research-gap-g3-reconcile-defaults.md) See [findings/the-flux-concepts-page-says-five-minutes-by-default-but-the-kustomization-and-helmrelease-references-require-the-interval-and-set-no-default](the-flux-concepts-page-says-five-minutes-by-default-but-the-kustomization-and-helmrelease-references-require-the-interval-and-set-no-default.md), [findings/argo-cd-changed-its-default-polling-from-a-flat-180-seconds-to-120-seconds-plus-60-seconds-of-jitter-in-v3-0-and-some-docs-still-say-three-minutes](argo-cd-changed-its-default-polling-from-a-flat-180-seconds-to-120-seconds-plus-60-seconds-of-jitter-in-v3-0-and-some-docs-still-say-three-minutes.md), [findings/crossplane-poll-interval-defaults-differ-by-layer-with-one-minute-in-core-and-runtime-and-ten-minutes-in-upjet-providers](crossplane-poll-interval-defaults-differ-by-layer-with-one-minute-in-core-and-runtime-and-ten-minutes-in-upjet-providers.md), and [findings/setting-a-config-connector-reconcile-interval-to-zero-switches-off-drift-correction-and-the-docs-call-it-irreversible](setting-a-config-connector-reconcile-interval-to-zero-switches-off-drift-correction-and-the-docs-call-it-irreversible.md).

## Config Connector latency bounds from the o9 dossier

Update 2026-11-26: for Config Connector the default bound is the 5 to 15 minute jittered requeue, and the hourly kinds have a bound of 30 to 90 minutes ([findings/config-connector-per-kind-reconcile-intervals-exist-only-as-five-terraform-service-mapping-overrides-and-262-of-267-reference-pages-show-600-seconds](config-connector-per-kind-reconcile-intervals-exist-only-as-five-terraform-service-mapping-overrides-and-262-of-267-reference-pages-show-600-seconds.md)). No measured latency on a live cluster exists in the sources read. [sources/research-gap-o9-cadence-and-staleness](../sources/research-gap-o9-cadence-and-staleness.md)

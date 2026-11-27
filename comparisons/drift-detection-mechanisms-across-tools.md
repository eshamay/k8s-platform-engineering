---
title: Drift detection mechanisms across tools
type: comparison
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
tags: [comparison, drift, self-healing]
---

# Drift detection mechanisms across tools

The values below are as stated on the fetched pages and may change by version. [sources/research-self-healing-and-drift-detection](../sources/research-self-healing-and-drift-detection.md)

| Tool | What is compared | Default action on drift | Cadence |
|---|---|---|---|
| [entities/flux](../entities/flux.md) Kustomization | Server-side apply dry-run against live objects | Corrects each interval unless suspended | `interval`, required with no default; 60s recommended minimum |
| [entities/flux](../entities/flux.md) HelmRelease | Dry-run apply of the stored Helm manifest | None by default (`mode: disabled`); `warn` emits events; `enabled` corrects | `.spec.interval` |
| [entities/argo-cd](../entities/argo-cd.md) | Target manifests versus live state | Marks OutOfSync; reverts only if `selfHeal` is on (about 5s delay) | 120s plus up to 60s jitter in v3.x (180s in v2.x), or Git webhook |
| [entities/crossplane](../entities/crossplane.md) | `forProvider` versus observed external state | Reverts external edits | Poll interval, 1 minute in core and runtime, 10 minutes in Upjet providers, per-resource annotation |
| [entities/ack](../entities/ack.md) | Spec versus AWS state | Re-reconciles after `ResourceSynced` | 10 hours, tunable per kind |
| [entities/kro](../entities/kro.md) | Instance graph versus live resources | Dynamic controller resync | 10 hours (36,000s) |
| [entities/config-connector](../entities/config-connector.md) | Spec versus Google Cloud state | Periodic reconcile once UpToDate | 10 minute mean with 0.5x to 1.5x jitter, per-resource annotation; per-kind Terraform and DCL values not read |
| [entities/cluster-api](../entities/cluster-api.md) | Node conditions versus timeouts | Replaces unhealthy Machines | Timeout-based, v0.4 book; core `--sync-period` of 10 minutes is a cache resync, not a drift poll |
| [entities/tofu-controller](../entities/tofu-controller.md) | Terraform state versus infrastructure | Detection-only model mentioned | Not stated |

## Reading the table

The in-cluster tools read the Kubernetes API and are cheap to run often, so their cadences are seconds to minutes. The external-API controllers pay a cloud API call for every observation, so their cadences are hours. Whether ACK's and kro's 10-hour figures are comparable mechanisms (informer resync versus explicit requeue) is not stated. See [comparisons/reconcile-cadence-and-off-switches-across-tools](reconcile-cadence-and-off-switches-across-tools.md), [comparisons/exemption-and-ignore-controls-across-tools](exemption-and-ignore-controls-across-tools.md), [findings/drift-detection-latency-is-the-interval](../findings/drift-detection-latency-is-the-interval.md), and [concepts/self-healing-and-drift-detection](../concepts/self-healing-and-drift-detection.md).

## Corrections from the reconcile-defaults dossier

Correction 2026-11-26: the cadence column now reflects primary-source reads of Flux, Argo CD, Crossplane, ACK, Cluster API, and Config Connector. The cadences are not one comparable mechanism: Flux and Argo CD read the Kubernetes API and Git, Crossplane and Config Connector poll the cloud on minutes-scale intervals, ACK resyncs after 10 hours, and Cluster API's figure is a cache resync. [sources/research-gap-g3-reconcile-defaults](../sources/research-gap-g3-reconcile-defaults.md) See [findings/the-flux-concepts-page-says-five-minutes-by-default-but-the-kustomization-and-helmrelease-references-require-the-interval-and-set-no-default](../findings/the-flux-concepts-page-says-five-minutes-by-default-but-the-kustomization-and-helmrelease-references-require-the-interval-and-set-no-default.md), [findings/argo-cd-changed-its-default-polling-from-a-flat-180-seconds-to-120-seconds-plus-60-seconds-of-jitter-in-v3-0-and-some-docs-still-say-three-minutes](../findings/argo-cd-changed-its-default-polling-from-a-flat-180-seconds-to-120-seconds-plus-60-seconds-of-jitter-in-v3-0-and-some-docs-still-say-three-minutes.md), [findings/crossplane-poll-interval-defaults-differ-by-layer-with-one-minute-in-core-and-runtime-and-ten-minutes-in-upjet-providers](../findings/crossplane-poll-interval-defaults-differ-by-layer-with-one-minute-in-core-and-runtime-and-ten-minutes-in-upjet-providers.md), [findings/the-cluster-api-sync-period-flag-is-a-cache-resync-and-not-a-poll-of-the-cloud-infrastructure](../findings/the-cluster-api-sync-period-flag-is-a-cache-resync-and-not-a-poll-of-the-cloud-infrastructure.md), and [findings/setting-a-config-connector-reconcile-interval-to-zero-switches-off-drift-correction-and-the-docs-call-it-irreversible](../findings/setting-a-config-connector-reconcile-interval-to-zero-switches-off-drift-correction-and-the-docs-call-it-irreversible.md).

## Config Connector row refined by the o9 dossier

Update 2026-11-26: the Config Connector cadence is the same 10-minute jittered requeue for the direct, Terraform-based and DCL-based controllers, because all three use one `JitteredReenqueue` function ([findings/config-connector-direct-terraform-and-dcl-reconcilers-share-one-jittered-requeue-so-the-controller-kind-alone-does-not-change-the-cadence](../findings/config-connector-direct-terraform-and-dcl-reconcilers-share-one-jittered-requeue-so-the-controller-kind-alone-does-not-change-the-cadence.md)). The drift check is the reconcile itself and not a separate poll ([findings/config-connector-has-no-separate-drift-poll-and-the-failure-backoff-annotation-works-only-for-direct-controllers-from-1-160-0](../findings/config-connector-has-no-separate-drift-poll-and-the-failure-backoff-annotation-works-only-for-direct-controllers-from-1-160-0.md)). Five Terraform-mapped kinds override the interval, and 262 of 267 generated reference pages show 600 seconds ([findings/config-connector-per-kind-reconcile-intervals-exist-only-as-five-terraform-service-mapping-overrides-and-262-of-267-reference-pages-show-600-seconds](../findings/config-connector-per-kind-reconcile-intervals-exist-only-as-five-terraform-service-mapping-overrides-and-262-of-267-reference-pages-show-600-seconds.md)). No measured drift latency on a live cluster was found. [sources/research-gap-o9-cadence-and-staleness](../sources/research-gap-o9-cadence-and-staleness.md)

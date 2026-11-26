---
title: Reconcile cadence and off-switches across tools
type: comparison
status: active
created: 2026-11-25
updated: 2026-11-26
sources:
  - id: research-gap-o9-cadence-and-staleness
    hash: eb353fed45cd
    ingested: 2026-11-26
  - id: research-gap-b1-recheck-flux-k8s
    hash: c78dc9a9635e
    ingested: 2026-11-26
  - id: research-level-triggered-vs-edge-triggered
    hash: 27a34aa0de59
    ingested: 2026-11-25
  - id: research-self-healing-and-drift-detection
    hash: 98edc2019c6b
    ingested: 2026-11-25
  - id: research-gap-g3-reconcile-defaults
    hash: b7be72012393
    ingested: 2026-11-26
  - id: research-gap-g3-argocd-capi
    hash: c3d485fa58ae
    ingested: 2026-11-26
  - id: research-gap-b1-recheck-capi-argocd
    hash: 832b86e20750
    ingested: 2026-11-26
  - id: research-gap-m5-informers-caches
    hash: 1a6a4969c0c2
    ingested: 2026-11-26
aliases: []
tags: [comparison, reconciliation, intervals, backoff]
---

# Reconcile cadence and off-switches across tools

Each tool exposes the cost of level-triggering through its own cadence and pause controls. The values below are as stated on the fetched pages and may change by version. [[sources/research-level-triggered-vs-edge-triggered]]

| Behavior | [[entities/flux]] | [[entities/argo-cd]] | [[entities/config-connector]] | [[entities/crossplane]] | [[entities/controller-runtime]] |
|---|---|---|---|---|---|
| Periodic cadence | `.spec.interval`, required with no default, 60s recommended minimum | `timeout.reconciliation`, 120s plus up to 60s jitter in v3.x (180s in v2.x) | 10 minute mean with 0.5x to 1.5x jitter, tunable by annotation | Poll interval, 1 minute in core and runtime, 10 minutes in Upjet providers | `RequeueAfter` set by the author |
| Event-triggered reconcile | Source revision or metadata change | Git change seen on poll | Not described | Not described | Watch events enqueue a key |
| Failure handling | `.spec.retryInterval` | No retry of same commit and parameters | Exponential backoff capped at 2 minutes | Not described | Exponential backoff, `TerminalError` stops |
| Pause or disable | `.spec.suspend` | Self-heal toggle, automated sync off | Interval "0" | Pause annotation, Observe-only policy | Not applicable |
| Unfixable fields | `.spec.force` recreates on immutable conflicts | Not described | Unreadable fields only on spec change, recreate for immutables | Not described | Not applicable |

## Reading the table

All five treat the periodic pass as the safety net and events as a latency optimization, which is the hybrid in [[decisions/events-as-hints-state-as-truth]]. They differ in who is expected to intervene when reconciliation fails: Argo CD waits for a new revision, while Config Connector and controller-runtime keep retrying with backoff. See [[findings/failure-retry-loops-and-backoff]], [[findings/cost-of-constant-reconciliation]], [[findings/continuous-loops-override-intentional-changes]], and [[comparisons/flux-versus-argo-cd-drift-and-prune-defaults]].

## Additional rows from the self-healing dossier

| Behavior | [[entities/ack]] | [[entities/kro]] | [[entities/cluster-api]] |
|---|---|---|---|
| Periodic cadence | 10 hours after `ResourceSynced`, per-kind overrides | 36,000 seconds (10 hours) full resync | Core `--sync-period` of 10 minutes (a cache resync, not an infrastructure poll); timeout-based health checks (v0.4 book) |
| Pause or brake | Not described | Single rate-limited queue | `unhealthyLessThanOrEqualTo` in v1beta2 (`maxUnhealthy` in v1beta1), off by default |

Flux HelmRelease drift detection is separately gated by `mode` (`disabled`, `warn`, `enabled`). [[sources/research-self-healing-and-drift-detection]] See [[comparisons/drift-detection-mechanisms-across-tools]].

## Corrections from the reconcile-defaults dossier

Correction 2026-11-26: the Flux interval is required and has no controller-side default ([[findings/the-flux-concepts-page-says-five-minutes-by-default-but-the-kustomization-and-helmrelease-references-require-the-interval-and-set-no-default]]), Argo CD changed from a flat 180 seconds to 120 seconds plus 60 seconds of jitter at v3.0.0 ([[findings/argo-cd-changed-its-default-polling-from-a-flat-180-seconds-to-120-seconds-plus-60-seconds-of-jitter-in-v3-0-and-some-docs-still-say-three-minutes]]), Crossplane's poll interval differs by layer ([[findings/crossplane-poll-interval-defaults-differ-by-layer-with-one-minute-in-core-and-runtime-and-ten-minutes-in-upjet-providers]]), the Cluster API 10 minute figure is a cache resync ([[findings/the-cluster-api-sync-period-flag-is-a-cache-resync-and-not-a-poll-of-the-cloud-infrastructure]]), and Config Connector's default mean is 10 minutes with jitter ([[findings/setting-a-config-connector-reconcile-interval-to-zero-switches-off-drift-correction-and-the-docs-call-it-irreversible]]). Config Connector's per-kind Terraform and DCL values and any Cluster API infrastructure drift cadence remain unread. [[sources/research-gap-g3-reconcile-defaults]]

## Cluster API brake, 2026-11-26

The Cluster API MachineHealthCheck brake is `remediation.triggerIf.unhealthyLessThanOrEqualTo` in v1beta2, with a default of 100 percent, so it is off until set. See [[findings/the-cluster-api-machine-health-check-short-circuit-is-off-by-default-so-remediation-is-unbounded-until-a-threshold-is-set]] and [[sources/research-gap-g3-argocd-capi]].

## Argo CD version range, 2026-11-26

The Argo CD default was 180 seconds from v2.1.0 through v2.14.0 (manifest and controller constant agree at v2.1.0 and v2.4.0) and is 120 seconds plus up to 60 seconds of jitter from v3.0.0. See [[findings/argo-cd-changed-its-default-polling-from-a-flat-180-seconds-to-120-seconds-plus-60-seconds-of-jitter-in-v3-0-and-some-docs-still-say-three-minutes]] and [[sources/research-gap-b1-recheck-capi-argocd]].

## Flux jitter and wording, 2026-11-26 recheck

Correction 2026-11-26: Flux controllers apply plus or minus 5 percent jitter to every requeue by default through `--interval-jitter-percentage` ([[findings/flux-controllers-jitter-reconcile-intervals-by-plus-or-minus-5-percent-by-default]]), so the Flux cadence is the manifest's interval with that spread, and Argo CD's jitter is a separate plus up to 60 seconds. The concepts page's five-minute sentence replaced "one minute" in a 2022 docs commit with no stated reason ([[findings/the-flux-concepts-page-five-minute-sentence-replaced-one-minute-in-an-august-2022-docs-commit-with-no-stated-reason]]). [[sources/research-gap-b1-recheck-flux-k8s]]

Note 2026-11-26: the "10-hour" cells for ACK and kro name different mechanisms. ACK's is a `RequeueAfter` after success, and kro's is the resync of its metadata informers, a replay of cached objects. Cluster API's `--sync-period` is also a cache replay. See [[findings/the-word-resync-names-three-different-mechanisms-in-client-go-kro-and-ack]]. [[sources/research-gap-m5-informers-caches]]

## Config Connector off switch and per-kind values from the o9 dossier

Update 2026-11-26: the Config Connector off switch is the annotation `cnrm.cloud.google.com/reconcile-interval-in-seconds` set to 0, which the docs call irreversible, and two kinds (ComputeSSLCertificate and ServiceIdentity) ship with 0 in their service mappings ([[findings/config-connector-per-kind-reconcile-intervals-exist-only-as-five-terraform-service-mapping-overrides-and-262-of-267-reference-pages-show-600-seconds]]). The annotation does not change failure retries, and the backoff ceiling annotation is for direct controllers only from 1.160.0 ([[findings/config-connector-has-no-separate-drift-poll-and-the-failure-backoff-annotation-works-only-for-direct-controllers-from-1-160-0]]). [[sources/research-gap-o9-cadence-and-staleness]]

---
title: "Argo CD changed its default polling from a flat 180 seconds to 120 seconds plus 60 seconds of jitter in v3.0 and some docs still say three minutes"
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-g3-reconcile-defaults
    hash: b7be72012393
    ingested: 2026-11-26
  - id: research-gap-b1-unverified-claims
    hash: d152f98abb04
    ingested: 2026-11-26
aliases: []
tags: [pitfall, argo-cd, interval, defaults, version-drift, documentation-conflict]
---

# Argo CD changed its default polling from a flat 180 seconds to 120 seconds plus 60 seconds of jitter in v3.0 and some docs still say three minutes

## Observation

The Argo CD default for `timeout.reconciliation` depends on the version, and older figures survive in newer documentation. The dossier sampled the `argocd-cm.yaml` manifest and controller source at many tags. [[sources/research-gap-g3-reconcile-defaults]]

| Versions | `timeout.reconciliation` | Jitter | Evidence |
|---|---|---|---|
| v2.5.0 to v2.14.0 | 180s | Key absent through v2.9.0, then documented as 0 from v2.10.0 | v2.5.0 manifest "timeout.reconciliation: 180s"; v2.14.0 controller "defaultAppResyncPeriod = 180" |
| v3.0.0 to v3.6.0 | 120s | 60s | v3.0.0 manifest "Two minutes by default with additional jitter."; v3.6.0 "defaultAppResyncPeriod = 120" and "defaultAppResyncPeriodJitter = 60" |

The intermediate tags sampled (v2.6.0 to v2.13.0 and v3.1.0, v3.2.0, v3.3.0, v3.5.0) match the row they sit in. Versions v2.0.0 to v2.4.0 were not sampled, and the v2.0.0 manifest did not contain the string `timeout.reconciliation` in the path checked. https://github.com/argoproj/argo-cd/blob/v3.0.0/docs/operator-manual/argocd-cm.yaml and https://github.com/argoproj/argo-cd/blob/v2.14.0/cmd/argocd-application-controller/commands/argocd_application_controller.go

## Why the old figure survives

The v3.0.0 FAQ reads "The default maximum polling interval is 3 minutes (120 seconds + 60 seconds jitter)", which restates the old three-minute number as a ceiling, so the wording looks unchanged while the mechanism differs: the base is two minutes and the jitter is random, so a polling pass lands between 120 and 180 seconds in v3.x and at a flat 180 seconds in v2.x. The v3.2.0 high-availability page was not updated and still says "The controller polls Git every 3m by default.", which is stale relative to that tag's manifest. https://github.com/argoproj/argo-cd/blob/v3.2.0/docs/operator-manual/high_availability.md

## What was not found

The change is attributed to pull request 22342 ("chore!: add 60s default jitter", merged 2025-03-13), found in a later pass. Its body says the change was left out of the 2.14 to 3.0 migration guide "because the maximum default is the same (at least every 3 minutes)", so the pull request states how it preserved the ceiling. The reason jitter was added at all is still UNVERIFIED, because the body is one sentence and the v3.0.0 upgrade notes contain no jitter text. The v3.6.3 FAQ says the default is "calculated as 120 seconds + up to 60 seconds of jitter" ([[sources/research-gap-b1-unverified-claims]]). https://github.com/argoproj/argo-cd/pull/22342 A pull request merged on 2026-07-31 (number 27683) is titled "fix(controller): treat `timeout.reconciliation=0` as disabled soft expiry", which shows that setting the value to 0 disables polling-based refresh, but only the title and state were read, not the diff. https://github.com/argoproj/argo-cd/pull/27683

## Consequences

State which version you mean when quoting an Argo CD polling default. For v3.x say 120 seconds plus up to 60 seconds of jitter, and for v2.x say 180 seconds. Git webhooks bypass the poll, so the interval bounds only the case where no webhook arrives, see [[findings/drift-detection-latency-is-the-interval]]. See [[entities/argo-cd]], [[comparisons/reconcile-cadence-and-off-switches-across-tools]], and [[comparisons/drift-detection-mechanisms-across-tools]].

---
title: Self-Healing and Drift Detection
type: concept
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: krm-platform-vocabulary
    hash: 731a6941f9db
    ingested: 2026-11-25
  - id: research-declarative-vs-imperative
    hash: 570767ba4094
    ingested: 2026-11-25
  - id: research-level-triggered-vs-edge-triggered
    hash: 27a34aa0de59
    ingested: 2026-11-25
aliases: [Drift correction]
tags: [architecture, principle]
---

# Self-Healing and Drift Detection

## Definition

The continuous process of polling external APIs to make sure live infrastructure matches what is stored in etcd, automatically reverting manual out-of-band changes made, for example, in a cloud console. [[sources/krm-platform-vocabulary]]

## Why it matters

Drift correction turns the declared spec into an enforced contract instead of a suggestion. It also creates operational tension: a human making an emergency console fix may see it reverted. Polling external APIs also costs API quota, which ties into [[concepts/informers-reflectors-and-workqueues]] and scale behavior.

## Tool behavior and escape hatches

Flux reconciles Kustomizations on an interval and reverts manual changes unless suspended, using a server-side apply dry run (minimum 60 seconds on the Kustomization page). Argo CD reverts live changes only when self-heal is enabled, and self-heal is off by default. Flux suspend is the escape hatch for incident work. Drift correction can also fight server-defaulted values, as Config Connector's legacy Merge mode showed. [[sources/research-declarative-vs-imperative]] See [[comparisons/flux-versus-argo-cd-drift-and-prune-defaults]] and [[findings/defaulting-and-drift-reconcile-loops]].

## Cadence and cost

Drift correction is level-triggered reconciliation applied repeatedly, so its latency and cost are set by intervals and jitter: Flux uses a 60 second minimum interval, Argo CD polls with 120 seconds plus up to 60 seconds of jitter, and Config Connector offers an interval annotation where longer intervals reduce API quota use. [[sources/research-level-triggered-vs-edge-triggered]] See [[comparisons/reconcile-cadence-and-off-switches-across-tools]], [[findings/cost-of-constant-reconciliation]], and [[findings/continuous-loops-override-intentional-changes]].

## Related

[[concepts/reconciliation-loop]], [[concepts/gitops-pull-based-delivery]], [[concepts/provider]]

## To research

Drift detection intervals in Flux and Crossplane, API rate-limit pitfalls, and patterns for intentionally pausing reconciliation.

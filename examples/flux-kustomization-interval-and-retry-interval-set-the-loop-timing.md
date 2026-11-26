---
title: Flux Kustomization interval and retry interval set the loop timing
type: example
status: draft
created: 2026-11-25
updated: 2026-11-26
sources:
  - id: research-reconciliation-loop
    hash: df7d66206baf
    ingested: 2026-11-25
  - id: research-gap-g3-reconcile-defaults
    hash: b7be72012393
    ingested: 2026-11-26
aliases: []
tags: [flux, reconciliation, intervals, gitops]
---

# Flux Kustomization interval and retry interval set the loop timing

## Scenario

A Flux Kustomization is a time-driven loop layered on top of watch-driven reconcilers. The Kustomization API reference defines the knobs that control when the loop runs, how it fails, and when it stops. [[sources/research-reconciliation-loop]]

## What happens

Every `spec.interval`, which is required and has a recommended minimum of 60 seconds, the controller fetches the source, builds the manifests, applies them with server-side apply, and detects drift. If a run fails, `retryInterval` sets the delay before the next attempt, and it defaults to `interval`. `timeout` bounds the build, apply, and health-check work of one run. Jitter can spread many Kustomizations so they do not align. `suspend` pauses both reconciliation and drift correction, and an annotation can request a manual reconcile. [[sources/research-reconciliation-loop]]

The loop also gates readiness. `wait` and `healthChecks` hold the Kustomization until its objects are healthy, `dependsOn` orders Kustomizations, optionally with CEL readiness expressions, `prune` removes objects that left the source, and `force` recreates objects that hit immutable-field conflicts. The dossier read only the first 100,000 of about 121,600 characters of this page. [[sources/research-reconciliation-loop]]

## Why it matters

The example shows how a platform tool turns the bare reconcile primitive into a policy with a cadence, a failure delay, a time budget, and off switches. See [[examples/flux-dependson-and-health-checks-gate-rollout]] for the ordering side.

## Related

[[entities/flux]], [[comparisons/reconcile-cadence-and-off-switches-across-tools]], [[findings/drift-detection-latency-is-the-interval]], [[concepts/reconciliation-loop]]

## Correction on the default

Correction 2026-11-26: `spec.interval` has no controller-side default, so a manifest must set it, and the 60 second figure is a recommendation that the CRD does not enforce. See [[findings/the-flux-concepts-page-says-five-minutes-by-default-but-the-kustomization-and-helmrelease-references-require-the-interval-and-set-no-default]]. [[sources/research-gap-g3-reconcile-defaults]]

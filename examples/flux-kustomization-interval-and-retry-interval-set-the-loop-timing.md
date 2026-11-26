---
title: Flux Kustomization interval and retry interval set the loop timing
type: example
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-reconciliation-loop
    hash: df7d66206baf
    ingested: 2026-11-25
aliases: []
tags: [flux, reconciliation, intervals, gitops]
---

# Flux Kustomization interval and retry interval set the loop timing

## Scenario

A Flux Kustomization is a time-driven loop layered on top of watch-driven reconcilers. The Kustomization API reference defines the knobs that control when the loop runs, how it fails, and when it stops. [[sources/research-reconciliation-loop]]

## What happens

Every `spec.interval`, with a minimum of 60 seconds, the controller fetches the source, builds the manifests, applies them with server-side apply, and detects drift. If a run fails, `retryInterval` sets the delay before the next attempt, and it defaults to `interval`. `timeout` bounds the build, apply, and health-check work of one run. Jitter can spread many Kustomizations so they do not align. `suspend` pauses both reconciliation and drift correction, and an annotation can request a manual reconcile. [[sources/research-reconciliation-loop]]

The loop also gates readiness. `wait` and `healthChecks` hold the Kustomization until its objects are healthy, `dependsOn` orders Kustomizations, optionally with CEL readiness expressions, `prune` removes objects that left the source, and `force` recreates objects that hit immutable-field conflicts. The dossier read only the first 100,000 of about 121,600 characters of this page. [[sources/research-reconciliation-loop]]

## Why it matters

The example shows how a platform tool turns the bare reconcile primitive into a policy with a cadence, a failure delay, a time budget, and off switches. See [[examples/flux-dependson-and-health-checks-gate-rollout]] for the ordering side.

## Related

[[entities/flux]], [[comparisons/reconcile-cadence-and-off-switches-across-tools]], [[findings/drift-detection-latency-is-the-interval]], [[concepts/reconciliation-loop]]

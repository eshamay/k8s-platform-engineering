---
title: GitOps reverts a hand-edited Deployment
type: example
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
tags: [gitops, drift, flux, argo-cd]
---

# GitOps reverts a hand-edited Deployment

## Scenario

Someone hand-edits a Deployment in production, for example with `kubectl edit`. The dossier describes the typical outcome: the next reconcile cycle reverts the edit, because the GitOps tool turns "Git is truth" into a repeating comparison between Git and the cluster. [[sources/research-level-triggered-vs-edge-triggered]]

## How Flux does it

The Flux Kustomization controller re-applies on `.spec.interval`, which is required and has a recommended minimum of 60 seconds, and runs a server-side apply dry run each cycle to detect drift. It also reconciles immediately when the source revision or relevant metadata changes, so events are a latency optimization on top of the interval. Setting `.spec.suspend` stops both applying and drift detection. See [[entities/flux]].

## How Argo CD does it

Argo CD compares Git manifests to live state and marks the Application OutOfSync. With automated sync and self-heal enabled it re-applies, which reverts the manual edit. Polling follows `timeout.reconciliation`, documented as 120 seconds plus up to 60 seconds of jitter in v3.x (180 seconds in v2.x, see [[findings/argo-cd-changed-its-default-polling-from-a-flat-180-seconds-to-120-seconds-plus-60-seconds-of-jitter-in-v3-0-and-some-docs-still-say-three-minutes]]). See [[entities/argo-cd]].

## Lesson

The edit is not lost through a bug, it is lost because the system is doing what a level-triggered controller does. Teams that need emergency changes must pause reconciliation first. See [[findings/continuous-loops-override-intentional-changes]], [[examples/git-driven-cluster-reconciliation-with-flux-and-argo-cd]], and [[comparisons/reconcile-cadence-and-off-switches-across-tools]].

## When the revert does not happen

A hand edit can also disable correction instead of being reverted, as in the Helm Service port case. [[sources/research-self-healing-and-drift-detection]] See [[examples/flux-helmrelease-drift-correction-blocked-by-edited-service-port]].

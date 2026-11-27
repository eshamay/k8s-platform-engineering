---
title: Flux dependsOn and health checks gate a rollout
type: example
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-eventual-consistency-and-convergence
    hash: bb35eafbd239
    ingested: 2026-11-25
aliases: []
tags: [flux, gitops, ordering, health-checks]
---

# Flux dependsOn and health checks gate a rollout

## Scenario

A platform team commits manifests to Git and Flux applies them. Some Kustomizations depend on others, for example workloads that need a CRD or an operator to exist first. The dossier describes how Flux layers explicit ordering on top of an eventually consistent cluster. [sources/research-eventual-consistency-and-convergence](../sources/research-eventual-consistency-and-convergence.md)

## How it works

A Kustomization re-reconciles at `spec.interval` with a 60-second minimum, and it uses a server-side apply dry run to detect and correct manual edits. A `dependsOn` entry makes a dependent Kustomization wait until the Kustomization it names is Ready. `wait` and `healthChecks` define what Ready means, so readiness covers the applied objects becoming healthy and not only the apply call returning. Changes to the resource generation or the source revision trigger an immediate reconcile outside the interval, and `retryInterval` controls how soon a failed attempt is retried. URL: https://fluxcd.io/flux/components/kustomize/kustomizations/.

## Lesson

Flux does not abandon eventual consistency to get ordering. It adds health-gated dependencies so that the retry-until-ready behavior happens in a controlled order instead of as a burst of transient errors. See [entities/flux](../entities/flux.md), [findings/ordering-and-dependency-failures](../findings/ordering-and-dependency-failures.md), [comparisons/ordering-models-flux-argo-cd-kro-crossplane](../comparisons/ordering-models-flux-argo-cd-kro-crossplane.md), and [examples/gitops-reverts-a-hand-edited-deployment](gitops-reverts-a-hand-edited-deployment.md).

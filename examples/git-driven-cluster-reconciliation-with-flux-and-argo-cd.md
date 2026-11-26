---
title: Git-driven cluster reconciliation with Flux and Argo CD
type: example
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-declarative-vs-imperative
    hash: 570767ba4094
    ingested: 2026-11-25
aliases: []
tags: [use-case, gitops, flux, argo-cd]
---

# Git-driven cluster reconciliation with Flux and Argo CD

## Scenario

A team wants the cluster to match a Git repository, with Git history as the audit trail and manual edits to live objects reverted automatically. Both [[entities/flux]] and [[entities/argo-cd]] serve this need. [[sources/research-declarative-vs-imperative]]

## How it works in Flux

Flux sources produce artifacts, and Kustomization and HelmRelease objects apply them. A Kustomization is reconciled on an interval, and each interval Flux runs a server-side apply dry run to detect drift and reverts manual changes unless the object is suspended. With `prune` enabled, objects removed from the source are deleted from the cluster, and `healthChecks` and `wait` gate readiness.

## How it works in Argo CD

Argo CD automated sync applies Git state when an application is OutOfSync. Pruning and self-heal are opt-in, so a team must enable them before manual changes are reverted. See [[comparisons/flux-versus-argo-cd-drift-and-prune-defaults]].

## Pitfalls

A prune setting can delete more than intended ([[findings/unintended-deletion-through-prune]]), and drift correction can fight server-defaulted values ([[findings/defaulting-and-drift-reconcile-loops]]). Flux suspend and Argo CD's blocked rollback under auto-sync are the intentional pause and override points.

## Related

[[concepts/gitops-pull-based-delivery]], [[concepts/self-healing-and-drift-detection]], [[examples/intuit-argo-cd-gitops-origin]]

---
title: Argo CD
type: entity
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-universal-control-plane
    hash: 037575049a4c
    ingested: 2026-11-25
  - id: research-declarative-vs-imperative
    hash: 570767ba4094
    ingested: 2026-11-25
aliases: [ArgoCD]
tags: [tool, gitops]
---

# Argo CD

Argo CD is a CNCF GitOps delivery tool, listed in the dossier alongside [[entities/flux]] as a controller layer that keeps the API server's contents in sync with Git. [[sources/research-universal-control-plane]]

## Ordering model

Argo CD orders a sync by phase (PreSync, Sync, PostSync), then by wave number, then by kind and name, and it advances to the next wave only when the current wave is healthy. If any resource in a wave fails, the whole sync stops and is marked failed. Flux expresses ordering differently, through `dependsOn` between objects. See [[comparisons/ordering-models-flux-argo-cd-kro-crossplane]].

## Pitfalls

Hooks run on every sync, so they must be idempotent (see [[concepts/idempotency]]). A PreSync hook can run before the ConfigMaps or Secrets it needs, and a long migration can hit a timeout while it is still running. See [[findings/ordering-and-dependency-failures]].

## Automated sync policy

Automated sync applies Git state when an application is OutOfSync. Pruning and self-heal are off by default, a failed sync is not retried for the same commit and parameters, allow-empty protection prevents pruning everything, and rollback is blocked while auto-sync is on. Multi-source applications with self-heal can trigger unexpected syncs. Intuit built Argo CD to manage deployment complexity in an auditable way. [[sources/research-declarative-vs-imperative]] See [[comparisons/flux-versus-argo-cd-drift-and-prune-defaults]], [[examples/intuit-argo-cd-gitops-origin]], and [[findings/defaulting-and-drift-reconcile-loops]].

## To research

The dossier read the sync-waves page only through a summarizing fetch. Drift detection and self-heal behavior, application sets, and multi-cluster scale were not covered. See [[open-knowledge-gaps]].

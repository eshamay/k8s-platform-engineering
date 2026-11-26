---
title: Flux2 issue 5855 reported kstatus seeing Crossplane resources without a Ready condition as ready and maintainers recommended an observedGeneration CEL expression
type: example
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-o2-flux-internals
    hash: 866650ffd3aa
    ingested: 2026-11-26
aliases: [flux2 issue 5855]
tags: [use-case, flux, crossplane, kstatus, observedgeneration, cel, incident]
---

# Flux2 issue 5855 reported kstatus seeing Crossplane resources without a Ready condition as ready and maintainers recommended an observedGeneration CEL expression

## Scenario

A Flux user reported in fluxcd/flux2 issue 5855 that Crossplane resources which lack an initial Ready condition were seen as ready by kstatus, so a Kustomization with health checks could move on before the resources had been reconciled. The issue was closed on 2026-04-21. URL: https://github.com/fluxcd/flux2/issues/5855. [[sources/research-gap-o2-flux-internals]]

## What the maintainers said

The maintainers answered that kstatus requires `observedGeneration`, and the thread says "controllers should set observedGeneration on the Ready condition". They recommended a CEL expression in `healthCheckExprs` that requires `e.observedGeneration == metadata.generation`. The reporter said the expression works but wanted Flux to handle the case itself. The dossier records the outcome as the CEL workaround and does not report a change in Flux's kstatus behavior.

## Why the example matters

It is a named case of the generic race described in [[findings/premature-readiness-in-kstatus-based-tools]] and [[findings/kstatus-treats-an-unknown-kind-without-a-ready-condition-as-always-reconciled]], this time on Crossplane resources and not Cluster API. The mitigation sits in the Flux Kustomization and not in the provider, see [[findings/flux-tracks-composite-resources-through-its-inventory-and-kstatus-or-cel-health-checks-and-documents-no-owner-reference-recipe-or-kro-guidance]]. The Flux-side fix for the same family of problems with Cluster API is in [[examples/cluster-api-readiness-gates-flux-dependents]].

## Related

[[entities/flux]], [[entities/crossplane]], [[entities/kstatus]], [[examples/restate-operator-issue-216-ready-true-before-a-statefulset-rollout-finished-let-flux-mark-the-release-healthy]]

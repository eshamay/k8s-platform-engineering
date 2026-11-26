---
title: Conditions
type: concept
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: krm-platform-vocabulary
    hash: 731a6941f9db
    ingested: 2026-11-25
  - id: research-eventual-consistency-and-convergence
    hash: bb35eafbd239
    ingested: 2026-11-25
aliases: [status.conditions]
tags: [controllers, api-machinery]
---

# Conditions

## Definition

A standardized array in `.status.conditions`, with entries such as Ready, Synced, and Healthy, that gives machine-readable status reporting across tools and CRDs. [[sources/krm-platform-vocabulary]]

## Why it matters

Conditions are the common language that lets a GitOps tool wait for health, lets a composite resource aggregate its children, and lets humans debug. They live in [[concepts/spec-status-split|status]] and are written by the [[concepts/reconciliation-loop]].

## Conditions and observedGeneration under convergence

The API conventions define the standard conditions structure and `observedGeneration`, which lets a reader tell whether a status reflects the latest spec generation. Crossplane applies the idea with separate `Synced` and `Ready` conditions. [[sources/research-eventual-consistency-and-convergence]] See [[findings/misleading-readiness-and-stale-status]] and [[examples/crossplane-database-claim-reports-synced-and-ready]].

## Related

[[concepts/eventual-consistency-and-convergence]], [[concepts/composite-resource]], [[entities/flux]]

## To research

The standard condition conventions, `observedGeneration` handling, and inconsistencies between tools.

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
aliases: [status.conditions]
tags: [controllers, api-machinery]
---

# Conditions

## Definition

A standardized array in `.status.conditions`, with entries such as Ready, Synced, and Healthy, that gives machine-readable status reporting across tools and CRDs. [[sources/krm-platform-vocabulary]]

## Why it matters

Conditions are the common language that lets a GitOps tool wait for health, lets a composite resource aggregate its children, and lets humans debug. They live in [[concepts/spec-status-split|status]] and are written by the [[concepts/reconciliation-loop]].

## Related

[[concepts/eventual-consistency-and-convergence]], [[concepts/composite-resource]], [[entities/flux]]

## To research

The standard condition conventions, `observedGeneration` handling, and inconsistencies between tools.

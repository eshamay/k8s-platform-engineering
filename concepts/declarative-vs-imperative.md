---
title: Declarative vs Imperative
type: concept
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: krm-platform-vocabulary
    hash: 731a6941f9db
    ingested: 2026-11-25
aliases: [Declarative management]
tags: [architecture, principle]
---

# Declarative vs Imperative

## Definition

Defining the desired end-state, usually as YAML in `spec`, instead of writing a step-by-step sequence of commands or scripts to reach it. [[sources/krm-platform-vocabulary]]

## Why it matters

A declared end-state gives controllers something to compare against reality, which is what makes [[concepts/reconciliation-loop]], [[concepts/self-healing-and-drift-detection]], and [[concepts/gitops-pull-based-delivery]] possible. An imperative script has no standing definition of "correct" to return to.

## Related

[[concepts/spec-status-split]], [[concepts/level-triggered-vs-edge-triggered]], [[concepts/idempotency]]

## To research

Where declarative models break down (ordering, one-shot operations, migrations) and how tools work around it.

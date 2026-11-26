---
title: Controller pattern for digital twins
type: example
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-level-triggered-vs-edge-triggered
    hash: 27a34aa0de59
    ingested: 2026-11-25
aliases: [ApeiroRA controller pattern]
tags: [controllers, non-kubernetes, reference-architecture]
---

# Controller pattern for digital twins

## Scenario

The ApeiroRA reference architecture, an EU-funded open cloud effort, recommends the controller pattern for digital-twin style systems that sit outside classic container scheduling. [[sources/research-level-triggered-vs-edge-triggered]]

## What it recommends

The page says that "Controllers continuously reconcile the actual state with the desired state, much like a PID controller adjusts the control variable to minimize error." It frames level-triggering as favoring resilience over efficiency and names the cost of constant monitoring. The dossier read this page only as a summary.

## Why it matters

It shows the level-triggered controller as a general architectural idiom rather than a Kubernetes implementation detail, which supports the claim in [[concepts/universal-control-plane]]. See also [[findings/cost-of-constant-reconciliation]] and [[concepts/level-triggered-vs-edge-triggered]].

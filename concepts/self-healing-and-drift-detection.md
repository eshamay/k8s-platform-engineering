---
title: Self-Healing and Drift Detection
type: concept
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: krm-platform-vocabulary
    hash: 731a6941f9db
    ingested: 2026-11-25
aliases: [Drift correction]
tags: [architecture, principle]
---

# Self-Healing and Drift Detection

## Definition

The continuous process of polling external APIs to make sure live infrastructure matches what is stored in etcd, automatically reverting manual out-of-band changes made, for example, in a cloud console. [[sources/krm-platform-vocabulary]]

## Why it matters

Drift correction turns the declared spec into an enforced contract instead of a suggestion. It also creates operational tension: a human making an emergency console fix may see it reverted. Polling external APIs also costs API quota, which ties into [[concepts/informers-reflectors-and-workqueues]] and scale behavior.

## Related

[[concepts/reconciliation-loop]], [[concepts/gitops-pull-based-delivery]], [[concepts/provider]]

## To research

Drift detection intervals in Flux and Crossplane, API rate-limit pitfalls, and patterns for intentionally pausing reconciliation.

---
title: Incremental GitOps adoption with manual sync and self-heal
type: example
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-self-healing-and-drift-detection
    hash: 98edc2019c6b
    ingested: 2026-11-25
aliases: []
tags: [argo-cd, gitops, adoption, self-heal, kargo]
---

# Incremental GitOps adoption with manual sync and self-heal

## Scenario

Teams adopting GitOps usually do not turn on automatic correction everywhere at once. An Akuity engineering blog (vendor material, not benchmarked) describes a split policy at https://akuity.io/blog/what-is-argo-cd-features-and-business-benefits. [[sources/research-self-healing-and-drift-detection]]

## The pattern

Stateless applications run with strict Git-as-truth: automated sync with `selfHeal` on, so manual changes are reverted. Risky production workloads stay on manual sync during adoption, so Argo CD reports drift as OutOfSync but a human decides when to apply. Detection runs every 120 seconds, or near-immediately when Git webhooks are configured. For multi-environment promotion the blog pairs Argo CD with Kargo, and for resources owned by other controllers it uses `ignoreDifferences`. Argo CD also coexists with HPA and mutating webhooks, which is why that ignore mechanism exists.

## Lesson

Detection and correction can be separated, so adoption can move from visibility to enforcement one workload class at a time. See [[decisions/staged-adoption-of-automated-drift-correction]], [[entities/argo-cd]], and [[examples/gitops-reverts-a-hand-edited-deployment]].

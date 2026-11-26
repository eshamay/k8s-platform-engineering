---
title: One mandatory Ready condition that summarizes everything is too rigid
type: finding
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-conditions
    hash: 97b224c63502
    ingested: 2026-11-25
aliases: []
tags: [pitfall, conditions, cluster-api, ready, available]
---

# One mandatory Ready condition that summarizes everything is too rigid

## Observation

Cluster API's older condition model required a `Ready` condition that summarized everything, used a custom `Severity` field, and diverged from the Kubernetes API conventions. The 2024 improvement proposal found this too rigid and replaced it with `metav1.Condition`, a separate `Available` condition, and operation conditions such as `ScalingUp` and `Remediating`. The stated reason is that "higher level abstractions in Cluster API are designed to remain operational during lifecycle operations." [[sources/research-conditions]] URL: https://github.com/kubernetes-sigs/cluster-api/blob/main/docs/proposals/20240916-improve-status-in-CAPI-resources.md.

## Why it matters

A single summary has to pick one meaning, and an object that is working but changing fits no single value. Consumers then read `Ready=False` as broken during a normal upgrade. kro takes the opposite route and lets each RGD author decide the instance `Ready`, which avoids the rigid summary but gives up uniformity. The move also costs downstream tools: Flux's kstatus checks relied on `Ready`, so Flux added CEL health checks for Cluster API resources.

## Mitigations

Publish a small set of orthogonal conditions (availability, in-progress operations) and derive any summary from them, and tell generic consumers which condition to read. See [[examples/cluster-api-adds-available-and-operation-conditions-beside-ready]], [[findings/premature-readiness-in-kstatus-based-tools]], [[comparisons/provider-fixed-versus-author-defined-condition-semantics-crossplane-versus-kro]], and [[entities/cluster-api]].

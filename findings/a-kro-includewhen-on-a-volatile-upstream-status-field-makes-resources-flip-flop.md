---
title: A kro includeWhen on a volatile upstream status field makes resources flip-flop
type: finding
status: draft
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-g3-kro
    hash: e8d7c5923d98
    ingested: 2026-11-26
aliases: []
tags: [pitfall, kro, includewhen, conditional-creation]
---

# A kro includeWhen on a volatile upstream status field makes resources flip-flop

## Observation

In a kro ResourceGraphDefinition, `includeWhen` is a list of boolean CEL expressions that decides whether a resource exists at all. Since the v0.9 KREP-008 work it may reference upstream resources as well as `schema.spec`. When a resource is skipped, "all resources that depend on it are also skipped". The conditional creation page warns that basing `includeWhen` on a volatile status field causes "the graph to flip-flop". [sources/research-gap-g3-kro](../sources/research-gap-g3-kro.md) URL: https://github.com/kubernetes-sigs/kro/blob/v0.10.0/website/docs/docs/concepts/reconciliation/01-conditional-creation.md

## Why it matters

A status field that moves up and down, such as a readiness count or a transient phase, turns the creation decision into a loop. kro creates the resource when the expression is true, deletes it when the expression turns false, and does the same for every dependent. For cloud resources that means repeated creation and deletion of real infrastructure. The v0.10.0 release notes add a related guard, a fix that raises an error on an `includeWhen` that can never resolve (PR 1448), but that fix does not detect an expression that resolves differently from one reconcile to the next.

## Mitigations

Base `includeWhen` on stable inputs, which in practice means `schema.spec` fields set by the instance author. Use `readyWhen` to hold a dependent until an upstream is healthy, because readiness gating does not delete anything. See [findings/kro-readywhen-gates-dependents-in-a-resource-graph-definition-but-only-reports-health-in-the-alpha-graph-api](kro-readywhen-gates-dependents-in-a-resource-graph-definition-but-only-reports-health-in-the-alpha-graph-api.md), [comparisons/ordering-models-flux-argo-cd-kro-crossplane](../comparisons/ordering-models-flux-argo-cd-kro-crossplane.md), and [entities/kro](../entities/kro.md).

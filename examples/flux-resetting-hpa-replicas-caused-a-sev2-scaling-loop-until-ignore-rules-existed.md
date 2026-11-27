---
title: Flux resetting HPA replicas caused a SEV2 scaling loop until ignore rules existed
type: example
status: active
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-pitfalls-and-case-studies
    hash: 9407913c2448
    ingested: 2026-11-25
aliases: [Flux drift fight]
tags: [flux, hpa, drift, ssa, ignore-rules, cert-manager, sev2]
---

# Flux resetting HPA replicas caused a SEV2 scaling loop until ignore rules existed

## Scenario

A team runs Flux against workloads scaled by an HPA and against CRDs whose `caBundle` is injected by cert-manager's cainjector. Flux's kustomize-controller periodically runs a server-side apply dry run and corrects any drift it finds. [sources/research-pitfalls-and-case-studies](../sources/research-pitfalls-and-case-studies.md)

## What happened

The HPA changed replicas and Flux reverted the field on every reconcile, and cainjector writes to the CRD were reverted the same way. The Flux blog author recounts a SEV2 in which Flux kept resetting replicas to a high value, the HPA kept lowering it, and the cluster autoscaler added and removed nodes in a loop. In the blog's words, "the two controllers ping-pong indefinitely". URL: https://fluxcd.io/blog/2026/08/ignore-rules-drift-detection/

## Fix

Flux added a Kustomization `.spec.ignore` list of JSON Pointer paths with an optional target selector. Flux strips the field from its apply payload when another server-side apply manager owns it, or adopts the live value when Flux is the sole owner. Ignored fields do not trigger reconciliation and `flux diff` honours the rules. The earlier choice was to disable drift correction for the whole object.

## Lesson

The cost is that Git changes to an ignored field are no longer applied, see [findings/ignoring-a-field-in-flux-or-argo-cd-means-git-changes-to-it-are-no-longer-applied](../findings/ignoring-a-field-in-flux-or-argo-cd-means-git-changes-to-it-are-no-longer-applied.md). The same situation in Argo CD is handled differently, see [comparisons/flux-ignore-rules-versus-argo-cd-ignoredifferences-and-force-conflicts-for-drift-fights](../comparisons/flux-ignore-rules-versus-argo-cd-ignoredifferences-and-force-conflicts-for-drift-fights.md). The Kubernetes-level view is in [examples/hpa-and-git-both-set-replicas-surface-an-ssa-conflict](hpa-and-git-both-set-replicas-surface-an-ssa-conflict.md).

## Related

[concepts/pitfalls-and-case-studies](../concepts/pitfalls-and-case-studies.md), [entities/flux](../entities/flux.md), [entities/cert-manager](../entities/cert-manager.md)

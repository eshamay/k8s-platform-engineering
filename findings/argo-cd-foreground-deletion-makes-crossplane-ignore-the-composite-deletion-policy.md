---
title: Argo CD foreground deletion makes Crossplane ignore the composite deletion policy
type: finding
status: active
created: 2026-11-25
updated: 2026-11-26
sources:
  - id: research-gap-m2-ownership-gc
    hash: 62aafaded9c0
    ingested: 2026-11-26
  - id: research-composite-resource
    hash: 8640896d06b9
    ingested: 2026-11-25
aliases: []
tags: [pitfall, crossplane, argo-cd, deletion, propagation]
---

# Argo CD foreground deletion makes Crossplane ignore the composite deletion policy

## Observation

The Crossplane composite resources page documents an alpha deletion policy with the values Background, Foreground, and Pipeline. It also warns that Argo CD deletes with foreground propagation by default, and in that case Crossplane ignores the policy and emits a warning event. The fix is the `PrunePropagationPolicy=background` sync option together with a background finalizer. A stuck Foreground or Pipeline deletion leaves the XR in Deleting until the finalizer is removed by hand. [[sources/research-composite-resource]] URL: https://docs.crossplane.io/latest/composition/composite-resources/.

## Why it matters

A team can choose Pipeline deletion to get ordered teardown, then lose that ordering silently because the GitOps tool's own propagation choice takes precedence. The ordered-teardown guarantee therefore depends on settings in two tools.

## Mitigations

Set the Argo CD sync option explicitly for Applications that host composites, and watch for the warning event. Removing a stuck finalizer by hand skips cleanup and can leak resources, see [[findings/forcing-a-finalizer-off-skips-cleanup-and-can-leak-billing-resources-or-corrupt-data]]. See [[decisions/choose-foreground-or-a-pipeline-policy-for-ordered-composite-teardown]], [[examples/crossplane-foreground-and-pipeline-deletion-policies-order-composed-resource-teardown]], and [[entities/argo-cd]]. The dossier read no Flux guidance for the same situation.

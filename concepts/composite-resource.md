---
title: Composite Resource (XR) and Resource Graph
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
aliases: [XR, Resource graph]
tags: [abstraction, crossplane, kro]
---

# Composite Resource (XR) and Resource Graph

## Definition

A higher-level, opinionated KRM object, for example a PostgreSQLInstance or WebApp, created by platform engineers. It bundles multiple underlying [[concepts/managed-resource|managed resources]] behind one simplified API. The note also uses "resource graph" for the same idea as expressed by kro. [[sources/krm-platform-vocabulary]]

## Why it matters

This is the core abstraction for internal developer platforms: application teams request a simple object while the platform team controls the details. The mapping is defined by a [[concepts/composition]]. Design questions include API shape, defaults, and validation via [[concepts/admission-webhooks-and-cel]].

## Readiness of composite resources

A composite resource reports `Synced` and `Ready`, and `Ready` becomes true only when the composition function pipeline reports that all composed resources are ready. A reconcile can be forced with the `crossplane.io/reconcile-requested-at` annotation. The page does not describe retry mechanics in detail. [[sources/research-eventual-consistency-and-convergence]] See [[examples/crossplane-database-claim-reports-synced-and-ready]].

## Related

[[entities/crossplane]], [[entities/kro]], [[concepts/owner-references-and-garbage-collection]]

## To research

Claims versus XRs, versioning of platform APIs, and status aggregation across children.

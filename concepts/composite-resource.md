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
aliases: [XR, Resource graph]
tags: [abstraction, crossplane, kro]
---

# Composite Resource (XR) and Resource Graph

## Definition

A higher-level, opinionated KRM object, for example a PostgreSQLInstance or WebApp, created by platform engineers. It bundles multiple underlying [[concepts/managed-resource|managed resources]] behind one simplified API. The note also uses "resource graph" for the same idea as expressed by kro. [[sources/krm-platform-vocabulary]]

## Why it matters

This is the core abstraction for internal developer platforms: application teams request a simple object while the platform team controls the details. The mapping is defined by a [[concepts/composition]]. Design questions include API shape, defaults, and validation via [[concepts/admission-webhooks-and-cel]].

## Related

[[entities/crossplane]], [[entities/kro]], [[concepts/owner-references-and-garbage-collection]]

## To research

Claims versus XRs, versioning of platform APIs, and status aggregation across children.

---
title: Eventual Consistency and Convergence
type: concept
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: krm-platform-vocabulary
    hash: 731a6941f9db
    ingested: 2026-11-25
aliases: [Convergence]
tags: [architecture, principle]
---

# Eventual Consistency and Convergence

## Definition

Accepting that complex systems do not update instantaneously. Instead of building a strict dependency graph up front, resources are applied concurrently and fail and retry until their dependencies exist and the system converges on the desired state. [[sources/krm-platform-vocabulary]]

## Why it matters

It explains why a first apply of a large manifest set may show transient errors that resolve on their own, and why platform tools lean on retries and [[concepts/conditions]] rather than strict ordering. It also marks a tension with tools that want explicit ordering, which is worth comparing across [[entities/flux]], [[entities/crossplane]], and [[entities/kro]].

## Related

[[concepts/level-triggered-vs-edge-triggered]], [[concepts/reconciliation-loop]], [[concepts/self-healing-and-drift-detection]]

## To research

Failure modes such as retry storms and long convergence times, and how each tool lets users express dependencies anyway.

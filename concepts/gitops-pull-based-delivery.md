---
title: GitOps (Pull-Based Delivery)
type: concept
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: krm-platform-vocabulary
    hash: 731a6941f9db
    ingested: 2026-11-25
aliases: [GitOps, Pull-based delivery]
tags: [architecture, principle, gitops]
---

# GitOps (Pull-Based Delivery)

## Definition

Using Git as the single source of truth for KRM manifests, with an in-cluster agent such as Flux pulling changes and applying them to the API server, instead of a CI pipeline pushing changes from outside. [[sources/krm-platform-vocabulary]]

## Why it matters

Pull-based delivery keeps cluster credentials inside the cluster, gives an auditable history of intent, and reuses the same reconcile mechanics as any other controller. See [[entities/flux]] for the reference implementation in this wiki.

## Related

[[concepts/declarative-vs-imperative]], [[concepts/self-healing-and-drift-detection]], [[concepts/server-side-apply-and-field-ownership]]

## To research

The OpenGitOps principles, push versus pull trade-offs, and the lifecycle trace tracked in [[open-knowledge-gaps]].

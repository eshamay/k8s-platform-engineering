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
  - id: research-declarative-vs-imperative
    hash: 570767ba4094
    ingested: 2026-11-25
  - id: research-level-triggered-vs-edge-triggered
    hash: 27a34aa0de59
    ingested: 2026-11-25
aliases: [GitOps, Pull-based delivery]
tags: [architecture, principle, gitops]
---

# GitOps (Pull-Based Delivery)

## Definition

Using Git as the single source of truth for KRM manifests, with an in-cluster agent such as Flux pulling changes and applying them to the API server, instead of a CI pipeline pushing changes from outside. [[sources/krm-platform-vocabulary]]

## Why it matters

Pull-based delivery keeps cluster credentials inside the cluster, gives an auditable history of intent, and reuses the same reconcile mechanics as any other controller. See [[entities/flux]] for the reference implementation in this wiki.

## Principles and implementations

A Red Hat interview with Intuit states the GitOps principle that desired state is declarative, versioned, immutable, pulled automatically, and continuously reconciled. Flux defines GitOps as ensuring that a given state matches a desired state declaratively defined somewhere, and Argo CD automated sync applies Git state when an application is OutOfSync. [[sources/research-declarative-vs-imperative]] See [[examples/intuit-argo-cd-gitops-origin]], [[examples/git-driven-cluster-reconciliation-with-flux-and-argo-cd]], and [[comparisons/flux-versus-argo-cd-drift-and-prune-defaults]].

## Level-triggered reconciliation in GitOps tools

GitOps tools turn "Git is truth" into a repeating comparison between Git and the cluster, with interval polling as the safety net and source-change events as a latency optimization. [[sources/research-level-triggered-vs-edge-triggered]] See [[examples/gitops-reverts-a-hand-edited-deployment]] and [[comparisons/reconcile-cadence-and-off-switches-across-tools]].

## Related

[[concepts/declarative-vs-imperative]], [[concepts/self-healing-and-drift-detection]], [[concepts/server-side-apply-and-field-ownership]]

## To research

The OpenGitOps principles, push versus pull trade-offs, and the lifecycle trace tracked in [[open-knowledge-gaps]].

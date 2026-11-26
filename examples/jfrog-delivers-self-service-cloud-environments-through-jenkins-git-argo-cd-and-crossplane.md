---
title: JFrog delivers self-service cloud environments through Jenkins, Git, Argo CD, and Crossplane
type: example
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-crossplane-deep-dive
    hash: 44034359219f
    ingested: 2026-11-25
aliases: []
tags: [crossplane, argo-cd, self-service, case-study, gitops]
---

# JFrog delivers self-service cloud environments through Jenkins, Git, Argo CD, and Crossplane

## Scenario

JFrog wanted developers to get cloud development environments without waiting for approval or for another team. Its engineering blog describes a chain of four tools, each doing one job. Developers ask for resources through a Jenkins-based interface. The interface writes custom resources into Git. Argo CD syncs those resources into a cluster, and Crossplane reconciles them into real cloud resources. [[sources/research-crossplane-deep-dive]]

## How the pieces divide the work

Git is the source of truth, and Argo CD is the delivery agent that keeps the cluster in line with Git. Crossplane stays the reconciler for the cloud side, so Argo CD sees the platform-level custom resources and not every cloud resource beneath them. This is the same seam that the wiki describes under [[examples/crossplane-resources-hosted-by-argo-cd]]: two reconcile loops stacked, with the GitOps agent needing health checks that understand the custom resources it hosts. See [[findings/two-reconcile-loops-hide-status-and-drift-at-two-layers]].

## Guardrails the post describes

Predefined size classes of small, medium, and large prevent over-provisioning, because a developer chooses a class and not raw instance parameters. Tags that record the owner and an expiry support cost cleanup of forgotten environments. Role-based access control and templates provide governance. These guardrails correspond to the platform-API idea in [[concepts/composite-resource]], where the platform team exposes a few safe knobs and hides the cloud-specific details in a Composition.

## Limits of the evidence

The post is an organizational success story and lists no pitfalls, no scale figures, and no detail of the Compositions behind the size classes. It does not say whether JFrog runs Crossplane v1 or v2. Treat it as a pattern illustration and not as proof of operational cost. The wiki tracks the lack of named adopter detail in [[open-knowledge-gaps]]. See also [[examples/crossplane-adopters-build-self-service-platforms-and-service-catalogs-on-composite-resources]] and [[entities/crossplane]].

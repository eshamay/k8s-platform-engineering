---
title: "Reach spoke clusters from a central Argo CD hub or with argocd-agent pulling from the spokes"
type: decision
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-o1-argocd-flux-gitops
    hash: 3a5f956bbd5a
    ingested: 2026-11-26
aliases: []
tags: [argo-cd, multi-cluster, hub-and-spoke, decision]
---

# Reach spoke clusters from a central Argo CD hub or with argocd-agent pulling from the spokes

## Status

Open. Options and evidence only, with no recommendation, because the maturity of the pull option is UNVERIFIED.

## Context

Argo CD delivers to a fleet either from one central instance that is registered with each cluster, or with lightweight agents in the spokes. ApplicationSet generators then produce Applications across whichever clusters are known to the hub.

## Options

**Central instance reaching out.** Clusters are registered declaratively or by CLI. The Cluster generator works from "the list of clusters defined within (and managed by) Argo CD", targets local and non-local clusters unless excluded, and combines with Git, Pull Request and OCI generators, subject to the matrix and nesting limits in [[findings/applicationset-generators-have-documented-limits-matrix-takes-two-children-nesting-is-once-and-pull-request-polling-defaults-to-30-minutes]]. The hub holds credentials for every spoke.

**argocd-agent.** A Labs project in which "instead of your control plane reaching out to remote clusters, lightweight agents reach back to a central hub", with Managed and Autonomous modes. The README read had no maturity statement.

**Flux-style per-cluster controllers.** Not an Argo CD option, but the documented contrast: controllers run in each cluster, and Kustomization can also target a remote cluster with `.spec.kubeConfig`, where `configMapRef` is the recommended secret-less mode.

## Evidence gaps

No quantified scale limit for hub-and-spoke Argo CD, no adopter write-up and no argocd-agent maturity statement was found.

## Related

[[findings/argo-cd-reaches-into-registered-clusters-from-a-hub-and-the-argocd-agent-pull-model-is-a-labs-project-of-unverified-maturity]], [[comparisons/push-versus-pull-delivery]], [[entities/argo-cd]]

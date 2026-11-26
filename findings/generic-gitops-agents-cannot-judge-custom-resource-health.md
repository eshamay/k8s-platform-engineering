---
title: Generic GitOps agents cannot judge custom-resource health
type: finding
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-gitops-pull-based-delivery
    hash: 335ba8f50b2b
    ingested: 2026-11-25
aliases: []
tags: [pitfall, gitops, health, crossplane, argo-cd]
---

# Generic GitOps agents cannot judge custom-resource health

## Observation

A GitOps agent knows how to judge the health of built-in kinds such as Deployments, but it has no built-in knowledge of what "ready" means for a custom resource. Crossplane's Argo CD guide therefore prescribes custom Lua health checks for `crossplane.io` and `upbound.io` resources that read Ready, Synced, and async operation status. It also prescribes annotation-based tracking, exclusion of `ProviderConfigUsage` objects, and a higher client QPS of 300. [[sources/research-gitops-pull-based-delivery]]

## Why it matters

Health gates ordering. Argo CD advances sync waves only when a wave is healthy, and Flux's Kustomize controller assesses health for the resources it lists and can gate `dependsOn` on it. If the agent cannot read a custom resource's conditions, either everything looks healthy immediately and dependents start too early, or nothing looks healthy and the sync hangs. See [[findings/misleading-readiness-and-stale-status]] and [[findings/ordering-and-dependency-failures]].

## Mitigation

Teach the agent each kind's health semantics, using Lua checks in Argo CD or the listed health checks in a Flux Kustomization, and verify that Synced and Ready are both read. See [[examples/crossplane-resources-hosted-by-argo-cd]].

## Related

[[concepts/conditions]], [[entities/argo-cd]], [[entities/flux]], [[entities/crossplane]]

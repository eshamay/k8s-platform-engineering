---
title: Generic GitOps agents cannot judge custom-resource health
type: finding
status: active
created: 2026-11-25
updated: 2026-11-26
sources:
  - id: research-gitops-pull-based-delivery
    hash: 335ba8f50b2b
    ingested: 2026-11-25
  - id: research-spec-status-split
    hash: 598e6132ea4f
    ingested: 2026-11-25
  - id: research-gap-o3-gitops-provider-managed
    hash: 55252dbb507a
    ingested: 2026-11-26
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

## Argo CD's own statement of the problem

Argo CD's health documentation says that "CRDs do not follow a consistent or standardized status format." It uses built-in checks for core types and Lua scripts over `obj.status` for CRDs, reports Healthy, Progressing, Degraded, or Suspended, and rolls an application's health up as the worst of its immediate children. For a CRD with no script, health cannot be derived reliably. [[sources/research-spec-status-split]] See [[examples/argo-cd-rolls-up-child-health-with-lua-checks]] and [[comparisons/health-and-readiness-models-across-tools]].

## Update from the o3 dossier

Correction note, 2026-11-26: the Mitigation section above and the Crossplane guide it cites describe writing custom Lua checks. Argo CD v3.6.3 now ships built-in scripts for the `cnrm.cloud.google.com`, `services.k8s.aws`, `crossplane.io`, and `upbound.io` groups, so the need is narrower than stated, though the wildcard scripts can mishandle individual kinds, see [[findings/argo-cd-ships-built-in-lua-health-checks-for-config-connector-ack-crossplane-upbound-kro-and-cluster-api-kinds-and-an-unhealthy-provider-object-blocks-later-sync-waves]] and [[examples/argo-cd-issue-30164-config-connector-customize-kinds-stayed-progressing-because-the-health-script-did-not-handle-status-healthy]]. Flux still has no per-provider logic, see [[findings/flux-judges-provider-managed-resources-through-kstatus-or-cel-health-check-expressions-and-its-cel-cheatsheet-lists-crossplane-but-not-config-connector-or-ack]]. [[sources/research-gap-o3-gitops-provider-managed]]

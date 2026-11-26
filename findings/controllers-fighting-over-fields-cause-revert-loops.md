---
title: Controllers fighting over fields cause revert loops
type: finding
status: active
created: 2026-11-25
updated: 2026-11-26
sources:
  - id: research-self-healing-and-drift-detection
    hash: 98edc2019c6b
    ingested: 2026-11-25
  - id: research-server-side-apply-and-field-ownership
    hash: 1f12c486354e
    ingested: 2026-11-25
  - id: research-gap-g1-gitops-drift-incidents
    hash: 0a1a75f3cab5
    ingested: 2026-11-26
aliases: []
tags: [pitfall, drift, argo-cd, flux, webhooks, hpa]
---

# Controllers fighting over fields cause revert loops

## Observation

When a mutating webhook, an HPA, or an image updater rewrites a field that a GitOps tool also manages, the result is endless OutOfSync status or a revert loop. Argo CD's diffing page names the usual causes: a controller or mutating webhook altering the object after submission, controllers rewriting fields (HPA metrics ordering), non-deterministic Helm templates, and fields dropped because the API does not know them. Issue 14591 shows the pattern in practice, where argocd-image-updater rewrote child Application specs. [[sources/research-self-healing-and-drift-detection]] See [[examples/argo-cd-app-of-apps-out-of-sync-from-image-updater]].

## Interpretation

The drift is not a fault in either tool. Two writers disagree about one field, and the useful diagnostic step is to find the second writer. See [[findings/multiple-writers-on-one-object]] and [[findings/continuous-loops-override-intentional-changes]].

## Mitigations

Argo CD uses `ignoreDifferences` by JSON pointer, JQ path, or `managedFieldsManagers`. Flux uses `driftDetection.ignore` and the `kustomize.toolkit.fluxcd.io/ssa` annotation with `Ignore` or `IfNotPresent`. Crossplane scopes what it does with `managementPolicies` and can be paused. See [[comparisons/exemption-and-ignore-controls-across-tools]].

## Related

[[concepts/self-healing-and-drift-detection]], [[findings/defaulting-and-drift-reconcile-loops]], [[entities/argo-cd]], [[entities/flux]]

## The ownership view

Server-side apply makes the disagreement visible: the autoscaler owns `replicas` while Git says otherwise, and a blanket force makes the two overwrite each other. The Kubernetes maintainers' recommendation is that CD tools surface such conflicts. [[sources/research-server-side-apply-and-field-ownership]] See [[examples/hpa-and-git-both-set-replicas-surface-an-ssa-conflict]] and [[decisions/force-conflicts-or-surface-them-to-humans]].

## Addition from the GitOps incidents dossier

Flux issue 2514 (2022) shows a one-time reset and not a loop: replicas dropped to 1 on the first reconciliation over an HPA-managed Deployment and then recovered. Argo CD issue 30398 (2026) shows a permanent OutOfSync under server-side diff with an `ignoreDifferences` entry on an HPA-managed field. Neither names an organization, and no named postmortem of a revert loop with an autoscaler was found. See [[findings/handing-replicas-between-git-and-an-hpa-can-reset-the-count-or-leave-an-application-permanently-out-of-sync]] and [[sources/research-gap-g1-gitops-drift-incidents]].

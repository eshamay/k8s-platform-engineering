---
title: Argo CD
type: entity
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-universal-control-plane
    hash: 037575049a4c
    ingested: 2026-11-25
  - id: research-declarative-vs-imperative
    hash: 570767ba4094
    ingested: 2026-11-25
  - id: research-level-triggered-vs-edge-triggered
    hash: 27a34aa0de59
    ingested: 2026-11-25
  - id: research-eventual-consistency-and-convergence
    hash: bb35eafbd239
    ingested: 2026-11-25
  - id: research-self-healing-and-drift-detection
    hash: 98edc2019c6b
    ingested: 2026-11-25
  - id: research-gitops-pull-based-delivery
    hash: 335ba8f50b2b
    ingested: 2026-11-25
  - id: research-gvk-and-gvr
    hash: 5c56bb1e05a8
    ingested: 2026-11-25
  - id: research-custom-resource-definition
    hash: 6c26f7f89147
    ingested: 2026-11-25
aliases: [ArgoCD]
tags: [tool, gitops]
---

# Argo CD

Argo CD is a CNCF GitOps delivery tool, listed in the dossier alongside [[entities/flux]] as a controller layer that keeps the API server's contents in sync with Git. [[sources/research-universal-control-plane]]

## Ordering model

Argo CD orders a sync by phase (PreSync, Sync, PostSync), then by wave number, then by kind and name, and it advances to the next wave only when the current wave is healthy. If any resource in a wave fails, the whole sync stops and is marked failed. Flux expresses ordering differently, through `dependsOn` between objects. See [[comparisons/ordering-models-flux-argo-cd-kro-crossplane]].

## Pitfalls

Hooks run on every sync, so they must be idempotent (see [[concepts/idempotency]]). A PreSync hook can run before the ConfigMaps or Secrets it needs, and a long migration can hit a timeout while it is still running. See [[findings/ordering-and-dependency-failures]].

## Automated sync policy

Automated sync applies Git state when an application is OutOfSync. Pruning and self-heal are off by default, a failed sync is not retried for the same commit and parameters, allow-empty protection prevents pruning everything, and rollback is blocked while auto-sync is on. Multi-source applications with self-heal can trigger unexpected syncs. Intuit built Argo CD to manage deployment complexity in an auditable way. [[sources/research-declarative-vs-imperative]] See [[comparisons/flux-versus-argo-cd-drift-and-prune-defaults]], [[examples/intuit-argo-cd-gitops-origin]], and [[findings/defaulting-and-drift-reconcile-loops]].

## Polling interval and jitter

Argo CD polls on `timeout.reconciliation` in the `argocd-cm` ConfigMap, which the documentation gives as 120 seconds plus up to 60 seconds of jitter. With self-heal enabled it reverts manual `kubectl edit` changes, and it does not retry a failed automated sync of the same commit and parameters. [[sources/research-level-triggered-vs-edge-triggered]] See [[comparisons/reconcile-cadence-and-off-switches-across-tools]] and [[examples/gitops-reverts-a-hand-edited-deployment]].

## To research

The dossier read the sync-waves page only through a summarizing fetch. Drift detection and self-heal behavior, application sets, and multi-cluster scale were not covered. See [[open-knowledge-gaps]].

## Convergence behavior

Self-heal syncs after a default delay of about 5 seconds when live state drifts from Git, prune is off by default, retries use configurable exponential backoff with unlimited retries possible, and a failed sync of the same commit and parameters is not retried unless self-heal is on. Sync order is phase, wave, kind, then name, and each wave must be Healthy before the next. [[sources/research-eventual-consistency-and-convergence]] See [[examples/argo-cd-sync-waves-order-crds-operators-and-workloads]] and [[comparisons/retry-and-backoff-controls-across-tools]].

## Self-heal, diffing, and incremental adoption

`selfHeal` re-syncs after a default 5-second timeout, a sync runs only when the app is OutOfSync, and rollback is disallowed under automated sync. The diffing customization page explains false OutOfSync status from mutating webhooks, HPA field rewrites, non-deterministic Helm templates, and dropped unknown fields, and offers `ignoreDifferences` by JSON pointer, JQ path, or `managedFieldsManagers`. Akuity describes manual sync for risky workloads during adoption and self-heal for stateless apps. [[sources/research-self-healing-and-drift-detection]] See [[examples/argo-cd-app-of-apps-out-of-sync-from-image-updater]], [[examples/incremental-gitops-adoption-with-manual-sync-and-self-heal]], [[findings/controllers-fighting-over-fields-cause-revert-loops]], and [[comparisons/exemption-and-ignore-controls-across-tools]].

## Architecture and best practices

Argo CD has three components: an API server that serves the UI, CLI, and CI systems and handles RBAC, credentials, and webhooks; a repository server that caches Git and renders manifests; and an application controller that compares live to target state, flags OutOfSync, optionally corrects it, and runs PreSync, Sync, and PostSync hooks. Its best practices recommend separate repositories for config and application source, pinning remote Helm and Kustomize references to tags or SHAs, and leaving fields owned by other controllers (such as HPA replica counts) out of Git. Rollback is blocked while automated sync is on. Hosting Crossplane needs custom Lua health checks and annotation tracking. [[sources/research-gitops-pull-based-delivery]] See [[comparisons/flux-versus-argo-cd-architecture]], [[findings/rollback-is-blocked-while-automated-sync-is-on]], [[findings/mutable-remote-references-change-what-a-commit-renders]], and [[examples/crossplane-resources-hosted-by-argo-cd]].

## Missing CRDs and sync waves

Argo CD users who hit "no matches for kind" when a Helm or GitOps deployment applies a custom resource before its CRD reach for sync waves and for skipping dry-run on missing resources. These Argo-specific details come from search-result titles only, because the pages could not be read, so treat them as unverified. How Argo CD's own resource tracking keys resources by GVK across API version changes was not established. [[sources/research-gvk-and-gvr]] See [[comparisons/missing-crd-handling-flux-versus-argo-cd]] and [[examples/servicemonitor-no-matches-for-kind-in-helm-and-argo-cd]].

## Large CRDs and client-side apply

The ApplicationSets CRD grew large enough that its `last-applied-configuration` annotation exceeded the 262,144-byte limit under client-side apply. The reported workarounds are the `ServerSideApply=true` sync option and, for Kustomize, `ClientSideApplyMigration=false`. [[sources/research-custom-resource-definition]] See [[examples/argo-cd-applicationsets-crd-too-large-for-client-side-apply]] and [[findings/large-crds-exceed-the-client-side-apply-annotation-limit]].

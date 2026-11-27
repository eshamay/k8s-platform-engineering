---
title: Large CRDs exceed the client-side apply annotation limit
type: finding
status: draft
created: 2026-11-25
updated: 2026-11-26
sources:
  - id: research-custom-resource-definition
    hash: 6c26f7f89147
    ingested: 2026-11-25
  - id: research-server-side-apply-and-field-ownership
    hash: 1f12c486354e
    ingested: 2026-11-25
  - id: research-gap-m6-admission-crds
    hash: 7cac38f11490
    ingested: 2026-11-26
aliases: []
tags: [pitfall, crd, argo-cd, server-side-apply]
---

# Large CRDs exceed the client-side apply annotation limit

## Observation

Client-side apply records the applied object in the `last-applied-configuration` annotation, and annotations are capped at 262,144 bytes in total. A CRD with a very large generated schema can exceed that cap, and the apply then fails with an error such as "metadata.annotations may not be more than 262144 bytes." The reported case is the Argo CD ApplicationSets CRD. URL: https://github.com/argoproj/argo-helm/issues/3704. [sources/research-custom-resource-definition](../sources/research-custom-resource-definition.md)

## Mitigations in the source

The issue lists the `ServerSideApply=true` sync option and, for Kustomize, `ClientSideApplyMigration=false`. See [examples/argo-cd-applicationsets-crd-too-large-for-client-side-apply](../examples/argo-cd-applicationsets-crd-too-large-for-client-side-apply.md).

## Why it matters for platforms

Schemas generated from higher-level definitions, such as those built by Crossplane or kro, can also grow large, and Git-driven tools that default to client-side apply will hit the same wall. The dossier reports only the Argo CD case, so any claim about generated schemas is an inference. See [concepts/server-side-apply-and-field-ownership](../concepts/server-side-apply-and-field-ownership.md) and [entities/argo-cd](../entities/argo-cd.md).

## Corroboration from SSA sources

The Argo CD sync options page lists resources larger than the 262,144-byte annotation limit as a primary reason to enable `ServerSideApply=true`, and the Kluctl author reports the same problem with Prometheus operator CRDs as a driver for leaving client-side apply. [sources/research-server-side-apply-and-field-ownership](../sources/research-server-side-apply-and-field-ownership.md) See [comparisons/client-side-apply-versus-server-side-apply](../comparisons/client-side-apply-versus-server-side-apply.md) and [examples/kluctl-decides-field-level-conflicts-with-known-manager-heuristics](../examples/kluctl-decides-field-level-conflicts-with-known-manager-heuristics.md).

## Additions from the admission and CRD dossier

Argo CD's sync-options document names "Resource is too big to fit in 262144 bytes allowed annotation size." as a failure mode, and Kubernetes issue 82292 collects CRD sizes up to 1,231,093 bytes ([examples/kubernetes-issue-82292-crd-size-trouble-includes-a-5-519-crd-size-distribution-and-a-1-23-mb-strimzi-crd](../examples/kubernetes-issue-82292-crd-size-trouble-includes-a-5-519-crd-size-distribution-and-a-1-23-mb-strimzi-crd.md)). [sources/research-gap-m6-admission-crds](../sources/research-gap-m6-admission-crds.md)

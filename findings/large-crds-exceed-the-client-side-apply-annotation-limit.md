---
title: Large CRDs exceed the client-side apply annotation limit
type: finding
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-custom-resource-definition
    hash: 6c26f7f89147
    ingested: 2026-11-25
aliases: []
tags: [pitfall, crd, argo-cd, server-side-apply]
---

# Large CRDs exceed the client-side apply annotation limit

## Observation

Client-side apply records the applied object in the `last-applied-configuration` annotation, and annotations are capped at 262,144 bytes in total. A CRD with a very large generated schema can exceed that cap, and the apply then fails with an error such as "metadata.annotations may not be more than 262144 bytes." The reported case is the Argo CD ApplicationSets CRD. URL: https://github.com/argoproj/argo-helm/issues/3704. [[sources/research-custom-resource-definition]]

## Mitigations in the source

The issue lists the `ServerSideApply=true` sync option and, for Kustomize, `ClientSideApplyMigration=false`. See [[examples/argo-cd-applicationsets-crd-too-large-for-client-side-apply]].

## Why it matters for platforms

Schemas generated from higher-level definitions, such as those built by Crossplane or kro, can also grow large, and Git-driven tools that default to client-side apply will hit the same wall. The dossier reports only the Argo CD case, so any claim about generated schemas is an inference. See [[concepts/server-side-apply-and-field-ownership]] and [[entities/argo-cd]].

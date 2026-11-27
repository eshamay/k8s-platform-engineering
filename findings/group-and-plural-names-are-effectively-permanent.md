---
title: Group and plural names are effectively permanent
type: finding
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-gvk-and-gvr
    hash: 5c56bb1e05a8
    ingested: 2026-11-25
aliases: []
tags: [pitfall, naming, crd, crossplane]
---

# Group and plural names are effectively permanent

## Observation

Crossplane refuses to change an XRD's group or names after creation, and the only route is to delete and recreate. Its documentation recommends new XRDs, or conversion webhooks, for breaking schema changes. URL: https://docs.crossplane.io/latest/composition/composite-resource-definitions/. A practitioner post gives the same warning about choosing group and resource names for a CRD controller: "Changing them is quite the challenge, to say the least." URL: https://dev.to/omerxx/10-things-i-wish-id-known-before-building-a-kubernetes-crd-controller-1cl3. The post touches GVK only in passing, so treat it as a single practitioner's view. [sources/research-gvk-and-gvr](../sources/research-gvk-and-gvr.md)

## Why it matters

Every client, RBAC rule, GitOps manifest, and stored object addresses a type by its group and plural, so renaming effectively creates a different API. Because platform abstractions are public contracts, a poor name is a long-lived product defect. See [examples/xrd-and-rgd-declare-platform-gvks](../examples/xrd-and-rgd-declare-platform-gvks.md), [decisions/conversion-webhook-versus-new-xrd-for-breaking-changes](../decisions/conversion-webhook-versus-new-xrd-for-breaking-changes.md), and [concepts/gvk-and-gvr](../concepts/gvk-and-gvr.md).

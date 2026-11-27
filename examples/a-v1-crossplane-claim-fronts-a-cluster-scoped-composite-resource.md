---
title: A v1 Crossplane claim fronts a cluster-scoped composite resource
type: example
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-composite-resource
    hash: 8640896d06b9
    ingested: 2026-11-25
aliases: []
tags: [crossplane, claims, v1, namespaces, legacy]
---

# A v1 Crossplane claim fronts a cluster-scoped composite resource

## Scenario

In Crossplane v1, an application team works inside a namespace but a composite resource is cluster-scoped. The claim bridges the two, and many existing blog posts and Git repositories still use it, so readers need to recognize the pattern even though v2 removed claims for new-style XRDs. [sources/research-composite-resource](../sources/research-composite-resource.md)

## How it works

The platform team enables claims by setting `claimNames` in the XRD. The application team then creates a claim in its own namespace. Crossplane responds by creating a cluster-scoped XR and linking the two, with `spec.resourceRef` on the claim and `spec.claimRef` on the XR. The XR is composed into managed resources as usual. A claim can bind to a pre-provisioned XR, which suits slow-to-provision resources, and connection secrets are written to the claim's namespace through `writeConnectionSecretToRef`. The page says "Claims represents a set of managed resources as a single Kubernetes object, inside a namespace" and adds that claims are unnecessary if you do not use namespaces. URL: https://docs.crossplane.io/v1.20/concepts/claims/.

## Why the example matters

The claim was the v1 way to give tenants a namespaced API, and the Crossplane blog on organizational design recommends multi-tenant claim segregation as a governance pattern. In v2, XRs are namespaced themselves, so the tenant boundary moves onto the XR. See [comparisons/crossplane-v1-claims-versus-v2-namespaced-composite-resources](../comparisons/crossplane-v1-claims-versus-v2-namespaced-composite-resources.md), [findings/older-claims-and-patch-and-transform-material-no-longer-matches-current-crossplane](../findings/older-claims-and-patch-and-transform-material-no-longer-matches-current-crossplane.md), and [examples/crossplane-database-claim-reports-synced-and-ready](crossplane-database-claim-reports-synced-and-ready.md).

---
title: Missing-CRD handling, Flux versus Argo CD
type: comparison
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-gvk-and-gvr
    hash: 5c56bb1e05a8
    ingested: 2026-11-25
aliases: []
tags: [flux, argo-cd, crd-ordering]
---

# Missing-CRD handling, Flux versus Argo CD

| Dimension | Flux | Argo CD |
|---|---|---|
| Ordering mechanism | `.spec.dependsOn` between Kustomizations, with `healthChecks` and `wait` | Sync waves, and skipping dry-run on missing resources |
| Documented pattern | CRD-providing controllers in one Kustomization, custom resources in a dependent one | Reported by practitioners; not read directly |
| Evidence quality | Official documentation read by the dossier | Search-result titles only; unverified |
| Health checks | Reference resources by apiVersion and kind, so they depend on discovery | Not established |

[sources/research-gvk-and-gvr](../sources/research-gvk-and-gvr.md)

## Reading the table

Flux applies a dependent Kustomization only after the Kustomizations it names are ready: "the Kustomization is only applied after the referred Kustomizations are ready". The Argo CD column is thin because the Argo-specific posts failed to resolve, so do not treat it as a settled comparison. See [comparisons/ordering-models-flux-argo-cd-kro-crossplane](ordering-models-flux-argo-cd-kro-crossplane.md), [findings/custom-resources-applied-before-their-crd-exists](../findings/custom-resources-applied-before-their-crd-exists.md), and [examples/argo-cd-sync-waves-order-crds-operators-and-workloads](../examples/argo-cd-sync-waves-order-crds-operators-and-workloads.md).

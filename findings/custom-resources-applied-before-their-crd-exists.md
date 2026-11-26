---
title: Custom resources applied before their CRD exists
type: finding
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-gvk-and-gvr
    hash: 5c56bb1e05a8
    ingested: 2026-11-25
  - id: research-custom-resource-definition
    hash: 6c26f7f89147
    ingested: 2026-11-25
aliases: []
tags: [pitfall, crd-ordering, gitops, helm]
---

# Custom resources applied before their CRD exists

## Observation

Applying a custom resource whose CRD is missing, or present but not yet established, fails with "no matches for kind X in version Y". The dossier reports this in Helm, Argo CD, and Flux alike. Other causes listed are a wrong apiVersion and version skew between an operator and its CRDs. URL: https://oneuptime.com/blog/post/2026-08-27-fix-no-matches-kind-servicemonitor-helm-argo-cd/view. [[sources/research-gvk-and-gvr]]

## Mitigations in the sources

- Ordering: Flux separates CRD-providing controllers and custom resources into Kustomizations linked by `dependsOn`, with health checks. Argo CD users reach for sync waves and skipping dry-run on missing resources, but those Argo CD details are unverified because the pages could not be read.
- Installing a pinned, compatible CRD set first and waiting for it to become established.
- Mapper invalidation in clients, as in [[findings/stale-restmapper-hides-newly-installed-crds]].

Flux health checks reference resources by apiVersion and kind, so they also depend on discovery. See [[comparisons/missing-crd-handling-flux-versus-argo-cd]], [[findings/ordering-and-dependency-failures]], and [[examples/servicemonitor-no-matches-for-kind-in-helm-and-argo-cd]].

## Additions from the CRD dossier

Flux recommends `dependsOn` so that CRDs and their controllers exist before dependent releases, and Helm will not upgrade CRDs. [[sources/research-custom-resource-definition]] See [[findings/helm-does-not-upgrade-or-delete-crds]] and [[examples/flux-helmrelease-crd-policies-createreplace-and-dependson]].

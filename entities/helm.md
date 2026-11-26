---
title: Helm
type: entity
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-custom-resource-definition
    hash: 6c26f7f89147
    ingested: 2026-11-25
  - id: research-server-side-apply-and-field-ownership
    hash: 1f12c486354e
    ingested: 2026-11-25
aliases: [Helm charts]
tags: [tool, packaging, crd]
---

# Helm

Helm is the Kubernetes package manager whose charts are rendered and installed by tools such as Flux and Argo CD. This wiki so far covers Helm only through how it treats CRDs. [[sources/research-custom-resource-definition]]

## CRD handling

Per the Flux documentation, Helm has no native support for upgrading or deleting CRDs because of the danger of unintentional data loss. A chart can install CRDs, but later chart versions will not update them and removing a release will not delete them. Flux's HelmRelease adds `spec.install.crds` and `spec.upgrade.crds` policies to compensate. URL: https://fluxcd.io/flux/components/helm/helmreleases/. See [[findings/helm-does-not-upgrade-or-delete-crds]] and [[examples/flux-helmrelease-crd-policies-createreplace-and-dependson]].

## Related

[[entities/flux]], [[entities/argo-cd]], and [[findings/custom-resources-applied-before-their-crd-exists]].

## Server-side apply in Helm 4 (unconfirmed)

One personal blog claims that Helm 4.0.0 (November 2025) enables server-side apply by default for new releases. The dossier found no primary Helm page, so the default, the field manager name, and the handling of releases created with client-side apply are unconfirmed. [[sources/research-server-side-apply-and-field-ownership]] See [[concepts/server-side-apply-and-field-ownership]] and [[open-knowledge-gaps]].

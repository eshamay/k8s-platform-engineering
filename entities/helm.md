---
title: Helm
type: entity
status: active
created: 2026-11-25
updated: 2026-11-26
sources:
  - id: research-gap-b1-recheck-flux-k8s
    hash: c78dc9a9635e
    ingested: 2026-11-26
  - id: research-custom-resource-definition
    hash: 6c26f7f89147
    ingested: 2026-11-25
  - id: research-server-side-apply-and-field-ownership
    hash: 1f12c486354e
    ingested: 2026-11-25
  - id: research-kro-and-abstraction-models
    hash: d43d3775cbbd
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

## Server-side apply in Helm 4

One personal blog claimed that Helm 4.0.0 (November 2025) enables server-side apply by default for new releases, and the helm.sh overview now confirms it (see the recheck section at the end of this page). The field manager name and the handling of an upgrade that switches method were not read. [[sources/research-server-side-apply-and-field-ownership]] See [[concepts/server-side-apply-and-field-ownership]] and [[open-knowledge-gaps]].

## Render-time packaging and the values surface

A chart is "a collection of files that describe a related set of Kubernetes resources", made of `Chart.yaml`, `values.yaml`, `templates/`, `charts/` dependencies, and `crds/`. Helm renders Go templates with values, aggregates the objects, and installs them as one tracked release. The abstraction surface is the values file, which is free-form and is not a real API schema unless the chart adds a values schema (https://helm.sh/docs/topics/charts/, read through a summarizing fetch). Helm renders once, so drift correction depends on a GitOps tool, and a consultancy comparison says mature platforms still use Helm to install components while Crossplane provisions cloud resources and kro composes developer-facing APIs. This broader view of Helm, beyond CRD handling, is why the page moves from draft to active. See [[findings/helm-values-and-kustomize-patches-leak-the-underlying-manifests-into-the-abstraction]], [[comparisons/render-time-versus-controller-driven-abstraction-helm-kustomize-kpt-score-crossplane-kro-and-radius]], and [[entities/kustomize]]. [[sources/research-kro-and-abstraction-models]]

## Recheck of the Helm 4 server-side apply default

Correction note, 2026-11-26: the section above called the Helm 4 server-side apply default unconfirmed. The helm.sh overview now confirms that Helm 4 defaults to server-side apply when installing a new release, that upgrades and rollbacks follow the previous release's method, and that releases created by Helm 3 keep client-side apply after the upgrade. The CLI flag `--server-side` takes true, false, or auto, and helm-controller maps the choice onto `.spec.install.serverSideApply` and `.spec.upgrade.serverSideApply`. The field manager name and the behavior of an upgrade that switches method were not read. See [[findings/helm-4-defaults-to-server-side-apply-for-new-releases-and-helm-controller-keeps-the-previous-method-on-upgrade]]. [[sources/research-gap-b1-recheck-flux-k8s]]

---
title: Helm does not upgrade or delete CRDs
type: finding
status: draft
created: 2026-11-25
updated: 2026-11-26
sources:
  - id: research-custom-resource-definition
    hash: 6c26f7f89147
    ingested: 2026-11-25
  - id: research-gap-m6-admission-crds
    hash: 7cac38f11490
    ingested: 2026-11-26
aliases: []
tags: [pitfall, helm, crd, flux, lifecycle]
---

# Helm does not upgrade or delete CRDs

## Observation

The Flux documentation states that Helm has no native support for upgrading or deleting CRDs "due to unintentional data loss dangers." A chart upgrade therefore leaves an old CRD definition in place, and removing a chart leaves its CRDs behind. URL: https://fluxcd.io/flux/components/helm/helmreleases/. [sources/research-custom-resource-definition](../sources/research-custom-resource-definition.md)

## How tools respond

Flux works around the limit with `spec.install.crds` and `spec.upgrade.crds`, whose policies are Skip, Create (the default), and CreateReplace. CreateReplace updates existing CRDs but does not delete ones that were removed from the chart. Flux also recommends `dependsOn` so that CRDs and their controllers exist before dependent releases. See [examples/flux-helmrelease-crd-policies-createreplace-and-dependson](../examples/flux-helmrelease-crd-policies-createreplace-and-dependson.md). The dossier did not cover how Argo CD handles the same limit beyond the annotation-size issue in [findings/large-crds-exceed-the-client-side-apply-annotation-limit](large-crds-exceed-the-client-side-apply-annotation-limit.md).

## Related

[entities/helm](../entities/helm.md), [entities/flux](../entities/flux.md), [findings/deleting-a-crd-deletes-every-custom-resource-of-that-kind](deleting-a-crd-deletes-every-custom-resource-of-that-kind.md), and [findings/custom-resources-applied-before-their-crd-exists](custom-resources-applied-before-their-crd-exists.md).

## Additions from the admission and CRD dossier

ACK ships CRDs in each service chart, and its install doc tells users to check CRD changes before upgrades ([findings/ack-ships-one-helm-chart-per-service-with-its-crds-in-the-chart-and-no-written-api-version-policy-was-found](ack-ships-one-helm-chart-per-service-with-its-crds-in-the-chart-and-no-written-api-version-policy-was-found.md)). [sources/research-gap-m6-admission-crds](../sources/research-gap-m6-admission-crds.md)

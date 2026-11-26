---
title: Flux HelmRelease CRD policies, CreateReplace, and dependsOn
type: example
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-custom-resource-definition
    hash: 6c26f7f89147
    ingested: 2026-11-25
aliases: []
tags: [flux, helm, crd, gitops]
---

# Flux HelmRelease CRD policies, CreateReplace, and dependsOn

## Scenario

A chart ships CRDs, and the team delivers it with a Flux HelmRelease. Helm itself will not upgrade or delete CRDs, so a chart upgrade that changes a CRD would silently leave the old definition in the cluster. [[sources/research-custom-resource-definition]]

## How it works

Flux adds `spec.install.crds` and `spec.upgrade.crds` with three policies: Skip, Create (the default), and CreateReplace. CreateReplace updates CRDs that already exist, but it does not delete CRDs that a newer chart version no longer contains. For ordering, Flux recommends `dependsOn` so that the CRDs and the controllers that serve them exist before any release that creates custom resources. URL: https://fluxcd.io/flux/components/helm/helmreleases/. The documentation explains the reason for the workaround with the quote "Helm has no native support for upgrading or deleting CRDs using Helm due to unintentional data loss dangers."

## Lesson

Flux compensates for Helm's limit instead of removing it, and the retained-on-removal behavior is a deliberate safety choice that leaves orphaned CRDs for a human to clean up. The dossier read about 100,000 of 130,000 characters of the page. See [[findings/helm-does-not-upgrade-or-delete-crds]], [[findings/deleting-a-crd-deletes-every-custom-resource-of-that-kind]], [[comparisons/missing-crd-handling-flux-versus-argo-cd]], [[examples/flux-dependson-and-health-checks-gate-rollout]], and [[entities/flux]].

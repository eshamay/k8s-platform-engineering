---
title: ServiceMonitor "no matches for kind" in Helm and Argo CD deployments
type: example
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-gvk-and-gvr
    hash: 5c56bb1e05a8
    ingested: 2026-11-25
aliases: []
tags: [gvk, crd-ordering, prometheus-operator, helm, argo-cd, flux]
---

# ServiceMonitor "no matches for kind" in Helm and Argo CD deployments

## Scenario

A chart or GitOps application includes a Prometheus Operator `ServiceMonitor` custom resource. The dossier calls this the most common everyday GVK-missing scenario. [[sources/research-gvk-and-gvr]]

## What goes wrong

If the `ServiceMonitor` CRD does not exist or is not yet established when the manifest is applied, the lookup for the GVK fails with "no matches for kind". The OneUptime guide lists the causes as the CRD being absent or not yet established, a wrong apiVersion, version skew between the operator and the CRD, and GitOps applying custom resources before CRDs. Its fixes are to install a pinned, compatible CRD set first, wait for it to become established, and order the dependent resources after discovery. URL: https://oneuptime.com/blog/post/2026-08-27-fix-no-matches-kind-servicemonitor-helm-argo-cd/view. The source is a practitioner post of uneven rigor.

## How Flux solves it

Flux users place the controllers that provide CRDs in one Kustomization and the custom resources in a second Kustomization that declares `dependsOn` on the first. The dependent is applied only after the referenced Kustomization is ready. URL: https://fluxcd.io/flux/components/kustomize/kustomizations/.

## Lesson

The failure is not a bug in any one tool. It follows from discovery being a snapshot of what the cluster knows. See [[findings/custom-resources-applied-before-their-crd-exists]], [[comparisons/missing-crd-handling-flux-versus-argo-cd]], and [[examples/flux-dependson-and-health-checks-gate-rollout]].

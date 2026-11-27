---
title: Teams replace helm upgrade in CI with Flux HelmRelease objects
type: example
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-flux-deep-dive
    hash: e640ec8046bc
    ingested: 2026-11-25
aliases: []
tags: [use-case, flux, helm, helmrelease, remediation]
---

# Teams replace helm upgrade in CI with Flux HelmRelease objects

## Scenario

A Helm-heavy team runs `helm upgrade` from a CI job. A failed upgrade leaves the release in a bad state until someone notices, and nothing corrects the release if an operator edits a live object. The Flux guide for Helm users frames the alternative this way: "While the Helm client commands let you imperatively do things, Flux Helm Custom Resources let you declare what you want the Helm SDK to do automatically." [sources/research-flux-deep-dive](../sources/research-flux-deep-dive.md)

## How it works

The team declares a HelmRelease that names a chart, through a HelmChart or through `chartRef` pointing at an OCIRepository, and supplies values inline or through `valuesFrom` ConfigMaps and Secrets. The helm controller uses the Helm SDK directly, so there is no Tiller-style server in the cluster. Install and upgrade remediation can retry, roll back, or uninstall on failure, which is more automated than the CLI. Optional Helm tests run after a release, drift detection can compare the release against the cluster with a server-side dry run and ignore listed fields, and CEL health checks can judge readiness. `dependsOn` orders releases, and the CRD policy of Skip, Create, or CreateReplace covers charts that ship CRDs.

## Related

[entities/flux](../entities/flux.md), [entities/helm](../entities/helm.md), [examples/flux-helmrelease-crd-policies-createreplace-and-dependson](flux-helmrelease-crd-policies-createreplace-and-dependson.md), [examples/flux-helmrelease-drift-correction-blocked-by-edited-service-port](flux-helmrelease-drift-correction-blocked-by-edited-service-port.md), [findings/circular-dependson-chains-between-flux-resources-never-reconcile](../findings/circular-dependson-chains-between-flux-resources-never-reconcile.md), [concepts/declarative-vs-imperative](../concepts/declarative-vs-imperative.md)

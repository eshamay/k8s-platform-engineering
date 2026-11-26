---
title: Enabling the kro Graph API needs a manual CRD apply because Helm does not update CRDs on upgrade
type: finding
status: draft
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-g3-kro
    hash: e8d7c5923d98
    ingested: 2026-11-26
aliases: []
tags: [pitfall, kro, graph-api, helm, crd, alpha]
---

# Enabling the kro Graph API needs a manual CRD apply because Helm does not update CRDs on upgrade

## Observation

The `Graph` API (`kro.run/v1alpha1`, kind `Graph`) is alpha, introduced in kro v0.10.0, and off by default behind the `GraphKind` feature gate. Turning it on takes four separate steps. The Graph CRD must be applied by hand, because the Graph overview says "Helm does not install or update CRDs on `helm upgrade`". The `GraphKind` gate must be enabled. The controller needs the flags `--controller-namespace` and `--controller-service-account`. And RBAC must be in place, since Graphs apply resources by impersonating a ServiceAccount in the Graph's namespace and the chart grants the controller the `impersonate` verb in aggregation mode. [[sources/research-gap-g3-kro]] URL: https://github.com/kubernetes-sigs/kro/blob/v0.10.0/website/docs/docs/concepts/graph/01-overview.md

## Why it matters

A team that upgrades kro with Helm and flips the gate gets a controller that watches a kind whose CRD is missing or outdated. The same Helm limitation means a later kro upgrade will not refresh the Graph CRD either, so the CRD can drift from the controller version. The overview adds that Graph has "no compatibility guarantee", so the CRD can change between releases. RGD behavior is identical with the gate on or off, so the mismatch affects only Graph users, which makes it easy to miss.

## Mitigations

Apply the Graph CRD from the same release tag as the controller, and make that step part of every kro upgrade. Keep production definitions on RGDs until Graph leaves alpha, see [[findings/the-kro-in-repo-roadmap-predates-the-v0-10-0-release-and-gives-no-graph-promotion-timeline]]. This follows the general CRD-lifecycle guidance in [[concepts/crd-versioning-and-storage-migration]]. See also [[entities/kro]].

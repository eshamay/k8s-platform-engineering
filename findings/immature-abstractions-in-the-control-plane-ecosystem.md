---
title: Immature abstractions in the control plane ecosystem
type: finding
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-universal-control-plane
    hash: 037575049a4c
    ingested: 2026-11-25
  - id: research-self-healing-and-drift-detection
    hash: 98edc2019c6b
    ingested: 2026-11-25
  - id: research-composite-resource
    hash: 8640896d06b9
    ingested: 2026-11-25
aliases: []
tags: [pitfall, maturity, kro, kcp]
---

# Immature abstractions in the control plane ecosystem

## Observation

Several of the newest layers are early. kro was announced as not production-ready and its site showed version 0.10.0, so it is pre-1.0. [[entities/kcp]] is CNCF Sandbox. The Ænix distribution vision lists a small maintaining team and limited production testing as its own risks. [[sources/research-universal-control-plane]]

## Counterweight

Plain operators are flexible but costly to build and maintain, and the kro announcement cites that cost as its motivation. Whatever is built should follow the conventions: status [[concepts/conditions]], level-triggered logic, and an [[concepts/idempotency|idempotent]] reconcile. Teams adopting these tools should record the maturity level of each in their decision.

## Caveat

Maturity labels such as 0.10.0 may have changed since the dossier was written. See [[entities/kro]] and [[examples/non-container-appliances-on-the-kubernetes-api]].

## Drift handling has matured recently

A reported kro bug that drift in managed resources was not reconciled after creation was closed as completed on 2025-11-04, so drift handling in younger projects has matured recently. The issue history is unverified. [[sources/research-self-healing-and-drift-detection]] See [[entities/kro]].

## Version and API churn in composition tools

The composite resources dossier adds more maturity evidence. kro's FAQ states "kro's API is currently at `v1alpha1`," the alpha `Graph` API is disabled by default, and the kro version in third-party material (v0.9.x) differs from the docs (0.10.0). Crossplane is CNCF graduated but v2 removed native patch-and-transform, claims for new-style XRDs, and several other features, with no automated migration for v1 cluster-scoped composites. Cluster API's ClusterClass page still labels the feature experimental, though that label may be stale. [[sources/research-composite-resource]] See [[findings/crossplane-v2-removed-features-and-offers-no-automated-migration-for-v1-composites]] and [[findings/a-kro-graph-revision-that-fails-compilation-stops-all-instances-with-no-fallback]].

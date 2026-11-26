---
title: "Kubernetes docs pages disagree with the code on Mutating Admission Policy and StorageVersionMigration stage"
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-b1-recheck-flux-k8s
    hash: c78dc9a9635e
    ingested: 2026-11-26
  - id: research-gap-g3-k8s-and-controller-runtime
    hash: 2b4e3378c119
    ingested: 2026-11-26
aliases: [feature stage mismatches]
tags: [pitfall, kubernetes, documentation, feature-gates, mutating-admission-policy, storage-version-migration]
---

# Kubernetes docs pages disagree with the code on Mutating Admission Policy and StorageVersionMigration stage

## Observation

Feature stage is the claim most likely to be wrong when it is copied from one page. The dossier found four mismatches between kubernetes.io pages, KEP metadata, and the feature-gate tables. [[sources/research-gap-g3-k8s-and-controller-runtime]]

- **Mutating Admission Policy start version.** The live docs page says it "was first available in the v1.30 release", while the gate table at tag v1.36.0 starts at Alpha 1.32 (off), then Beta 1.34 (off), then GA 1.36 (on). The dossier did not resolve the conflict, so cite the gate table for alpha and beta versions.
- **StorageVersionMigration task page header.** The page at https://kubernetes.io/docs/tasks/manage-kubernetes-objects/storage-version-migration shows "Beta since Kubernetes v1.35; disabled by default" in its header, while its body says the gate and the API are enabled by default. The header is stale and should not be cited for stage.
- **StorageVersionMigration gate.** The gate is Beta with default false at v1.36.0 and GA with default true at v1.37.0, which agrees with KEP 4192 (alpha v1.30, beta v1.35, stable v1.37).
- **Stale controller KEP metadata.** KEP 5647's `kep.yaml` lists beta as v1.37, while the gate table shows the four `StaleControllerConsistency` gates and `AtomicFIFO` as Beta from 1.36.

## What the primary sources settle

Mutating Admission Policy is GA and enabled by default from v1.36, which three readings agree on: the docs page ("Stable since Kubernetes v1.36; enabled by default"), CHANGELOG-1.36 (PR 136039), and the gate table. StorageVersionMigration is GA from v1.37 by the release blog, CHANGELOG-1.37 (PR 138560), and the gate table.

## What to do

Cite the feature-gate table at a release tag and the CHANGELOG for stage and default, and treat docs-page headers and KEP metadata as lagging indicators. When a tutorial states a stage, name the version tag it was checked against.

## Related

[[comparisons/admission-mechanisms-webhooks-vap-map-and-crd-rules]], [[concepts/crd-versioning-and-storage-migration]], [[findings/the-kubernetes-v1-36-staleness-blog-names-metrics-differently-from-the-changelog-and-source]], [[findings/crossplane-v2-5-docs-and-source-disagree-on-stage-labels-condition-status-and-group-suffixes]]

## Update from the Flux and Kubernetes recheck

Correction note, 2026-11-26: the first mismatch above said the dossier did not resolve the v1.30 conflict. It is now explained: the gate was registered in v1.30.0 as an inert Alpha placeholder and the usable API arrived in v1.32 ([[findings/the-mutating-admission-policy-gate-was-registered-in-v1-30-as-an-inert-alpha-placeholder-and-the-usable-api-arrived-in-v1-32]]). The fourth mismatch is detailed in [[findings/kep-5647-lists-a-different-gate-shape-from-the-shipped-code-and-monitorinformerstaleness-is-not-found-in-kubernetes-source]]. [[sources/research-gap-b1-recheck-flux-k8s]]

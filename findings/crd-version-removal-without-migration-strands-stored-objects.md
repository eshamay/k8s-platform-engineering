---
title: Removing a CRD version without migration strands stored objects
type: finding
status: draft
created: 2026-11-25
updated: 2026-11-26
sources:
  - id: research-gap-g3-k8s-and-controller-runtime
    hash: 2b4e3378c119
    ingested: 2026-11-26
  - id: research-gvk-and-gvr
    hash: 5c56bb1e05a8
    ingested: 2026-11-25
  - id: research-custom-resource-definition
    hash: 6c26f7f89147
    ingested: 2026-11-25
aliases: []
tags: [pitfall, crd, versioning, conversion]
---

# Removing a CRD version without migration strands stored objects

## Observation

Two hazards come from the Kubernetes versioning pages. First, `conversion.strategy: None` only rewrites the `apiVersion`, so versions whose schemas differ need a conversion webhook. Second, an old version must stop being served and have its stored objects migrated before it is removed. The documented sequence is to add the new version, migrate clients, set the old version `served: false`, upgrade stored objects, and then remove the old version. A StorageVersionMigration object does the rewriting. URLs: https://kubernetes.io/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definition-versioning/ and https://kubernetes.io/docs/tasks/manage-kubernetes-objects/storage-version-migration/. [sources/research-gvk-and-gvr](../sources/research-gvk-and-gvr.md)

## Inference

The dossier states the required order but does not describe a specific outage. The consequence of skipping migration, objects persisted in a version the CRD no longer lists, is an inference from the documented sequence and not an incident the dossier reports.

## Related

[concepts/crd-versioning-and-storage-migration](../concepts/crd-versioning-and-storage-migration.md), [decisions/conversion-webhook-versus-new-xrd-for-breaking-changes](../decisions/conversion-webhook-versus-new-xrd-for-breaking-changes.md)

## Additions from the CRD dossier

The versioning page tells authors to check `status.storedVersions` before dropping an old version, and the sources report a built-in StorageVersionMigration API as GA in v1.37. [sources/research-custom-resource-definition](../sources/research-custom-resource-definition.md) See [concepts/crd-versioning-and-storage-migration](../concepts/crd-versioning-and-storage-migration.md).

The v1.37 migration is verified as GA but is not automatic: the user must create the `StorageVersionMigration` object, so skipping that step still strands objects. [sources/research-gap-g3-k8s-and-controller-runtime](../sources/research-gap-g3-k8s-and-controller-runtime.md) See [findings/storage-version-migration-is-not-triggered-automatically-so-a-retired-crd-version-needs-a-user-created-object](storage-version-migration-is-not-triggered-automatically-so-a-retired-crd-version-needs-a-user-created-object.md).

---
title: CRD versioning and storage version migration
type: concept
status: active
created: 2026-11-25
updated: 2026-11-26
sources:
  - id: research-gap-b1-recheck-flux-k8s
    hash: c78dc9a9635e
    ingested: 2026-11-26
  - id: research-gap-g3-k8s-and-controller-runtime
    hash: 2b4e3378c119
    ingested: 2026-11-26
  - id: research-gvk-and-gvr
    hash: 5c56bb1e05a8
    ingested: 2026-11-25
  - id: research-custom-resource-definition
    hash: 6c26f7f89147
    ingested: 2026-11-25
  - id: research-gap-m6-admission-crds
    hash: 7cac38f11490
    ingested: 2026-11-26
aliases: [storage version migration, CRD conversion]
tags: [api-machinery, crd, versioning]
---

# CRD versioning and storage version migration

## Definition

A CustomResourceDefinition can list several versions of the same Kind. Exactly one version is the storage version, which is the form persisted in etcd, and any number of versions can be marked `served`, which means the API server answers requests for them. [[sources/research-gvk-and-gvr]]

## Conversion

When a client asks for a version other than the stored one, the API server converts the object. The conversion strategy is `None`, which rewrites only the `apiVersion` field and therefore requires the schemas to match, or `Webhook`, which calls a service that performs the translation. URL: https://kubernetes.io/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definition-versioning/.

## Retiring a version

The documented sequence is to add the new version, migrate clients to it, set the old version to `served: false`, upgrade the stored objects, and then remove the old version. The upgrade step uses a StorageVersionMigration object, which rewrites all stored objects to the current storage version. The task page defines the goal as ensuring "all objects for a Resource have been migrated off of a stale storage version." Storage migration is also required when the storage schema changes. URL: https://kubernetes.io/docs/tasks/manage-kubernetes-objects/storage-version-migration/. See [[findings/crd-version-removal-without-migration-strands-stored-objects]].

## Platform tooling

Crossplane recommends that breaking schema changes ship as new XRDs or through conversion webhooks, because an XRD's group and names cannot change. See [[decisions/conversion-webhook-versus-new-xrd-for-breaking-changes]].

## Related

[[concepts/custom-resource-definition]], [[concepts/gvk-and-gvr]], [[findings/removed-beta-gvks-break-pinned-manifests-and-clients]]

## Additions from the CRD dossier

The versioning task page separates the `served` and `storage` flags, and tells authors to check `status.storedVersions` before dropping an old version from the spec. Webhook conversion calls a service configured with `conversionReviewVersions` and a `caBundle`. The Kubebuilder hub-and-spoke pattern keeps the number of conversion functions near 2(N-1) for N versions. [[sources/research-custom-resource-definition]]

The built-in StorageVersionMigration API (`storagemigration.k8s.io/v1`) and the `StorageVersionMigrator` controller in kube-controller-manager graduated to GA and are on by default in Kubernetes v1.37. KEP 4192 gives alpha v1.30, beta v1.35, and stable v1.37, and the gate was Beta with default false at v1.36.0. A user creates a `StorageVersionMigration` object whose immutable `spec.resource` names a group and resource, and the controller rewrites every stored object of that resource. The kind is cluster-scoped with a status subresource, `status.conditions` use the types Running, Succeeded, and Failed, and `status.resourceVersion` is set when kube-controller-manager first observes the object. Migration is not triggered automatically, because the KEP defers creation of the object to the user and the out-of-tree trigger controller was not moved in-tree. After a CRD migration, `.status.storedVersions` should hold only the preferred version, otherwise the migration should be retried, and the resource must have an integer resource version, so aggregated APIs can fail. Before this, operators wrote their own migrators. URL: https://kubernetes.io/blog/2026/08/31/kubernetes-v1-37-storage-version-migration-ga/. [[sources/research-gap-g3-k8s-and-controller-runtime]] See [[examples/a-user-created-storageversionmigration-object-rewrites-stored-objects-so-a-crd-can-retire-an-old-version]], [[findings/storage-version-migration-is-not-triggered-automatically-so-a-retired-crd-version-needs-a-user-created-object]], and [[findings/kubernetes-docs-pages-disagree-with-the-code-on-mutating-admission-policy-and-storage-version-migration-stage]].

Correction note, 2026-11-26: this paragraph previously rested on one blog extract and said that whether migration triggers automatically was unverified. The KEP, CHANGELOG-1.37, and the gate tables confirm GA and that migration is user-triggered. The exact shape of the progress-reporting condition fields added in v1.37 (PR 138875) was not read. See [[comparisons/crd-conversion-strategies-none-webhook-and-hub-and-spoke]], [[examples/kubebuilder-hub-and-spoke-conversion-for-multi-version-crds]], and [[findings/a-down-conversion-webhook-can-stall-garbage-collection]].

## Progress reporting layout

Correction note, 2026-11-26: the correction above said the exact shape of the progress reporting was not read. It is now read from source at v1.37.0. There is no numeric progress field. Progress is text in the `message` of the `Running` condition ("The migration is running", then ", N/M objects not yet migrated" or ", M objects verified migrated", plus "; transient error: <err>"), and completion flips `Running` to False with reason `MigrationCompleted` and sets `Succeeded` true. For CRDs the controller also sets a `StorageMigrating` condition and removes old stored versions from the CRD status (pull request 135297). See [[findings/storageversionmigration-reports-progress-as-text-in-the-running-condition-message-and-has-no-numeric-progress-field]]. [[sources/research-gap-b1-recheck-flux-k8s]]

## Additions from the admission and CRD dossier

Cluster API runs its own CRD migrator that patches every custom resource and then sets `status.storedVersions`, and labels CRDs with contract versions ([[findings/cluster-api-labels-crds-with-contract-versions-and-runs-a-crd-migrator-for-storage-version-migration]]). A down conversion webhook no longer stalls garbage collection from Kubernetes 1.32 ([[findings/since-kubernetes-1-32-the-garbage-collector-proceeds-after-a-failed-cache-sync-but-cannot-see-block-owner-deletion-owners-of-the-unsynced-type]]). [[sources/research-gap-m6-admission-crds]]

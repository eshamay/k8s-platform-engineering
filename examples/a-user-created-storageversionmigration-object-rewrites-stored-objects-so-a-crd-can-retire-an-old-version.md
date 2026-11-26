---
title: "A user-created StorageVersionMigration object rewrites stored objects so a CRD can retire an old version"
type: example
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
aliases: [StorageVersionMigration walkthrough]
tags: [kubernetes, v1-37, crd, versioning, storage-migration, ga]
---

# A user-created StorageVersionMigration object rewrites stored objects so a CRD can retire an old version

## Scenario

A team has moved a CRD from an old version to a new preferred version and wants to drop the old version from the CRD. Objects written earlier are still stored in etcd in the old form, so the old version cannot be removed until they are rewritten. Kubernetes v1.37 made the built-in way to do that Generally Available. [[sources/research-gap-g3-k8s-and-controller-runtime]]

## Steps

1. The user creates a `StorageVersionMigration` object in `storagemigration.k8s.io/v1`, whose `spec.resource` names the group and resource to migrate. The field is an immutable `GroupResource`, and the kind is cluster-scoped with a status subresource.
2. The `StorageVersionMigrator` controller in kube-controller-manager rewrites every stored object of that resource. Its `status.conditions` use the types Running, Succeeded, and Failed, and `status.resourceVersion` is set when kube-controller-manager first observes the object. CHANGELOG-1.37 adds progress reporting in the conditions (PR 138875).
3. After a successful migration of a CRD, the user checks that the CRD's `.status.storedVersions` contains only the preferred version. If it does not, the CRD changed during the migration, and the GA blog says "the migration should be retried in order to safely deprecate an older storage version."
4. The user then removes the old version from the CRD.

The GA blog puts the trigger plainly: "Initiating a storage version migration is as simple as creating a declarative StorageVersionMigration object." URL: https://kubernetes.io/blog/2026/08/31/kubernetes-v1-37-storage-version-migration-ga/. The KEP says the creation of the migration object "will be deferred to the user, instead of being triggered automatically", and only the migrator moved in-tree, not the out-of-tree trigger controller that polled discovery every 10 minutes. URL: https://github.com/kubernetes/enhancements/blob/master/keps/sig-api-machinery/4192-svm-in-tree/README.md

## Limits

Migration needs an integer resource version and fails for resources that do not provide one, such as aggregated APIs (the task page, https://kubernetes.io/docs/tasks/manage-kubernetes-objects/storage-version-migration). CHANGELOG-1.37 also records a switch from server-side apply to merge patch (PR 138874) and a fix for a kube-controller-manager panic when the target resource is missing from the RESTMapper (PR 140586). The KEP lists the metrics `storage_migrator_core_migrator_migrated_objects_total`, `..._remaining_objects_total`, and `..._migrations_total`.

## Related

[[concepts/crd-versioning-and-storage-migration]], [[findings/storage-version-migration-is-not-triggered-automatically-so-a-retired-crd-version-needs-a-user-created-object]], [[findings/crd-version-removal-without-migration-strands-stored-objects]]

## Update from the Flux and Kubernetes recheck

Update 2026-11-26: while the migration runs, `Running` is True with a message such as "The migration is running, 120/500 objects not yet migrated" (format from source, the numbers are illustrative). On completion `Running` becomes False with reason `MigrationCompleted` and `Succeeded` becomes True. See [[findings/storageversionmigration-reports-progress-as-text-in-the-running-condition-message-and-has-no-numeric-progress-field]]. [[sources/research-gap-b1-recheck-flux-k8s]]

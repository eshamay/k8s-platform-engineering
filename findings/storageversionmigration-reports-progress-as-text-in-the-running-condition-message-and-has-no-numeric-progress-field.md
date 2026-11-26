---
title: "StorageVersionMigration reports progress as text in the Running condition message and has no numeric progress field"
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-b1-recheck-flux-k8s
    hash: c78dc9a9635e
    ingested: 2026-11-26
aliases: [SVM progress condition layout]
tags: [kubernetes, v1-37, storage-migration, conditions, crd, versioning, verified]
---

# StorageVersionMigration reports progress as text in the Running condition message and has no numeric progress field

## Observation

At Kubernetes v1.37.0 the `storagemigration.k8s.io/v1` type has no numeric progress field. The type (marked `prerelease-lifecycle-gen:introduced=1.37`) has an immutable `spec.resource`, a `GroupResource`, and a `status` with `conditions` (a map list keyed by `type`, using standard `metav1.Condition`) and `resourceVersion`. The condition types are `Running`, `Succeeded`, and `Failed`. Progress is carried only in the `message` of the `Running` condition. [[sources/research-gap-b1-recheck-flux-k8s]] https://github.com/kubernetes/kubernetes/blob/v1.37.0/staging/src/k8s.io/api/storagemigration/v1/types.go

## The message layout

The controller builds the message in `migrationRunningMessage` (`pkg/controller/storageversionmigrator/util.go`):

- It starts with "The migration is running".
- It appends ", N/M objects not yet migrated" while objects remain, or ", M objects verified migrated" when none remain.
- It appends "; transient error: <err>" when a transient error occurred.

The controller sets the reason `MigrationRunning`. When the pass completes, `migrationrunner.go` flips `Running` to False with reason `MigrationCompleted` and message "Migration completed". The controller then sets `Succeeded` true with reason `StorageVersionMigrationSucceeded`, or on failure `Failed` true with reason `StorageVersionMigrationFailed`. The `Running` message is written only when its content changes, and an update call is made at the end of each pass. https://github.com/kubernetes/kubernetes/blob/v1.37.0/pkg/controller/storageversionmigrator/storageversionmigrator.go

## CRD side effects

For CRDs the controller also sets a `StorageMigrating` condition on the CRD. Pull request 135297 (merged 2026-03-11, "Remove CRD stored versions from status upon SVM migration") removes the old stored versions from the CRD status after migration, which is the step that makes `.status.storedVersions` hold only the preferred version. Generic GA is pull request 138560 ("Promote SVM to GA", merged 2026-07-08).

## Why it matters

A runbook or a script that waits for migration cannot read a percentage. It should wait for the `Succeeded` condition, and it should treat the `Running` message as human-readable text whose wording can change, not as a parsed value. This is the same lesson as [[findings/free-text-in-a-condition-reason-breaks-consumers]]. The earlier wiki text said the exact field layout of the v1.37 progress reporting was not read, and this finding records it. The SVM GA blog and the KEP 4192 text for the progress layout were not read in this pass, so the layout comes from source alone.

## Related

[[concepts/crd-versioning-and-storage-migration]], [[examples/a-user-created-storageversionmigration-object-rewrites-stored-objects-so-a-crd-can-retire-an-old-version]], [[findings/storage-version-migration-is-not-triggered-automatically-so-a-retired-crd-version-needs-a-user-created-object]], [[concepts/conditions]]

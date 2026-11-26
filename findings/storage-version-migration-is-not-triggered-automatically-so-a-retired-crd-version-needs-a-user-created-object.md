---
title: "StorageVersionMigration is not triggered automatically, so a retired CRD version needs a user-created object"
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
aliases: [GA does not mean automatic migration]
tags: [pitfall, kubernetes, v1-37, crd, versioning, storage-migration]
---

# StorageVersionMigration is not triggered automatically, so a retired CRD version needs a user-created object

## Observation

StorageVersionMigration reached GA and is enabled by default in Kubernetes v1.37, but "enabled by default" describes the API and the controller, and it does not mean that migrations run on their own. KEP 4192 says "The creation of the Migration resource will be deferred to the user, instead of being triggered automatically." The GA blog says migration starts when a user creates a declarative `StorageVersionMigration` object. The out-of-tree trigger controller, which discovered resources every 10 minutes and created migration objects, was not moved in-tree, and only the migrator was. [[sources/research-gap-g3-k8s-and-controller-runtime]]

## Why it is a pitfall

A team that reads "GA and on by default" may assume that old storage versions are rewritten without action and remove an old CRD version from the spec. Objects still persisted in the old form are then stranded, which is the hazard in [[findings/crd-version-removal-without-migration-strands-stored-objects]]. The dossier reports no incident, so the consequence is an inference from the documented sequence.

## Further caveats

- Migration needs an integer resource version and fails for resources without one, such as aggregated APIs.
- After a CRD migration, `.status.storedVersions` should hold only the preferred version. If it does not, the CRD changed mid-migration and the migration should be retried.
- CHANGELOG-1.37 records a kube-controller-manager panic when the target resource was missing from the RESTMapper, fixed in PR 140586, so check the patch level in use.

## What to do

Create the migration object as an explicit step in the version-retirement runbook, wait for the Succeeded condition, check `storedVersions`, and only then remove the old version. See [[examples/a-user-created-storageversionmigration-object-rewrites-stored-objects-so-a-crd-can-retire-an-old-version]] and [[concepts/crd-versioning-and-storage-migration]].

## Related

[[concepts/custom-resource-definition]], [[decisions/conversion-webhook-versus-new-xrd-for-breaking-changes]], [[findings/kubernetes-docs-pages-disagree-with-the-code-on-mutating-admission-policy-and-storage-version-migration-stage]]

## Update from the Flux and Kubernetes recheck

Update 2026-11-26: to wait for a migration, read the `Succeeded` condition. Progress is only text in the `Running` message, with no numeric field ([[findings/storageversionmigration-reports-progress-as-text-in-the-running-condition-message-and-has-no-numeric-progress-field]]). Old stored versions are removed from the CRD status after migration (pull request 135297, merged 2026-03-11). [[sources/research-gap-b1-recheck-flux-k8s]]

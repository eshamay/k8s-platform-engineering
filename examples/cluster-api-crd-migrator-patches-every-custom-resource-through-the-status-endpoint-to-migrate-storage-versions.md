---
title: "The Cluster API CRD migrator patches every custom resource through the status endpoint to migrate storage versions"
type: example
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-m6-admission-crds
    hash: 7cac38f11490
    ingested: 2026-11-26
aliases: []
tags: [cluster-api, crd, storage-version-migration, status, verified]
---

# The Cluster API CRD migrator patches every custom resource through the status endpoint to migrate storage versions

## Scenario

The migrator in `controllers/crdmigrator/crd_migrator.go` applies "a no-op patch ... to all custom resources of the CRD", then sets `status.storedVersions`. It has an option to patch through the status subresource because webhook errors would otherwise block the no-op updates. https://raw.githubusercontent.com/kubernetes-sigs/cluster-api/main/controllers/crdmigrator/crd_migrator.go [[sources/research-gap-m6-admission-crds]]

## Reliability

VERIFIED from the source file on main. Behavior on a very large number of custom resources was not measured.

## Related

[[findings/cluster-api-labels-crds-with-contract-versions-and-runs-a-crd-migrator-for-storage-version-migration]] and [[findings/storage-version-migration-is-not-triggered-automatically-so-a-retired-crd-version-needs-a-user-created-object]].

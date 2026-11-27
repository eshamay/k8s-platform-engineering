---
title: "Cluster API labels CRDs with contract versions and runs a CRD migrator for storage version migration"
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-m6-admission-crds
    hash: 7cac38f11490
    ingested: 2026-11-26
aliases: []
tags: [cluster-api, crd, contracts, storage-version-migration, verified]
---

# Cluster API labels CRDs with contract versions and runs a CRD migrator for storage version migration

## Observation

Cluster API providers "MUST set `cluster.x-k8s.io/<version>` label on the InfraCluster Custom Resource Definitions", which maps the contract version to the provider's CRD versions as an underscore-delimited list and lets controllers convert object references automatically. The contracts overview says "Breaking changes within the same version of the Cluster API contract are not allowed." https://raw.githubusercontent.com/kubernetes-sigs/cluster-api/main/docs/book/src/developer/providers/contracts/infra-cluster.md and .../overview.md, read 2026-11-26 (latest release v1.14.4). [sources/research-gap-m6-admission-crds](../sources/research-gap-m6-admission-crds.md)

The CRD migrator in `controllers/crdmigrator` performs storage version migration, where "a no-op patch is applied to all custom resources of the CRD" and then `status.storedVersions` is updated, and it cleans managedFields for apiVersions no longer served. It can migrate through the status endpoint because "mutating and validating webhooks are usually not configured on the status subresource", which keeps webhook errors from blocking the no-op updates. It warns that cached Get and List create informers that need "a significant amount of memory". Cluster API's own CRDs use conversion webhooks at `/convert`. https://raw.githubusercontent.com/kubernetes-sigs/cluster-api/main/controllers/crdmigrator/crd_migrator.go

## Related

[examples/cluster-api-crd-migrator-patches-every-custom-resource-through-the-status-endpoint-to-migrate-storage-versions](../examples/cluster-api-crd-migrator-patches-every-custom-resource-through-the-status-endpoint-to-migrate-storage-versions.md), [concepts/crd-versioning-and-storage-migration](../concepts/crd-versioning-and-storage-migration.md), and [entities/cluster-api](../entities/cluster-api.md).

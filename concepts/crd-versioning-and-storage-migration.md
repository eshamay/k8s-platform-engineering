---
title: CRD versioning and storage version migration
type: concept
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-gvk-and-gvr
    hash: 5c56bb1e05a8
    ingested: 2026-11-25
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

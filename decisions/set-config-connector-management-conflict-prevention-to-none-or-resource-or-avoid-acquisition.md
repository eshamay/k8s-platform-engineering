---
title: "Set Config Connector management conflict prevention to none or resource, or avoid acquisition"
type: decision
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-m7-operators-idempotency
    hash: 6c986668a6dc
    ingested: 2026-11-26
aliases: [Config Connector conflict policy choice]
tags: [decision, config-connector, conflicts, adoption, evidence-only]
---

# Set Config Connector management conflict prevention to none or resource, or avoid acquisition

## Status

Open decision with options and evidence only. This page makes no recommendation. The "Managing conflicts" page documents the policy values and limits and does not recommend one, and the behavior was read from documentation and not tested. [sources/research-gap-m7-operators-idempotency](../sources/research-gap-m7-operators-idempotency.md)

## Context

Config Connector acquires an existing cloud resource whose name matches the manifest. When two Kubernetes objects can target one cloud resource, the platform team decides whether the controller should arbitrate. See [findings/config-connector-conflict-prevention-defaults-to-none-so-two-objects-can-manage-one-cloud-resource-unless-a-lease-policy-is-set](../findings/config-connector-conflict-prevention-defaults-to-none-so-two-objects-can-manage-one-cloud-resource-unless-a-lease-policy-is-set.md) and [findings/adopt-or-create-can-take-over-a-look-alike-resource](../findings/adopt-or-create-can-take-over-a-look-alike-resource.md).

## Options

### Option A: keep the default policy none

No lease is written and no conflict is reported. The evidence for it is that it is the documented default and needs no labels on the cloud resource. The evidence against is that two objects, including ones in different namespaces, can both manage the resource with nothing to stop them.

### Option B: set the policy to resource on each object

A lease stored in the labels `cnrm-lease-holder-id` and `cnrm-lease-expiration` lasts 40 minutes and a losing object reports `ManagementConflict`. The limits are stated by the page: it "does not work for resources that don't support labels", and two objects in one namespace that use `resourceID` for one resource conflict in a way Config Connector cannot manage. The policy is set per object, so an object that omits it is not protected. See [examples/config-connector-lease-labels-gate-two-namespaces-that-manage-one-google-cloud-resource](../examples/config-connector-lease-labels-gate-two-namespaces-that-manage-one-google-cloud-resource.md).

### Option C: avoid acquisition of look-alike resources

Use `resourceID` and the deletion policy `abandon` so that deleting an object does not delete a resource it merely acquired. The page says deleting an acquiring object deletes the cloud resource by default, and that some resources with service-generated IDs can be acquired only through `resourceID` while some cannot be acquired at all.

## Consequences

The options trade protection for coverage. Only Option C addresses deletion, and only Option B addresses concurrent management, so they can be combined. The dossier found no incident comparing them, and the wiki's reported acquisition case is a different failure, see [examples/config-connector-issue-14236-acquiring-an-existing-storage-bucket-removed-its-encryption-enforcement-config](../examples/config-connector-issue-14236-acquiring-an-existing-storage-bucket-removed-its-encryption-enforcement-config.md). [sources/research-gap-m7-operators-idempotency](../sources/research-gap-m7-operators-idempotency.md)

## Related

[decisions/adopt-or-create-or-require-explicit-import](adopt-or-create-or-require-explicit-import.md), [entities/config-connector](../entities/config-connector.md), [comparisons/deletion-policies-across-gitops-and-provider-tools](../comparisons/deletion-policies-across-gitops-and-provider-tools.md)

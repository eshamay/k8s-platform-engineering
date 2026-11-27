---
title: "Config Connector conflict prevention defaults to none, so two objects can manage one cloud resource unless a lease policy is set"
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-m7-operators-idempotency
    hash: 6c986668a6dc
    ingested: 2026-11-26
aliases: [Config Connector management conflict]
tags: [config-connector, adoption, conflicts, lease, gcp]
---

# Config Connector conflict prevention defaults to none, so two objects can manage one cloud resource unless a lease policy is set

## Observation

Config Connector maps a Kubernetes resource to a Google Cloud resource by "mapping the combination of Kubernetes resource name, container annotation, and if applicable, region or location", and it acquires an existing resource of the same name. The "Managing conflicts" page says it is "possible, but not recommended, to create two Config Connector resources in different namespaces that manage the same Google Cloud resource." Prevention is opt-in. The annotation `cnrm.cloud.google.com/management-conflict-prevention-policy` takes the values `resource` or `none`, and "The default value is `none`." [sources/research-gap-m7-operators-idempotency](../sources/research-gap-m7-operators-idempotency.md)

When the policy is `resource`, Config Connector stores a lease on the cloud resource as two labels, `cnrm-lease-holder-id` and `cnrm-lease-expiration`. A lease lasts 40 minutes and is extended while the holder keeps reconciling. A second object can take over when the expiration is in the past, and a loser reports the status `ManagementConflict`. See [examples/config-connector-lease-labels-gate-two-namespaces-that-manage-one-google-cloud-resource](../examples/config-connector-lease-labels-gate-two-namespaces-that-manage-one-google-cloud-resource.md). [sources/research-gap-m7-operators-idempotency](../sources/research-gap-m7-operators-idempotency.md)

## Limits stated by the page

Conflict prevention "does not work for resources that don't support labels", because the lease lives in labels. Two objects in the same namespace that use `resourceID` to name one cloud resource "create conflicts that Config Connector cannot manage". Deleting an acquiring object deletes the cloud resource unless the deletion policy is set to abandon, and resources with service-generated IDs can be acquired only through `resourceID`. Config Connector also adds the system label `managed-by-cnrm` to labeled cloud resources. [sources/research-gap-m7-operators-idempotency](../sources/research-gap-m7-operators-idempotency.md)

## Interpretation

With the default, nothing stops two objects from acquiring one resource, so the shared-owner hazard that [findings/ack-adopt-or-create-removes-the-only-guard-against-two-custom-resources-owning-one-aws-resource](ack-adopt-or-create-removes-the-only-guard-against-two-custom-resources-owning-one-aws-resource.md) documents for ACK has a documented opt-in guard in Config Connector and no default guard. This reading is the wiki's, and the dossier read the behavior from documentation without testing it. The behavior of two same-namespace objects with different names and no `resourceID` is not documented in the pages read.

## Related

[findings/adopt-or-create-can-take-over-a-look-alike-resource](adopt-or-create-can-take-over-a-look-alike-resource.md), [decisions/set-config-connector-management-conflict-prevention-to-none-or-resource-or-avoid-acquisition](../decisions/set-config-connector-management-conflict-prevention-to-none-or-resource-or-avoid-acquisition.md), [examples/config-connector-acquires-an-existing-google-cloud-resource-by-name](../examples/config-connector-acquires-an-existing-google-cloud-resource-by-name.md), [entities/config-connector](../entities/config-connector.md)

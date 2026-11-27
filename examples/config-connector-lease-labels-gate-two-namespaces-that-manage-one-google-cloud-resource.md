---
title: "Config Connector lease labels gate two namespaces that manage one Google Cloud resource"
type: example
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-m7-operators-idempotency
    hash: 6c986668a6dc
    ingested: 2026-11-26
aliases: []
tags: [config-connector, gcp, lease, conflicts, acquisition]
---

# Config Connector lease labels gate two namespaces that manage one Google Cloud resource

## Scenario

Two teams each apply a Config Connector manifest, in different namespaces, that names the same Google Cloud resource in the same project. The "Managing conflicts" page (https://cloud.google.com/config-connector/docs/concepts/managing-conflicts, last updated 2026-11-10) calls this "possible, but not recommended". The behavior below is read from documentation and was not tested. [sources/research-gap-m7-operators-idempotency](../sources/research-gap-m7-operators-idempotency.md)

## Sequence with the policy set to resource

Both objects carry `cnrm.cloud.google.com/management-conflict-prevention-policy: resource`. The first object to reconcile writes `cnrm-lease-holder-id` and `cnrm-lease-expiration` as labels on the cloud resource, and "the expiration time is set to 40 minutes in the future". The holder extends the lease while it keeps reconciling. The second object finds a lease held by another namespace, cannot take it, and reports the status `ManagementConflict`. If the first holder stops, the second can take over once "The value of `cnrm-lease-expiration` is in the past." [sources/research-gap-m7-operators-idempotency](../sources/research-gap-m7-operators-idempotency.md)

## Sequence with the default

With the default value `none`, no lease is written, so both objects acquire the resource and both reconcile it. The page lists two cases that no policy fixes: resources that do not support labels, and two objects in one namespace that use `resourceID` to name one cloud resource, which "create conflicts that Config Connector cannot manage". [sources/research-gap-m7-operators-idempotency](../sources/research-gap-m7-operators-idempotency.md)

## Related

[findings/config-connector-conflict-prevention-defaults-to-none-so-two-objects-can-manage-one-cloud-resource-unless-a-lease-policy-is-set](../findings/config-connector-conflict-prevention-defaults-to-none-so-two-objects-can-manage-one-cloud-resource-unless-a-lease-policy-is-set.md), [decisions/set-config-connector-management-conflict-prevention-to-none-or-resource-or-avoid-acquisition](../decisions/set-config-connector-management-conflict-prevention-to-none-or-resource-or-avoid-acquisition.md), [examples/config-connector-acquires-an-existing-google-cloud-resource-by-name](config-connector-acquires-an-existing-google-cloud-resource-by-name.md)

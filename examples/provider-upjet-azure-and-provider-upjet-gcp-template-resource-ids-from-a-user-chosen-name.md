---
title: "provider-upjet-azure and provider-upjet-gcp template resource IDs from a user-chosen name"
type: example
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-m7-operators-idempotency
    hash: 6c986668a6dc
    ingested: 2026-11-26
aliases: []
tags: [crossplane, upjet, azure, gcp, external-name]
---

# provider-upjet-azure and provider-upjet-gcp template resource IDs from a user-chosen name

## Scenario

Azure and Google Cloud resource identifiers are full paths that contain the resource name, so the external name configuration builds the identifier from the name instead of waiting for the cloud to assign one. The evidence is `config/externalname.go` in https://github.com/crossplane-contrib/provider-upjet-azure (latest release v2.8.0, 2026-10-08) and https://github.com/crossplane-contrib/provider-upjet-gcp (latest release v3.1.0, 2026-10-08), both read from main on 2026-11-26. [sources/research-gap-m7-operators-idempotency](../sources/research-gap-m7-operators-idempotency.md)

## What the files say

The Azure resource group line is `"azurerm_resource_group": config.TemplatedStringAsIdentifier("name", "/subscriptions/{{ .setup.configuration.subscription_id }}/resourceGroups/{{ .external_name }}")`. Virtual networks, storage accounts, and AKS clusters follow the same templated approach. The GCP compute instance line is `"google_compute_instance": config.TemplatedStringAsIdentifier("name", "projects/{{ .setup.configuration.project }}/zones/{{ .parameters.zone }}/instances/{{ .external_name }}")`, and compute networks, subnetworks, GKE clusters, Cloud SQL instances, and storage buckets are templated in the same way. [sources/research-gap-m7-operators-idempotency](../sources/research-gap-m7-operators-idempotency.md)

Not every GCP kind follows the pattern. `"google_project_iam_member": config.IdentifierFromProvider,` takes a provider-assigned identifier, and service accounts use a custom `serviceAccount()` function. [sources/research-gap-m7-operators-idempotency](../sources/research-gap-m7-operators-idempotency.md)

## Why it matters

The external name here is user-chosen and the cloud ID is derived from it, so the identifier is predictable before the create call. This is the name-based end of the range that [examples/provider-upjet-aws-maps-s3-buckets-to-a-bucket-parameter-and-vpcs-to-provider-assigned-ids](provider-upjet-aws-maps-s3-buckets-to-a-bucket-parameter-and-vpcs-to-provider-assigned-ids.md) shows from the other side. Only sampled kinds were read, and the native provider repositories were not.

## Related

[findings/crossplane-external-names-default-to-the-object-name-only-for-name-based-kinds-and-upjet-providers-switch-the-default-off-for-provider-assigned-ids](../findings/crossplane-external-names-default-to-the-object-name-only-for-name-based-kinds-and-upjet-providers-switch-the-default-off-for-provider-assigned-ids.md), [entities/upjet](../entities/upjet.md), [decisions/external-name-annotation-or-spec-field](../decisions/external-name-annotation-or-spec-field.md)

---
title: "Crossplane external names default to the object name only for name-based kinds, and upjet providers switch the default off for provider-assigned IDs"
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-m7-operators-idempotency
    hash: 6c986668a6dc
    ingested: 2026-11-26
aliases: [per-provider external-name defaults]
tags: [crossplane, external-name, upjet, providers, idempotency]
---

# Crossplane external names default to the object name only for name-based kinds, and upjet providers switch the default off for provider-assigned IDs

## Observation

The Crossplane managed resources page states a general rule: "By default Providers give external resources the same name as the Kubernetes object." It also says that a pre-set annotation value is used as the external name, and that some external systems generate "an nondeterministic name" that the provider records after creation. The apparent contradiction in earlier wiki material, where one source said the S3 default is the object name and another said names are provider-specific, is resolved by the provider source. [sources/research-gap-m7-operators-idempotency](../sources/research-gap-m7-operators-idempotency.md)

In upjet-based providers the default is implemented by a name initializer that "sets external name to metadata.name if none specified". Each resource configuration can disable it. `IdentifierFromProvider` sets `DisableNameInitializer: true` and is meant for identifiers "assigned by the remote client, such as AWS VPC where it gets an identifier like vpc-2213das". The other configuration functions keep the name-based default in different shapes: `NameAsIdentifier` uses the `name` argument, `ParameterAsIdentifier` feeds another argument such as `bucket`, and `TemplatedStringAsIdentifier` builds a full resource ID from the name. The upjet guide says that "The format and source of the external name depends on the cloud provider". [sources/research-gap-m7-operators-idempotency](../sources/research-gap-m7-operators-idempotency.md)

## Sampled kinds

The files were read on main and only sample kinds were inspected, so this is a mechanism with examples and not a complete table. See [examples/provider-upjet-aws-maps-s3-buckets-to-a-bucket-parameter-and-vpcs-to-provider-assigned-ids](../examples/provider-upjet-aws-maps-s3-buckets-to-a-bucket-parameter-and-vpcs-to-provider-assigned-ids.md) and [examples/provider-upjet-azure-and-provider-upjet-gcp-template-resource-ids-from-a-user-chosen-name](../examples/provider-upjet-azure-and-provider-upjet-gcp-template-resource-ids-from-a-user-chosen-name.md).

| Provider | Name-based kinds (sampled) | Provider-assigned kinds (sampled) |
|---|---|---|
| provider-upjet-aws | `aws_s3_bucket` (parameter `bucket`), `aws_iam_role`, `aws_eks_cluster` | `aws_vpc`, `aws_subnet`, `aws_security_group`, `aws_instance`, `aws_db_instance`, `aws_kms_key` |
| provider-upjet-azure | resource group, virtual network, storage account, AKS cluster (templated ID from `name`) | none sampled |
| provider-upjet-gcp | compute instance, network, subnetwork, GKE cluster, Cloud SQL instance, storage bucket (templated ID) | `google_project_iam_member`, service accounts through a custom function |

## Consequences

Whether the external name is predictable before the first create decides which idempotency strategy is available. A name-based kind lets a retried create find the same resource, while a provider-assigned kind leaves a window in which the ID exists in the cloud and not yet in the annotation, which is why the create-pending guard and its opt-out matter. See [findings/an-ambiguous-create-result-halts-reconciliation-until-a-human-intervenes](an-ambiguous-create-result-halts-reconciliation-until-a-human-intervenes.md) and [findings/provider-upjet-aws-controllers-do-not-set-withdeterministicexternalname-so-deterministically-named-resources-stay-stuck-after-a-transient-error](provider-upjet-aws-controllers-do-not-set-withdeterministicexternalname-so-deterministically-named-resources-stay-stuck-after-a-transient-error.md).

## Limits

Provider-aws (the non-upjet provider, v0.60.0 listed on 2026-10-30) and the native Azure repositories were not read. Whether the AWS, Azure, and GCP files differ in the v1 and v2 namespaced variants was not checked. The full AWS, Azure, and GCP files are 4710, 2563, and 1576 lines, and a per-kind table remains unbuilt. [sources/research-gap-m7-operators-idempotency](../sources/research-gap-m7-operators-idempotency.md)

## Related

[findings/external-identity-takes-different-forms-across-cloud-apis](external-identity-takes-different-forms-across-cloud-apis.md), [decisions/external-name-annotation-or-spec-field](../decisions/external-name-annotation-or-spec-field.md), [entities/upjet](../entities/upjet.md), [entities/crossplane](../entities/crossplane.md), [concepts/managed-resource](../concepts/managed-resource.md), [concepts/idempotency](../concepts/idempotency.md)

---
title: Keep the external name in an annotation or in a spec field
type: decision
status: draft
created: 2026-11-25
updated: 2026-11-26
sources:
  - id: research-idempotency
    hash: 4704ffd77903
    ingested: 2026-11-25
  - id: research-gap-m7-operators-idempotency
    hash: 6c986668a6dc
    ingested: 2026-11-26
aliases: [External name placement]
tags: [decision, crossplane, external-name, api-design]
---

# Keep the external name in an annotation or in a spec field

## Status

Unresolved. Crossplane issue 1863 was closed by a stale bot in 2022 without a decision, and SAP's ADR notes there is no unified guideline across providers. [sources/research-idempotency](../sources/research-idempotency.md)

## Context

A managed resource needs a place to store the identifier of the external resource. Identifiers vary: API Gateway APIs have a name and an AWS-assigned ID, IAM policies use the full ARN, and security groups choose the ID. [sources/research-idempotency](../sources/research-idempotency.md)

## Options

- A single consistent annotation, `crossplane.io/external-name`. It is one known place for every resource, and tooling can rely on it, but users cannot tell what it holds until they look.
- Documented fields in `spec.forProvider`. Each resource type names its identifier explicitly, which is more discoverable, but the place to look then varies per resource, and the maintainers worried that "the place to look to discover the actual external name may not be as consistent as a known annotation."

## Consequences

The annotation approach keeps cross-resource references simple through external name, `nameRef`, and selectors. The field approach moves identity into the typed API and the schema. In either case, whether the external name is defaulted from `metadata.name` determines whether accidental adoption is possible, which SAP addresses by removing the default. See [findings/external-identity-takes-different-forms-across-cloud-apis](../findings/external-identity-takes-different-forms-across-cloud-apis.md) and [entities/crossplane-provider-btp](../entities/crossplane-provider-btp.md).

## Related

[entities/crossplane](../entities/crossplane.md), [concepts/managed-resource](../concepts/managed-resource.md), [concepts/idempotency](../concepts/idempotency.md)

## Update from the m7 dossier

The option text above says the external name defaults from `metadata.name`. The provider source shows that default is switched off for provider-assigned IDs and replaced by templated or parameter-based identifiers for others, which is evidence for both options and a recommendation for neither. See [findings/crossplane-external-names-default-to-the-object-name-only-for-name-based-kinds-and-upjet-providers-switch-the-default-off-for-provider-assigned-ids](../findings/crossplane-external-names-default-to-the-object-name-only-for-name-based-kinds-and-upjet-providers-switch-the-default-off-for-provider-assigned-ids.md), [examples/provider-upjet-aws-maps-s3-buckets-to-a-bucket-parameter-and-vpcs-to-provider-assigned-ids](../examples/provider-upjet-aws-maps-s3-buckets-to-a-bucket-parameter-and-vpcs-to-provider-assigned-ids.md), and [examples/provider-upjet-azure-and-provider-upjet-gcp-template-resource-ids-from-a-user-chosen-name](../examples/provider-upjet-azure-and-provider-upjet-gcp-template-resource-ids-from-a-user-chosen-name.md). [sources/research-gap-m7-operators-idempotency](../sources/research-gap-m7-operators-idempotency.md)

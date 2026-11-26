---
title: External identity takes different forms across cloud APIs
type: finding
status: active
created: 2026-11-25
updated: 2026-11-26
sources:
  - id: research-idempotency
    hash: 4704ffd77903
    ingested: 2026-11-25
  - id: research-gap-m7-operators-idempotency
    hash: 6c986668a6dc
    ingested: 2026-11-26
aliases: [External name inconsistency]
tags: [pitfall, crossplane, external-name, identity]
---

# External identity takes different forms across cloud APIs

## Observation

A controller needs a stable identifier to find an external resource again, but the identifier differs by resource type. It might be a human name, a GUID, an ARN, or a compound key, and users cannot tell which until they inspect the resource. Crossplane issue 1863 shows AWS API Gateway APIs having both a name and an AWS-assigned ID with `GetApi` requiring the ID, IAM policies using the full ARN, and security groups choosing the ID. The `crossplane.io/external-name` annotation was introduced to carry a name from claims to managed resources, to default the external name to `metadata.name`, and to give a place for a cloud-assigned identifier. [[sources/research-idempotency]]

## Consequences

The annotation is a single place to look, but what it holds varies, so documentation per resource is the only guide. Referencing other resources works through the external name, `nameRef`, or a selector, and the Crossplane managed resources page shows a VPC named `my-test-vpc` whose external name is `vpc-01353cfe93950a8ff`. Config Connector restricts resources with service-generated IDs to acquisition through the `resourceID` field. SAP proposes a compound key with `/` as the delimiter and a 512 character limit. [[sources/research-idempotency]]

## Interpretation

The identity form decides which idempotency strategy is available: caller-chosen names allow acquisition, generated IDs force a pending marker or a lookup. The dossier reports no unified guideline across providers, and issue 1863 was closed by a stale bot in 2022 without a decision. See [[decisions/external-name-annotation-or-spec-field]].

## Related

[[concepts/idempotency]], [[entities/crossplane]], [[entities/config-connector]], [[entities/crossplane-provider-btp]]

## Update from the m7 dossier

The provider source now shows the forms per kind: a bucket parameter for S3, provider-assigned IDs for AWS VPCs and instances, and templated IDs from a user-chosen name for Azure and GCP kinds. The default from `metadata.name` is real for name-based kinds and disabled for provider-assigned ones. See [[findings/crossplane-external-names-default-to-the-object-name-only-for-name-based-kinds-and-upjet-providers-switch-the-default-off-for-provider-assigned-ids]], [[examples/provider-upjet-aws-maps-s3-buckets-to-a-bucket-parameter-and-vpcs-to-provider-assigned-ids]], and [[examples/provider-upjet-azure-and-provider-upjet-gcp-template-resource-ids-from-a-user-chosen-name]]. [[sources/research-gap-m7-operators-idempotency]]

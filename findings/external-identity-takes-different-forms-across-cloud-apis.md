---
title: External identity takes different forms across cloud APIs
type: finding
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-idempotency
    hash: 4704ffd77903
    ingested: 2026-11-25
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

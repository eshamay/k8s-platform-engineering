---
title: Adopt-or-create or require explicit import for existing cloud resources
type: decision
status: draft
created: 2026-11-25
updated: 2026-11-26
sources:
  - id: research-idempotency
    hash: 4704ffd77903
    ingested: 2026-11-25
  - id: research-gap-g1-leaked-resources-adoption
    hash: 472b18eb451a
    ingested: 2026-11-26
  - id: research-gap-m7-operators-idempotency
    hash: 6c986668a6dc
    ingested: 2026-11-26
aliases: [Adoption default]
tags: [decision, adoption, ack, crossplane, idempotency]
---

# Adopt-or-create or require explicit import for existing cloud resources

## Status

Open. The dossier reports that the sources do not agree on a default and that no source compares production outcomes. This page records the options and the trade-offs and is not a settled recommendation. [sources/research-idempotency](../sources/research-idempotency.md)

## Context

A provider controller will meet cloud resources that already exist, either from earlier manual work or from a retried create. It must decide whether to take them over automatically. [sources/research-idempotency](../sources/research-idempotency.md)

## Options

- Adopt-or-create by default. ACK supports this through the `adopt-or-create` policy, and Config Connector acquires same-named resources. A retried create converges, and the manifest becomes the source of truth.
- Strict adopt or Observe-only first. ACK offers `adopt`, which imports without changing the resource and fills the spec from AWS. Crossplane's import flow sets an Observe management policy, reads `status.atProvider`, then switches to full management.
- Require explicit intent. SAP's provider removes the default external-name initializer, so an explicitly set external name signals that the resource should exist, and brownfield resources are refused.

## Trade-offs

The first option is declarative and retry-friendly but can overwrite a look-alike resource. The second adds a manual step and lets a person review before management. The third prevents accidental adoption but needs more user effort and may leave a lost-create recovery path to custom code. See [findings/adopt-or-create-can-take-over-a-look-alike-resource](../findings/adopt-or-create-can-take-over-a-look-alike-resource.md) and [comparisons/ambiguous-create-and-adoption-strategies-across-crossplane-sap-ack-and-config-connector](../comparisons/ambiguous-create-and-adoption-strategies-across-crossplane-sap-ack-and-config-connector.md).

## Consequences to plan for

Whatever the policy, set a retain, abandon, or Orphan policy before adopting a resource that must outlive its Kubernetes object. See [findings/destructive-deletion-of-external-resources](../findings/destructive-deletion-of-external-resources.md).

## Related

[concepts/idempotency](../concepts/idempotency.md), [entities/ack](../entities/ack.md), [entities/crossplane](../entities/crossplane.md), [entities/config-connector](../entities/config-connector.md)

## Update from the leaked-resources dossier

The dossier adds failure evidence and still does not settle the default. It records reproduced failures of `adopt-or-create` in ACK (a missing foreign-owner guard, inconsistent semantics across kinds, adopted resources that never reach `Synced`) and one Config Connector acquisition that removed unmodeled settings, and it found no production comparison of the policies. Its reading is that explicit adopt or import fails closed and loud, `adopt-or-create` fails open and quiet, and strict create-only duplicates resources when the create result is lost. Config Connector issue 12740 (open) proposes the explicit-intent posture for server-generated-ID resources, and ACK issue 3143 (open) proposes owner tags in AWS. The evidence supports caution about `adopt-or-create` as a default, and the choice stays a judgment. See [findings/ack-adopt-or-create-removes-the-only-guard-against-two-custom-resources-owning-one-aws-resource](../findings/ack-adopt-or-create-removes-the-only-guard-against-two-custom-resources-owning-one-aws-resource.md), [findings/ack-adoption-semantics-are-inconsistent-across-kinds-and-adopted-resources-can-fail-to-converge](../findings/ack-adoption-semantics-are-inconsistent-across-kinds-and-adopted-resources-can-fail-to-converge.md), [findings/acquiring-an-existing-cloud-resource-can-strip-settings-the-custom-resource-definition-does-not-model](../findings/acquiring-an-existing-cloud-resource-can-strip-settings-the-custom-resource-definition-does-not-model.md), and [findings/no-named-postmortem-or-production-comparison-was-found-for-leaked-resources-or-adopt-or-create-versus-explicit-import](../findings/no-named-postmortem-or-production-comparison-was-found-for-leaked-resources-or-adopt-or-create-versus-explicit-import.md). [sources/research-gap-g1-leaked-resources-adoption](../sources/research-gap-g1-leaked-resources-adoption.md)

## Update from the m7 dossier

Config Connector has an opt-in guard against two objects owning one resource, the lease policy that defaults to `none`. See [findings/config-connector-conflict-prevention-defaults-to-none-so-two-objects-can-manage-one-cloud-resource-unless-a-lease-policy-is-set](../findings/config-connector-conflict-prevention-defaults-to-none-so-two-objects-can-manage-one-cloud-resource-unless-a-lease-policy-is-set.md) and [decisions/set-config-connector-management-conflict-prevention-to-none-or-resource-or-avoid-acquisition](set-config-connector-management-conflict-prevention-to-none-or-resource-or-avoid-acquisition.md). [sources/research-gap-m7-operators-idempotency](../sources/research-gap-m7-operators-idempotency.md)

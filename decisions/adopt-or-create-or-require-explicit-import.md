---
title: Adopt-or-create or require explicit import for existing cloud resources
type: decision
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-idempotency
    hash: 4704ffd77903
    ingested: 2026-11-25
aliases: [Adoption default]
tags: [decision, adoption, ack, crossplane, idempotency]
---

# Adopt-or-create or require explicit import for existing cloud resources

## Status

Open. The dossier reports that the sources do not agree on a default and that no source compares production outcomes. This page records the options and the trade-offs and is not a settled recommendation. [[sources/research-idempotency]]

## Context

A provider controller will meet cloud resources that already exist, either from earlier manual work or from a retried create. It must decide whether to take them over automatically. [[sources/research-idempotency]]

## Options

- Adopt-or-create by default. ACK supports this through the `adopt-or-create` policy, and Config Connector acquires same-named resources. A retried create converges, and the manifest becomes the source of truth.
- Strict adopt or Observe-only first. ACK offers `adopt`, which imports without changing the resource and fills the spec from AWS. Crossplane's import flow sets an Observe management policy, reads `status.atProvider`, then switches to full management.
- Require explicit intent. SAP's provider removes the default external-name initializer, so an explicitly set external name signals that the resource should exist, and brownfield resources are refused.

## Trade-offs

The first option is declarative and retry-friendly but can overwrite a look-alike resource. The second adds a manual step and lets a person review before management. The third prevents accidental adoption but needs more user effort and may leave a lost-create recovery path to custom code. See [[findings/adopt-or-create-can-take-over-a-look-alike-resource]] and [[comparisons/ambiguous-create-and-adoption-strategies-across-crossplane-sap-ack-and-config-connector]].

## Consequences to plan for

Whatever the policy, set a retain, abandon, or Orphan policy before adopting a resource that must outlive its Kubernetes object. See [[findings/destructive-deletion-of-external-resources]].

## Related

[[concepts/idempotency]], [[entities/ack]], [[entities/crossplane]], [[entities/config-connector]]

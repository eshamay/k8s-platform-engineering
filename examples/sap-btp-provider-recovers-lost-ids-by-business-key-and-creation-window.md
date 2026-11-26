---
title: The SAP BTP provider recovers lost IDs by business key and creation window
type: example
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-idempotency
    hash: 4704ffd77903
    ingested: 2026-11-25
aliases: []
tags: [crossplane, sap, idempotency, external-name, recovery]
---

# The SAP BTP provider recovers lost IDs by business key and creation window

## Scenario

SAP's BTP platform assigns identifiers to resources such as Subaccounts, ServiceInstances, and ServiceBindings, so a deterministic name cannot be assumed. The contributors of [[entities/crossplane-provider-btp]] wrote an architecture decision record on how to make a create whose response was lost recoverable without blindly adopting look-alike resources. [[sources/research-idempotency]]

## The recovery steps

1. Recovery runs only when the `external-create-pending` annotation is present, which proves that the provider itself started a create.
2. The provider searches for the resource by a semantic key, for example a subdomain, or a name plus a parent ID.
3. It requires the candidate's `created_at` to fall inside a bounded window around the pending timestamp.
4. On a match it patches the external name onto the managed resource and requeues, which returns the resource to the normal Observe path.
5. A candidate outside the window produces a refused-brownfield warning and is not adopted.

## Related design choices

An explicitly set external name signals that the resource should already exist, and the provider removes the default initializer so that a missing external name never turns into an accidental adoption. Compound keys use `/` as a delimiter with a 512 character limit. The ADR says plainly that this is not an import mechanism. [[sources/research-idempotency]]

## Lesson

The creation-time window and the pending marker together narrow a search that would otherwise be unsafe. The approach needs a stable business key and a trustworthy creation timestamp, so it is custom per resource type. See [[decisions/recover-from-an-ambiguous-create-by-halting-searching-or-tagging]] and [[comparisons/ambiguous-create-and-adoption-strategies-across-crossplane-sap-ack-and-config-connector]].

## Related

[[examples/provider-restart-blocks-a-crossplane-resource-on-external-create-pending]], [[concepts/idempotency]]

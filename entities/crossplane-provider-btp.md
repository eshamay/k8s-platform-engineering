---
title: Crossplane provider for SAP BTP
type: entity
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-idempotency
    hash: 4704ffd77903
    ingested: 2026-11-25
aliases: [crossplane-provider-btp, SAP BTP provider]
tags: [tool, provider, crossplane, sap]
---

# Crossplane provider for SAP BTP

The SAP BTP provider is a [concepts/provider](../concepts/provider.md) for [entities/crossplane](crossplane.md) maintained by SAP contributors. Its managed resources include Subaccount, ServiceInstance, and ServiceBinding. The dossier read one page about it, an architecture decision record on external name handling, so this page covers that design and not the provider as a whole. [sources/research-idempotency](../sources/research-idempotency.md)

## External name handling

The provider's ADR starts from the crossplane-runtime default, which sets the external name to `metadata.name` when it is unset, and from the official import flow: set an Observe policy, set the external name, read `status.atProvider`, then switch to full management. SAP changes the default. An explicitly set external name is treated as a signal that the resource should already exist, so the defaulting initializer is removed, which prevents accidental adoption of a look-alike resource. Compound keys use `/` as the delimiter and a 512 character limit. [sources/research-idempotency](../sources/research-idempotency.md)

## Bounded recovery from a lost ID

For a create whose response was lost, the provider adds a narrow recovery path that applies only when `external-create-pending` is present. It searches by a semantic key, such as a subdomain or a name plus a parent ID, requires the resource's `created_at` to fall inside a bounded window around the pending timestamp, then patches the external name and requeues. A match outside the window produces a refused-brownfield warning. The ADR states that this is not an import mechanism and that brownfield resources are refused. [sources/research-idempotency](../sources/research-idempotency.md) See [examples/sap-btp-provider-recovers-lost-ids-by-business-key-and-creation-window](../examples/sap-btp-provider-recovers-lost-ids-by-business-key-and-creation-window.md) and [decisions/recover-from-an-ambiguous-create-by-halting-searching-or-tagging](../decisions/recover-from-an-ambiguous-create-by-halting-searching-or-tagging.md).

## Related

[findings/an-ambiguous-create-result-halts-reconciliation-until-a-human-intervenes](../findings/an-ambiguous-create-result-halts-reconciliation-until-a-human-intervenes.md), [concepts/idempotency](../concepts/idempotency.md), [concepts/managed-resource](../concepts/managed-resource.md)

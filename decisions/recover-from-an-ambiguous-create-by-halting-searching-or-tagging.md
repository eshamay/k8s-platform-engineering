---
title: Recover from an ambiguous create by halting, searching, or tagging
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
aliases: [Ambiguous create recovery]
tags: [decision, idempotency, crossplane, recovery]
---

# Recover from an ambiguous create by halting, searching, or tagging

## Status

Open. The dossier says the sources show no general solution for recovering from an ambiguous create at scale. [sources/research-idempotency](../sources/research-idempotency.md)

## Context

A provider wrote a pending marker, called a create API, and lost the outcome. The next reconcile must decide whether to create again, adopt something, or wait. See [findings/an-ambiguous-create-result-halts-reconciliation-until-a-human-intervenes](../findings/an-ambiguous-create-result-halts-reconciliation-until-a-human-intervenes.md).

## Options

- Halt and ask a human. Crossplane blocks the resource and tells the operator to remove `external-create-pending` if it is safe to proceed. It is the safest option and does not scale.
- Search by a business key in a bounded window. SAP's provider matches a semantic key and requires `created_at` inside a window around the pending timestamp, and refuses matches outside it. It automates recovery but needs a stable key and a trustworthy timestamp per resource type.
- Look up by tags or labels. The Crossplane maintainer notes it needs per-resource code and fails when the resource type cannot be tagged.
- Prevent the ambiguity. Use caller-chosen identifiers, as Config Connector and ACK do for suitable resources, or a client token, as EC2 does. This depends on the cloud API.

## Consequences

Halting costs human time on each restart during a failing create, while searching risks adopting the wrong resource if the key is weak. Prevention is the most robust choice when the API offers it. The maintainers also proposed letting resources with deterministic identifiers opt out of the pending marker, and that opt-out now exists in crossplane-runtime as `WithDeterministicExternalName` (see [decisions/set-withdeterministicexternalname-for-resources-whose-names-the-user-chooses](set-withdeterministicexternalname-for-resources-whose-names-the-user-chooses.md)). See [comparisons/ambiguous-create-and-adoption-strategies-across-crossplane-sap-ack-and-config-connector](../comparisons/ambiguous-create-and-adoption-strategies-across-crossplane-sap-ack-and-config-connector.md) and [examples/sap-btp-provider-recovers-lost-ids-by-business-key-and-creation-window](../examples/sap-btp-provider-recovers-lost-ids-by-business-key-and-creation-window.md).

## Related

[concepts/idempotency](../concepts/idempotency.md), [entities/crossplane](../entities/crossplane.md), [entities/crossplane-provider-btp](../entities/crossplane-provider-btp.md)

## Update from the leaked-resources dossier

The dossier adds a fifth option under discussion in ACK: record the owner in an AWS tag at creation so a controller can recover a lost ID and refuse foreign resources (ACK issue 3143, an open proposal, with a work-in-progress tag-check change in runtime pull request 261). ACK runtime pull request 292 (merged 2026-11-20) patches status immediately after Create to narrow the window. See [decisions/make-an-ack-create-retry-safe-with-a-stable-client-token-leader-election-or-a-recreate-rollout](make-an-ack-create-retry-safe-with-a-stable-client-token-leader-election-or-a-recreate-rollout.md) and [findings/an-ack-audit-found-48-resources-in-22-controllers-where-a-lost-create-response-duplicates-the-resource-or-wedges-the-custom-resource](../findings/an-ack-audit-found-48-resources-in-22-controllers-where-a-lost-create-response-duplicates-the-resource-or-wedges-the-custom-resource.md). [sources/research-gap-g1-leaked-resources-adoption](../sources/research-gap-g1-leaked-resources-adoption.md)

---
title: Recover from an ambiguous create by halting, searching, or tagging
type: decision
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-idempotency
    hash: 4704ffd77903
    ingested: 2026-11-25
aliases: [Ambiguous create recovery]
tags: [decision, idempotency, crossplane, recovery]
---

# Recover from an ambiguous create by halting, searching, or tagging

## Status

Open. The dossier says the sources show no general solution for recovering from an ambiguous create at scale. [[sources/research-idempotency]]

## Context

A provider wrote a pending marker, called a create API, and lost the outcome. The next reconcile must decide whether to create again, adopt something, or wait. See [[findings/an-ambiguous-create-result-halts-reconciliation-until-a-human-intervenes]].

## Options

- Halt and ask a human. Crossplane blocks the resource and tells the operator to remove `external-create-pending` if it is safe to proceed. It is the safest option and does not scale.
- Search by a business key in a bounded window. SAP's provider matches a semantic key and requires `created_at` inside a window around the pending timestamp, and refuses matches outside it. It automates recovery but needs a stable key and a trustworthy timestamp per resource type.
- Look up by tags or labels. The Crossplane maintainer notes it needs per-resource code and fails when the resource type cannot be tagged.
- Prevent the ambiguity. Use caller-chosen identifiers, as Config Connector and ACK do for suitable resources, or a client token, as EC2 does. This depends on the cloud API.

## Consequences

Halting costs human time on each restart during a failing create, while searching risks adopting the wrong resource if the key is weak. Prevention is the most robust choice when the API offers it. The maintainers also proposed letting resources with deterministic identifiers opt out of the pending marker. See [[comparisons/ambiguous-create-and-adoption-strategies-across-crossplane-sap-ack-and-config-connector]] and [[examples/sap-btp-provider-recovers-lost-ids-by-business-key-and-creation-window]].

## Related

[[concepts/idempotency]], [[entities/crossplane]], [[entities/crossplane-provider-btp]]

---
title: Ambiguous-create and adoption strategies across Crossplane, SAP, ACK, and Config Connector
type: comparison
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-idempotency
    hash: 4704ffd77903
    ingested: 2026-11-25
  - id: research-managed-resource
    hash: 09ca2f9dcdc6
    ingested: 2026-11-25
aliases: []
tags: [comparison, idempotency, adoption, external-name, crossplane, ack, config-connector]
---

# Ambiguous-create and adoption strategies across Crossplane, SAP, ACK, and Config Connector

The table summarizes how each approach handles a create whose result is unknown and how it treats a resource that already exists. All entries come from the idempotency dossier. [[sources/research-idempotency]]

| Question | [[entities/crossplane]] | [[entities/crossplane-provider-btp]] | [[entities/ack]] | [[entities/config-connector]] | Cloud API with client token |
|---|---|---|---|---|---|
| Stable identity | `crossplane.io/external-name` annotation, defaulting to `metadata.name` | Same annotation, but explicitly set, with `/` compound keys up to 512 characters | Identifier fields named by `adoption-fields` | Same name, or `resourceID` for service-generated IDs | Client token stored with the resource |
| Lost create response | Writes `external-create-pending`, then halts and asks a human | Searches by business key inside a creation-time window, only when pending is present | Adopt-or-create finds the existing resource by name or ID | Acquires a same-named resource | The service recognizes the retry and returns an equivalent response |
| Existing resource | Observe policy, set external name, read `status.atProvider`, then manage | Refused unless the external name was set explicitly | `adopt` (strict) or `adopt-or-create` | Acquired automatically on name match | Not applicable |
| Delete | Only when the managed resource is deleted, with `managementPolicies` and `deletionPolicy` controls | Same as Crossplane | Deletes by default, `deletionPolicy: Retain` keeps | Deletes by default, `abandon` keeps | Not applicable |
| Main risk | Needs a human after ambiguity | Needs a business key and a trustworthy creation time | Overwrites a look-alike to match the spec | Takes over a same-named resource | Depends on the provider offering the token |

## Reading the comparison

Crossplane optimizes for never duplicating or leaking a resource and accepts a human step, ACK and Config Connector optimize for convergence and accept the chance of adopting something unintended, and SAP's design sits between them by requiring explicit intent and bounding recovery. The dossier does not compare production outcomes, and it did not read kro or Cluster API material. See [[findings/an-ambiguous-create-result-halts-reconciliation-until-a-human-intervenes]], [[findings/adopt-or-create-can-take-over-a-look-alike-resource]], [[decisions/adopt-or-create-or-require-explicit-import]], and [[concepts/idempotency]].

## Observe-only import and read-only controls

The managed resource dossier reads the Crossplane import guide and observe-only design document, ACK's read-only annotation, and Config Connector's acquire-by-name behavior in more depth. The explicit Observe-then-promote flow and ACK's read-only versus adoption split are compared in [[comparisons/observe-only-and-keep-controls-across-crossplane-config-connector-and-ack]], and the import steps are in [[examples/crossplane-import-of-an-existing-gcp-database-observes-first-then-takes-control]]. [[sources/research-managed-resource]]

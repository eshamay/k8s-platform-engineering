---
title: Ambiguous-create and adoption strategies across Crossplane, SAP, ACK, and Config Connector
type: comparison
status: active
created: 2026-11-25
updated: 2026-11-26
sources:
  - id: research-idempotency
    hash: 4704ffd77903
    ingested: 2026-11-25
  - id: research-managed-resource
    hash: 09ca2f9dcdc6
    ingested: 2026-11-25
  - id: research-gap-g1-leaked-resources-adoption
    hash: 472b18eb451a
    ingested: 2026-11-26
aliases: []
tags: [comparison, idempotency, adoption, external-name, crossplane, ack, config-connector]
---

# Ambiguous-create and adoption strategies across Crossplane, SAP, ACK, and Config Connector

The table summarizes how each approach handles a create whose result is unknown and how it treats a resource that already exists. All entries come from the idempotency dossier. [[sources/research-idempotency]]

| Question | [[entities/crossplane]] | [[entities/crossplane-provider-btp]] | [[entities/ack]] | [[entities/config-connector]] | Cloud API with client token |
|---|---|---|---|---|---|
| Stable identity | `crossplane.io/external-name` annotation, defaulting to `metadata.name` | Same annotation, but explicitly set, with `/` compound keys up to 512 characters | Identifier fields named by `adoption-fields` | Same name, or `resourceID` for service-generated IDs | Client token stored with the resource |
| Lost create response | Writes `external-create-pending`, then halts and asks a human | Searches by business key inside a creation-time window, only when pending is present | Adopt-or-create finds the existing resource by name or ID, but only if the identifier was recorded (see the update below) | Acquires a same-named resource | The service recognizes the retry and returns an equivalent response |
| Existing resource | Observe policy, set external name, read `status.atProvider`, then manage | Refused unless the external name was set explicitly | `adopt` (strict) or `adopt-or-create` | Acquired automatically on name match | Not applicable |
| Delete | Only when the managed resource is deleted, with `managementPolicies` and `deletionPolicy` controls | Same as Crossplane | Deletes by default, `deletionPolicy: Retain` keeps | Deletes by default, `abandon` keeps | Not applicable |
| Main risk | Needs a human after ambiguity | Needs a business key and a trustworthy creation time | Overwrites a look-alike to match the spec | Takes over a same-named resource | Depends on the provider offering the token |

## Reading the comparison

Crossplane optimizes for never duplicating or leaking a resource and accepts a human step, ACK and Config Connector optimize for convergence and accept the chance of adopting something unintended, and SAP's design sits between them by requiring explicit intent and bounding recovery. The dossier does not compare production outcomes, and it did not read kro or Cluster API material. See [[findings/an-ambiguous-create-result-halts-reconciliation-until-a-human-intervenes]], [[findings/adopt-or-create-can-take-over-a-look-alike-resource]], [[decisions/adopt-or-create-or-require-explicit-import]], and [[concepts/idempotency]].

## Observe-only import and read-only controls

The managed resource dossier reads the Crossplane import guide and observe-only design document, ACK's read-only annotation, and Config Connector's acquire-by-name behavior in more depth. The explicit Observe-then-promote flow and ACK's read-only versus adoption split are compared in [[comparisons/observe-only-and-keep-controls-across-crossplane-config-connector-and-ack]], and the import steps are in [[examples/crossplane-import-of-an-existing-gcp-database-observes-first-then-takes-control]]. [[sources/research-managed-resource]]

## Update from the leaked-resources dossier

Correction note: the "Lost create response" cell for ACK above describes adoption as the recovery, and the dossier shows it is not one when the identifier was never recorded. ACK issue 3177 audits 48 resources in 22 controllers where a lost Create response duplicates the AWS resource (28) or wedges the custom resource because the name is taken (20) ([[findings/an-ack-audit-found-48-resources-in-22-controllers-where-a-lost-create-response-duplicates-the-resource-or-wedges-the-custom-resource]]). The "Main risk" cells are now backed by reproduced cases: ACK adopt-or-create has no foreign-owner guard ([[findings/ack-adopt-or-create-removes-the-only-guard-against-two-custom-resources-owning-one-aws-resource]]), and Config Connector acquisition removed unmodeled bucket settings ([[findings/acquiring-an-existing-cloud-resource-can-strip-settings-the-custom-resource-definition-does-not-model]]). On the Crossplane side the deterministic-name opt-out exists in the runtime and upjet providers do not set it ([[findings/provider-upjet-aws-controllers-do-not-set-withdeterministicexternalname-so-deterministically-named-resources-stay-stuck-after-a-transient-error]]). The dossier found no production comparison of the policies. [[sources/research-gap-g1-leaked-resources-adoption]]

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
  - id: research-gap-m7-operators-idempotency
    hash: 6c986668a6dc
    ingested: 2026-11-26
aliases: []
tags: [comparison, idempotency, adoption, external-name, crossplane, ack, config-connector]
---

# Ambiguous-create and adoption strategies across Crossplane, SAP, ACK, and Config Connector

The table summarizes how each approach handles a create whose result is unknown and how it treats a resource that already exists. All entries come from the idempotency dossier. [sources/research-idempotency](../sources/research-idempotency.md)

| Question | [entities/crossplane](../entities/crossplane.md) | [entities/crossplane-provider-btp](../entities/crossplane-provider-btp.md) | [entities/ack](../entities/ack.md) | [entities/config-connector](../entities/config-connector.md) | Cloud API with client token |
|---|---|---|---|---|---|
| Stable identity | `crossplane.io/external-name` annotation, defaulting to `metadata.name` | Same annotation, but explicitly set, with `/` compound keys up to 512 characters | Identifier fields named by `adoption-fields` | Same name, or `resourceID` for service-generated IDs | Client token stored with the resource |
| Lost create response | Writes `external-create-pending`, then halts and asks a human | Searches by business key inside a creation-time window, only when pending is present | Adopt-or-create finds the existing resource by name or ID, but only if the identifier was recorded (see the update below) | Acquires a same-named resource | The service recognizes the retry and returns an equivalent response |
| Existing resource | Observe policy, set external name, read `status.atProvider`, then manage | Refused unless the external name was set explicitly | `adopt` (strict) or `adopt-or-create` | Acquired automatically on name match | Not applicable |
| Delete | Only when the managed resource is deleted, with `managementPolicies` and `deletionPolicy` controls | Same as Crossplane | Deletes by default, `deletionPolicy: Retain` keeps | Deletes by default, `abandon` keeps | Not applicable |
| Main risk | Needs a human after ambiguity | Needs a business key and a trustworthy creation time | Overwrites a look-alike to match the spec | Takes over a same-named resource | Depends on the provider offering the token |

## Reading the comparison

Crossplane optimizes for never duplicating or leaking a resource and accepts a human step, ACK and Config Connector optimize for convergence and accept the chance of adopting something unintended, and SAP's design sits between them by requiring explicit intent and bounding recovery. The dossier does not compare production outcomes, and it did not read kro or Cluster API material. See [findings/an-ambiguous-create-result-halts-reconciliation-until-a-human-intervenes](../findings/an-ambiguous-create-result-halts-reconciliation-until-a-human-intervenes.md), [findings/adopt-or-create-can-take-over-a-look-alike-resource](../findings/adopt-or-create-can-take-over-a-look-alike-resource.md), [decisions/adopt-or-create-or-require-explicit-import](../decisions/adopt-or-create-or-require-explicit-import.md), and [concepts/idempotency](../concepts/idempotency.md).

## Observe-only import and read-only controls

The managed resource dossier reads the Crossplane import guide and observe-only design document, ACK's read-only annotation, and Config Connector's acquire-by-name behavior in more depth. The explicit Observe-then-promote flow and ACK's read-only versus adoption split are compared in [comparisons/observe-only-and-keep-controls-across-crossplane-config-connector-and-ack](observe-only-and-keep-controls-across-crossplane-config-connector-and-ack.md), and the import steps are in [examples/crossplane-import-of-an-existing-gcp-database-observes-first-then-takes-control](../examples/crossplane-import-of-an-existing-gcp-database-observes-first-then-takes-control.md). [sources/research-managed-resource](../sources/research-managed-resource.md)

## Update from the leaked-resources dossier

Correction note: the "Lost create response" cell for ACK above describes adoption as the recovery, and the dossier shows it is not one when the identifier was never recorded. ACK issue 3177 audits 48 resources in 22 controllers where a lost Create response duplicates the AWS resource (28) or wedges the custom resource because the name is taken (20) ([findings/an-ack-audit-found-48-resources-in-22-controllers-where-a-lost-create-response-duplicates-the-resource-or-wedges-the-custom-resource](../findings/an-ack-audit-found-48-resources-in-22-controllers-where-a-lost-create-response-duplicates-the-resource-or-wedges-the-custom-resource.md)). The "Main risk" cells are now backed by reproduced cases: ACK adopt-or-create has no foreign-owner guard ([findings/ack-adopt-or-create-removes-the-only-guard-against-two-custom-resources-owning-one-aws-resource](../findings/ack-adopt-or-create-removes-the-only-guard-against-two-custom-resources-owning-one-aws-resource.md)), and Config Connector acquisition removed unmodeled bucket settings ([findings/acquiring-an-existing-cloud-resource-can-strip-settings-the-custom-resource-definition-does-not-model](../findings/acquiring-an-existing-cloud-resource-can-strip-settings-the-custom-resource-definition-does-not-model.md)). On the Crossplane side the deterministic-name opt-out exists in the runtime and upjet providers do not set it ([findings/provider-upjet-aws-controllers-do-not-set-withdeterministicexternalname-so-deterministically-named-resources-stay-stuck-after-a-transient-error](../findings/provider-upjet-aws-controllers-do-not-set-withdeterministicexternalname-so-deterministically-named-resources-stay-stuck-after-a-transient-error.md)). The dossier found no production comparison of the policies. [sources/research-gap-g1-leaked-resources-adoption](../sources/research-gap-g1-leaked-resources-adoption.md)

## Update from the m7 dossier

Correction note, 2026-11-26: the "Stable identity" cell for Crossplane says the annotation defaults to `metadata.name`, which holds for name-based kinds only. Upjet providers disable the default for provider-assigned IDs ([findings/crossplane-external-names-default-to-the-object-name-only-for-name-based-kinds-and-upjet-providers-switch-the-default-off-for-provider-assigned-ids](../findings/crossplane-external-names-default-to-the-object-name-only-for-name-based-kinds-and-upjet-providers-switch-the-default-off-for-provider-assigned-ids.md)). The "did not read kro or Cluster API" statement above is superseded. Two rows can now be added from primary text.

| Question | [entities/kro](../entities/kro.md) | [entities/cluster-api](../entities/cluster-api.md) |
|---|---|---|
| Stable identity | Labels `kro.run/owned` and `kro.run/instance-id`, an ApplySet inventory, and `status.managedResources` for Kubernetes children; names only as templated by the graph author | `spec.providerID` on the InfraMachine, plus provider-owned tags or labels; names must not be the only lookup key |
| Lost create response | Intent is recorded in `status.managedResources` before apply, so a restart does not lose track of Kubernetes children; cloud creates go through other operators | No algorithm stated; relies on tags and the provider ID, and provider code was not read |
| Existing resource | Applies without force, and a foreign field owner yields `FieldManagerConflict` | Not stated in the pages read |
| Main risk | Scope is Kubernetes objects, not external clouds | Enforcement is left to each provider |

Config Connector's conflict row is also refined: two objects can target one resource, and a lease policy that defaults to `none` is the only guard ([findings/config-connector-conflict-prevention-defaults-to-none-so-two-objects-can-manage-one-cloud-resource-unless-a-lease-policy-is-set](../findings/config-connector-conflict-prevention-defaults-to-none-so-two-objects-can-manage-one-cloud-resource-unless-a-lease-policy-is-set.md)). See [findings/kro-records-the-resources-it-is-about-to-create-in-status-before-applying-them-and-applies-without-force](../findings/kro-records-the-resources-it-is-about-to-create-in-status-before-applying-them-and-applies-without-force.md) and [findings/cluster-api-tells-providers-not-to-use-a-derived-name-as-the-only-lookup-key-and-states-no-lost-create-algorithm](../findings/cluster-api-tells-providers-not-to-use-a-derived-name-as-the-only-lookup-key-and-states-no-lost-create-algorithm.md). [sources/research-gap-m7-operators-idempotency](../sources/research-gap-m7-operators-idempotency.md)

---
title: A create that succeeds while the status write fails can leak an external resource
type: finding
status: active
created: 2026-11-25
updated: 2026-11-26
sources:
  - id: research-reconciliation-loop
    hash: df7d66206baf
    ingested: 2026-11-25
  - id: research-idempotency
    hash: 4704ffd77903
    ingested: 2026-11-25
  - id: research-gap-g1-leaked-resources-adoption
    hash: 472b18eb451a
    ingested: 2026-11-26
aliases: [Leaked cloud resources]
tags: [crossplane, external-resources, idempotency, reconciliation]
---

# A create that succeeds while the status write fails can leak an external resource

## Observation

A reconciler for an external API makes a create call and then records the result. If the create succeeds but the write that records it fails, the next reconcile sees no record and may create a second resource, leaving the first orphaned and billed. The Crossplane managed resources documentation addresses this with create-tracking annotations that record create pending, succeeded, and failed, so a create is not repeated or leaked. [[sources/research-reconciliation-loop]]

## Related safeguards

Crossplane also uses the `crossplane.io/external-name` annotation as the provider-side identifier, `managementPolicies` to restrict what actions Crossplane may take, the `crossplane.io/paused` annotation to stop action, and `deletionPolicy` to choose between `Delete` and `Orphan`. The Ahmet Alp Balkan guide makes the general point that calling a cloud API on every reconcile wastes quota and time, and recommends tracking progress in status. [[sources/research-reconciliation-loop]]

## Why it matters

Idempotency for external systems cannot rest on the object's own status alone, because the status write is a separate failure point. The pattern is a durable marker written before or around the side effect. See [[concepts/idempotency]] and [[findings/destructive-deletion-of-external-resources]].

## Related

[[entities/crossplane]], [[concepts/managed-resource]], [[findings/cost-of-constant-reconciliation]], [[concepts/reconciliation-loop]]

## Further evidence from the idempotency dossier

Crossplane issue 3037 documents the same hazard from the provider side: the pending, succeeded, and failed annotations are written within one reconcile, and a restart in between blocks the resource until a human removes the pending marker. SAP's provider adds a bounded lookup that recovers the lost ID automatically. [[sources/research-idempotency]] See [[findings/an-ambiguous-create-result-halts-reconciliation-until-a-human-intervenes]] and [[examples/sap-btp-provider-recovers-lost-ids-by-business-key-and-creation-window]].

## Further evidence from the leaked-resources dossier

ACK runtime pull request 292 (merged 2026-11-20) moves the status patch to immediately after Create, because a controller stopped before it "left a resource in AWS whose identifier the CR did not have". An audit counts 48 ACK resources exposed to a lost create response, and a CI run shows a duplicate VPC endpoint. The merge narrows the window and does not close it. See [[findings/an-ack-audit-found-48-resources-in-22-controllers-where-a-lost-create-response-duplicates-the-resource-or-wedges-the-custom-resource]] and [[examples/ack-issue-3122-a-controller-restart-during-a-rollout-created-a-second-vpc-endpoint-and-blocked-subnet-deletion-for-about-two-hours]]. [[sources/research-gap-g1-leaked-resources-adoption]]

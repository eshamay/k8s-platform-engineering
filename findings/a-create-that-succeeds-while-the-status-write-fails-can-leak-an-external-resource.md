---
title: A create that succeeds while the status write fails can leak an external resource
type: finding
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-reconciliation-loop
    hash: df7d66206baf
    ingested: 2026-11-25
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

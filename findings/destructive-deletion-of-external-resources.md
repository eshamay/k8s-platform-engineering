---
title: Destructive deletion of external resources
type: finding
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-universal-control-plane
    hash: 037575049a4c
    ingested: 2026-11-25
  - id: research-declarative-vs-imperative
    hash: 570767ba4094
    ingested: 2026-11-25
  - id: research-idempotency
    hash: 4704ffd77903
    ingested: 2026-11-25
aliases: []
tags: [pitfall, deletion, finalizers, safety]
---

# Destructive deletion of external resources

## Observation

When a Kubernetes object maps to a real cloud resource, removing the object can delete real infrastructure. [[entities/config-connector]] deletes the Google Cloud resource by default and offers a `deletion-policy: abandon` annotation to retain it. [[entities/ack]] has a deletion-policy annotation and adoption of pre-existing resources. Flux `prune` deletes any object that was dropped from the Git revision when `.spec.prune` is enabled. [[sources/research-universal-control-plane]]

## Why it happens

Cleanup is meant to run before an object disappears, and finalizers are the mechanism that makes it so. See [[concepts/finalizers]]. The same mechanism makes deletion cascade to the external system, so a deleted CRD, a mistaken Git removal, or an accidental `kubectl delete` can all reach the cloud.

## Mitigations

Set retain or abandon policies on critical resources, review `prune` settings, and remember that adoption by matching name is both a migration aid and a hazard. The dossier found no postmortem of a CRD-deletion cascade, which is tracked as a gap.

## Related

[[concepts/owner-references-and-garbage-collection]], [[findings/immutable-fields-and-drift-collisions]]

## Additional evidence

The ACK deletion-policy page confirms that the AWS resource is deleted first by default and that a `retain` policy is available. Flux has a deletion policy including Orphan, and the kubectl tutorial warns about `apply --prune`. [[sources/research-declarative-vs-imperative]] See [[comparisons/deletion-policies-across-gitops-and-provider-tools]] and [[findings/unintended-deletion-through-prune]].

## Deletion behavior in adopted resources

The idempotency dossier adds that adoption interacts with deletion: in ACK and Config Connector, deleting the Kubernetes object deletes an adopted cloud resource unless a retain or abandon policy is set, and Crossplane deletes the external resource only when its managed resource is deleted, with `managementPolicies` able to omit Delete. [[sources/research-idempotency]] See [[findings/adopt-or-create-can-take-over-a-look-alike-resource]].

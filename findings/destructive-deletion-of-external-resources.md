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
  - id: research-finalizers
    hash: ca11dffc241b
    ingested: 2026-11-25
  - id: research-owner-references-and-garbage-collection
    hash: bd4cc1219f2d
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

## Evidence from the finalizers dossier

A consultancy article reports that Config Connector deletes the Google Cloud resource through a finalizer even when production uses it, and that Crossplane, ACK, and Config Connector all delete by default with retain, abandon, or Orphan as the opt-out, applied before the delete. A GitOps prune or a mistaken manifest removal can trigger the cascade. [[sources/research-finalizers]] See [[decisions/delete-or-retain-the-external-resource-when-the-kubernetes-object-is-deleted]] and [[examples/crossplane-ack-and-config-connector-delete-the-cloud-resource-before-the-kubernetes-object]].

## Owner references stop at the cluster boundary

Owner references only reach Kubernetes objects, so cascade deletion never covers cloud resources, which need finalizers or a provider deletion policy such as Config Connector's abandon annotation. [[sources/research-owner-references-and-garbage-collection]] See [[concepts/owner-references-and-garbage-collection]].

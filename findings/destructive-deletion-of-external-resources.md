---
title: Destructive deletion of external resources
type: finding
status: active
created: 2026-11-25
updated: 2026-11-26
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
  - id: research-managed-resource
    hash: 09ca2f9dcdc6
    ingested: 2026-11-25
  - id: research-gap-g1-leaked-resources-adoption
    hash: 472b18eb451a
    ingested: 2026-11-26
  - id: research-gap-g1-other-tool-pitfalls
    hash: a942f0ae1b1b
    ingested: 2026-11-26
aliases: []
tags: [pitfall, deletion, finalizers, safety]
---

# Destructive deletion of external resources

## Observation

When a Kubernetes object maps to a real cloud resource, removing the object can delete real infrastructure. [entities/config-connector](../entities/config-connector.md) deletes the Google Cloud resource by default and offers a `deletion-policy: abandon` annotation to retain it. [entities/ack](../entities/ack.md) has a deletion-policy annotation and adoption of pre-existing resources. Flux `prune` deletes any object that was dropped from the Git revision when `.spec.prune` is enabled. [sources/research-universal-control-plane](../sources/research-universal-control-plane.md)

## Why it happens

Cleanup is meant to run before an object disappears, and finalizers are the mechanism that makes it so. See [concepts/finalizers](../concepts/finalizers.md). The same mechanism makes deletion cascade to the external system, so a deleted CRD, a mistaken Git removal, or an accidental `kubectl delete` can all reach the cloud.

## Mitigations

Set retain or abandon policies on critical resources, review `prune` settings, and remember that adoption by matching name is both a migration aid and a hazard. The dossier found no postmortem of a CRD-deletion cascade, which is tracked as a gap.

## Related

[concepts/owner-references-and-garbage-collection](../concepts/owner-references-and-garbage-collection.md), [findings/immutable-fields-and-drift-collisions](immutable-fields-and-drift-collisions.md)

## Additional evidence

The ACK deletion-policy page confirms that the AWS resource is deleted first by default and that a `retain` policy is available. Flux has a deletion policy including Orphan, and the kubectl tutorial warns about `apply --prune`. [sources/research-declarative-vs-imperative](../sources/research-declarative-vs-imperative.md) See [comparisons/deletion-policies-across-gitops-and-provider-tools](../comparisons/deletion-policies-across-gitops-and-provider-tools.md) and [findings/unintended-deletion-through-prune](unintended-deletion-through-prune.md).

## Deletion behavior in adopted resources

The idempotency dossier adds that adoption interacts with deletion: in ACK and Config Connector, deleting the Kubernetes object deletes an adopted cloud resource unless a retain or abandon policy is set, and Crossplane deletes the external resource only when its managed resource is deleted, with `managementPolicies` able to omit Delete. [sources/research-idempotency](../sources/research-idempotency.md) See [findings/adopt-or-create-can-take-over-a-look-alike-resource](adopt-or-create-can-take-over-a-look-alike-resource.md).

## Evidence from the finalizers dossier

A consultancy article reports that Config Connector deletes the Google Cloud resource through a finalizer even when production uses it, and that Crossplane, ACK, and Config Connector all delete by default with retain, abandon, or Orphan as the opt-out, applied before the delete. A GitOps prune or a mistaken manifest removal can trigger the cascade. [sources/research-finalizers](../sources/research-finalizers.md) See [decisions/delete-or-retain-the-external-resource-when-the-kubernetes-object-is-deleted](../decisions/delete-or-retain-the-external-resource-when-the-kubernetes-object-is-deleted.md) and [examples/crossplane-ack-and-config-connector-delete-the-cloud-resource-before-the-kubernetes-object](../examples/crossplane-ack-and-config-connector-delete-the-cloud-resource-before-the-kubernetes-object.md).

## Owner references stop at the cluster boundary

Owner references only reach Kubernetes objects, so cascade deletion never covers cloud resources, which need finalizers or a provider deletion policy such as Config Connector's abandon annotation. [sources/research-owner-references-and-garbage-collection](../sources/research-owner-references-and-garbage-collection.md) See [concepts/owner-references-and-garbage-collection](../concepts/owner-references-and-garbage-collection.md).

## Managed resource dossier additions

The managed resource dossier confirms that deleting the Kubernetes object deletes the cloud resource by default in Crossplane, Config Connector, and ACK, and adds two Crossplane guardrails: policies that omit Delete (the v2 orphan idiom, since namespaced managed resources have no `deletionPolicy`) and Usages, which block deletion of a resource that is in use. It also records that a Git removal chains through Flux prune and then the provider delete unless Delete is excluded. [sources/research-managed-resource](../sources/research-managed-resource.md) See [examples/crossplane-usages-order-deletion-and-guard-against-accidental-removal](../examples/crossplane-usages-order-deletion-and-guard-against-accidental-removal.md) and [comparisons/observe-only-and-keep-controls-across-crossplane-config-connector-and-ack](../comparisons/observe-only-and-keep-controls-across-crossplane-config-connector-and-ack.md).

## Evidence from the leaked-resources dossier

In the ACK issue 3149 reproduction, deleting either of two custom resources that had adopted the same IAM role deleted the role in 4 ms, and the surviving custom resource created a replacement with a new role ID on its next resync. The run was against moto and not real AWS. See [examples/ack-issue-3149-adopt-or-create-let-two-custom-resources-overwrite-one-iam-role-and-deleting-either-deleted-it](../examples/ack-issue-3149-adopt-or-create-let-two-custom-resources-overwrite-one-iam-role-and-deleting-either-deleted-it.md). [sources/research-gap-g1-leaked-resources-adoption](../sources/research-gap-g1-leaked-resources-adoption.md)

## First-party reports from the other-tool pitfalls dossier

Four open 2026 reports add first-party evidence for this pattern. ACK issue 3153 says a pruned CR deletes the AWS resource irreversibly and issue 3154 says the namespace retain annotation is ignored in single-namespace installs ([findings/pruning-an-ack-custom-resource-deletes-the-aws-resource-and-the-namespace-retain-annotation-is-ignored-in-single-namespace-installs](pruning-an-ack-custom-resource-deletes-the-aws-resource-and-the-namespace-retain-annotation-is-ignored-in-single-namespace-installs.md)). Config Connector issue 16444 says a stale deletion after leader failover removed live GCP resources ([findings/config-connector-leader-election-across-clusters-can-run-a-stale-deletion-against-live-google-cloud-resources](config-connector-leader-election-across-clusters-can-run-a-stale-deletion-against-live-google-cloud-resources.md)), and issue 15930 says `abandon` does not release stuck Direct-controller resources ([findings/config-connector-direct-controller-resources-stick-in-terminating-when-a-parent-is-deleted-first-and-abandon-does-not-release-them](config-connector-direct-controller-resources-stick-in-terminating-when-a-parent-is-deleted-first-and-abandon-does-not-release-them.md)). kro issue 1171 reports children left behind after a crash mid-deletion ([findings/a-kro-controller-crash-during-instance-deletion-can-leave-the-finalizer-and-children-according-to-a-fault-injection-report](a-kro-controller-crash-during-instance-deletion-can-leave-the-finalizer-and-children-according-to-a-fault-injection-report.md)). All are single-reporter claims. The page is promoted to active because the pattern now has first-party evidence for ACK, Config Connector, and kro as well as the earlier sources. [sources/research-gap-g1-other-tool-pitfalls](../sources/research-gap-g1-other-tool-pitfalls.md)

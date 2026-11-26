---
title: Finalizers
type: concept
status: active
created: 2026-11-25
updated: 2026-11-26
sources:
  - id: krm-platform-vocabulary
    hash: 731a6941f9db
    ingested: 2026-11-25
  - id: research-finalizers
    hash: ca11dffc241b
    ingested: 2026-11-25
  - id: research-owner-references-and-garbage-collection
    hash: bd4cc1219f2d
    ingested: 2026-11-25
  - id: research-pitfalls-and-case-studies
    hash: 9407913c2448
    ingested: 2026-11-25
  - id: research-gap-g1-gitops-drift-incidents
    hash: 0a1a75f3cab5
    ingested: 2026-11-26
aliases: [metadata.finalizers, deletion gate, pre-delete hook]
tags: [controllers, finalizers, deletion]
---

# Finalizers

## Definition

String tokens in `metadata.finalizers` that stop Kubernetes from deleting an object from etcd until the controller has deleted the matching external resource, for example tearing down an AWS RDS instance before removing its KRM representation. [[sources/krm-platform-vocabulary]] The Kubernetes documentation says a finalizer "prevents the object from being removed until all items are removed from its `metadata.finalizers` field." [[sources/research-finalizers]]

## Why it matters

Finalizers make deletion safe for external resources, and they cause the most familiar operational pain: objects stuck in `Terminating` when a controller is gone or failing. This is a leading pitfall for [[concepts/managed-resource]] cleanup. The sources treat a finalizer together with a deletion policy as a safety and cost control, and as the main cause of stuck deletions. [[sources/research-finalizers]]

## The two-phase delete

When a client deletes an object that carries finalizers, the API server does not remove it. It sets `metadata.deletionTimestamp`, returns HTTP 202, and leaves the object visible in a Terminating state. Controllers that watch the object see the timestamp, do their cleanup, and remove their own entry from the list. When the list is empty the object is deleted. A delete therefore becomes a mark followed by a removal. With a finalizer in place a controller sees the delete as an update, while without one it sees only that the object is gone. [[sources/research-finalizers]] See [[examples/pv-protection-finalizer-keeps-an-in-use-volume-from-vanishing]] for the simplest case.

## Rules the API server enforces

- After `deletionTimestamp` is set, nobody can add a new finalizer, and the timestamp cannot be changed. The only permitted edit is removal, and the object cannot be resurrected. See [[findings/a-finalizer-added-after-the-delete-request-is-too-late-and-new-ones-are-refused]].
- Custom finalizer names must be qualified, such as `example.com/cleanup`, and the API server rejects unqualified names. The farishuskovic.dev tutorial recommends domain-scoped names.
- Kubernetes uses finalizers itself: `kubernetes.io/pv-protection`, and `foregroundDeletion` and `orphan` for cascading deletion.

[[sources/research-finalizers]]

## Finalizers versus owner references

Owner references describe parent-child links for the garbage collector, while finalizers gate whether one object may disappear. They interact in foreground deletion, where the garbage collector puts a finalizer on the owner and waits for dependents with `blockOwnerDeletion=true`. Background deletion, the default, removes the owner at once and cleans dependents later, and orphan mode uses the `orphan` finalizer to leave them behind. [[sources/research-finalizers]] See [[concepts/owner-references-and-garbage-collection]] and [[findings/foreground-deletion-waits-only-for-dependents-with-blockownerdeletion-true]].

## The controller pattern

The standard Reconcile pattern adds the finalizer on the first pass, before any external resource is created, and when the object is later marked for deletion it runs cleanup, removes the finalizer, and updates the object. Cleanup has to be idempotent, has to treat an already-deleted external resource as success, and has to run before the finalizer is removed. The controller also needs RBAC permission to update `resources/finalizers`. Authors suggest finalizers for external resources, cross-namespace management, and audit logging, and not for in-cluster cleanup that garbage collection already handles. [[sources/research-finalizers]] See [[examples/kubebuilder-reconcile-adds-a-finalizer-before-external-work-and-removes-it-after-cleanup]], [[concepts/idempotency]], and [[concepts/reconciliation-loop]].

## How platform tools apply finalizers

Crossplane, ACK, and Config Connector default to deleting the external resource when the Kubernetes object is deleted, and each offers an opt-out: Orphan, retain, or abandon. Argo CD and Flux decide whether deleting a GitOps object also deletes what it deployed. kro and Cluster API order the teardown and hold the parent until the children are gone. [[sources/research-finalizers]] See [[examples/crossplane-ack-and-config-connector-delete-the-cloud-resource-before-the-kubernetes-object]], [[comparisons/finalizer-gated-teardown-across-argo-cd-flux-kro-and-cluster-api]], [[comparisons/deletion-policies-across-gitops-and-provider-tools]], and [[decisions/delete-or-retain-the-external-resource-when-the-kubernetes-object-is-deleted]].

## Pitfalls

- A controller that is missing, an uninstalled operator, or a deleted cluster leaves objects stranded and leaks external resources. See [[findings/finalizers-strand-objects-in-terminating-when-the-controller-is-missing-or-failing]] and [[findings/deleting-the-cluster-first-orphans-cloud-resources-because-the-controller-is-gone]].
- Cleanup that always errors, or that fails when the external resource is already gone, keeps the object in Terminating. See [[findings/cleanup-that-always-errors-or-assumes-the-external-resource-exists-strands-the-object]].
- A child with its own finalizer holds its parent, and a dependency without a finalizer can vanish early. See [[findings/a-credentials-secret-without-a-finalizer-can-vanish-before-managed-resources-finish-cleanup]].
- Cluster API teardown stops on disruption budgets, attached volumes, and failing hooks. See [[findings/machine-deletion-stalls-on-disruption-budgets-attached-volumes-and-failing-hooks]].
- Forced removal is the dangerous shortcut: it skips cleanup and can leak billing resources or corrupt data. See [[findings/forcing-a-finalizer-off-skips-cleanup-and-can-leak-billing-resources-or-corrupt-data]].

[[sources/research-finalizers]]

## Diagnosing a stuck object

Read `metadata.finalizers` on the object and its dependents, check the owner references, find the controller that owns each finalizer, and read its logs. Remove a finalizer manually only when its purpose is understood and has been met another way. For a namespace, the last resort edits the finalize subresource. [[sources/research-finalizers]] See [[examples/diagnosing-a-pod-stuck-terminating-from-finalizer-to-force-delete]], [[examples/stuck-terminating-namespace-fixed-through-the-finalize-subresource]], and [[decisions/remove-a-stuck-finalizer-by-force-or-repair-the-owning-controller]].

## Evidence limits

The dossier found no named-company postmortem, so the pitfalls rest on project documentation and practitioner blogs. How Flux, ACK, Config Connector, and kro name and remove their own finalizers was not established. See [[open-knowledge-gaps]].

## Related

[[concepts/owner-references-and-garbage-collection]], [[concepts/reconciliation-loop]], [[concepts/provider]], [[concepts/idempotency]]

## Finalizers and owner references

The owner-reference dossier frames finalizers as the companion to ownership: owner references handle in-cluster, same-namespace cleanup, and finalizers handle external resources, cross-namespace cleanup, and ordered shutdown, and both rely on the same `deletionTimestamp` machinery. [[sources/research-owner-references-and-garbage-collection]] See [[concepts/owner-references-and-garbage-collection]].

## Case evidence from the pitfalls dossier

A namespace stuck in Terminating reports the condition `NamespaceFinalizersRemaining`, and in the Red Hat walk-through the culprit was a custom resource finalizer whose controller was not removing it. The usual cause is a controller or CRD that was uninstalled first or is failing, so the practical rule is to uninstall controllers only after their custom resources are deleted. Crossplane deliberately keeps a finalizer so the managed resource object remains until the external resource is gone, and a paused resource cannot be deleted. The trade-off is that forcing a finalizer off can orphan the cloud resource it protected. No source quantified how often that happens. See [[concepts/pitfalls-and-case-studies]], [[findings/a-paused-crossplane-resource-cannot-be-deleted-until-it-is-unpaused]], and [[sources/research-pitfalls-and-case-studies]]. URL: https://www.redhat.com/en/blog/troubleshooting-terminating-namespaces.

## Update from the GitOps incidents dossier

Primary issues show orphaning without any forced removal, when a controller restarts mid-delete or when the finalizer is added after the delete, see [[findings/resources-are-orphaned-when-a-controller-misses-the-delete-or-the-finalizer-is-added-too-late]]. No source gives a rate for orphaning after forced removal, see [[findings/no-source-quantifies-how-often-forced-finalizer-removal-orphans-guarded-resources]]. Source: [[sources/research-gap-g1-gitops-drift-incidents]].

---
title: Owner References and Garbage Collection
type: concept
status: active
created: 2026-11-25
updated: 2026-11-25
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
aliases: [ownerReferences, cascading deletion]
tags: [controllers, garbage-collection, deletion, owner-references]
---

# Owner References and Garbage Collection

## Definition

Linking child KRM objects to a parent through `metadata.ownerReferences`, so that deleting the parent cascades deletion to all generated children. [[sources/krm-platform-vocabulary]] Each entry names an owner by apiVersion, kind, name, and UID. The references are separate from labels and selectors: a Service finds its EndpointSlices through labels, yet each EndpointSlice also carries an owner reference to the Service so that cleanup and "do not touch what you do not own" logic have a reliable signal. [[sources/research-owner-references-and-garbage-collection]]

## Why it matters

Ownership is how a [[concepts/composite-resource]] cleans up its [[concepts/managed-resource|managed resources]], and how many controllers track what they created. It interacts with [[concepts/finalizers]]: garbage collection removes the Kubernetes objects, while finalizers ensure external cleanup happens first. Ownership covers in-cluster, same-namespace parent-child cleanup, and finalizers cover everything else, including cloud resources, cross-namespace or cluster-scoped cleanup, and ordered shutdown.

## The reference entry

Two optional booleans refine an entry. `controller: true` marks the single managing owner, and a dependent can have many owners but only one controller owner. `blockOwnerDeletion: true` lets a dependent hold up foreground deletion of its owner. The Kubernetes documentation says an admission controller restricts who can set `blockOwnerDeletion`, based on delete permission on the owner. One controller-author tutorial adds that the controller needs `update` on the owner's `/finalizers` subresource, but that claim is unverified. See [[findings/blockownerdeletion-needs-permission-on-the-owner-and-the-failure-mode-is-disputed]].

Kubernetes sets owner references automatically for ReplicaSets, DaemonSets, Deployments, Jobs, CronJobs, and ReplicationControllers. Operators written with controller-runtime set them through `controllerutil.SetControllerReference`, which also lets `Owns()` watches map child events back to the owner. See [[examples/built-in-workload-controllers-cascade-a-deployment-delete-through-replicasets-to-pods]] and [[examples/controller-runtime-sets-a-controller-reference-so-deleting-the-custom-resource-tears-down-its-children]].

## Namespace rules

A namespaced dependent can have a cluster-scoped owner or an owner in the same namespace. A cluster-scoped dependent can only have a cluster-scoped owner. A reference to a namespaced owner in a different namespace is treated as absent, and since v1.20 the API emits `OwnerRefInvalidNamespace` events. The documentation says "Cross-namespace owner references are disallowed by design." Cluster-scoped objects that must depend on namespaced ones are told to use labels plus finalizer-based cleanup. See [[findings/cross-namespace-owner-references-are-treated-as-absent-and-the-dependent-can-be-collected]].

## How the garbage collector works

The garbage collector is a control-plane controller. A GraphBuilder watches all resources through monitors and keeps a dependency graph, and it feeds queues for graph changes, deletion attempts, and orphan attempts. An absent-owner cache remembers owners already confirmed gone, and each reference is classified as dangling, waiting for dependent deletion, or solid. An object is collected when none of its owners exist. The original design moved cascading deletion from kubectl to the server to centralize the logic and make orphaning optional. See [[examples/the-garbage-collector-builds-a-dependency-graph-from-watch-events-and-sorts-references-into-three-classes]].

## Propagation modes and finalizers

The Kubernetes garbage collection page defines three propagation modes, chosen by `propagationPolicy` on the delete call or `kubectl delete --cascade`. Background, the default, deletes the owner immediately and lets the garbage collector remove dependents later. Foreground sets `deletionTimestamp` and the `foregroundDeletion` finalizer on the owner and removes it only after dependents with `blockOwnerDeletion=true` are gone. Orphan uses the `orphan` finalizer to strip owner references and leave dependents behind. [[sources/research-finalizers]] [[sources/research-owner-references-and-garbage-collection]] See [[comparisons/background-foreground-and-orphan-propagation-modes]], [[examples/kubectl-cascade-modes-compared-in-a-hands-on-lab]], [[concepts/finalizers]], and [[findings/foreground-deletion-waits-only-for-dependents-with-blockownerdeletion-true]].

## Tool behavior

Platform tools use the mechanism in different ways. Cluster API uses owner references for cluster teardown and `clusterctl move`. Crossplane uses them between composite and composed resources and adds its own composite deletion policies. Flux and Argo CD mostly avoid owner references for pruning and use an inventory or tracking labels plus finalizers on their own top-level object. Config Connector adds an abandon policy so deleting the Kubernetes object need not delete the cloud resource. See [[comparisons/how-tools-garbage-collect-owner-references-inventory-and-finalizers]].

## Pitfalls

- Background deletion gives no ordering, so child-before-parent dependencies are not honored unless foreground is requested. See [[findings/background-deletion-gives-no-teardown-ordering-between-dependents]].
- Client libraries can default to a different policy than kubectl. See [[findings/api-client-default-propagation-policy-can-differ-from-kubectl-and-orphan-dependents]].
- Orphaned dependents keep running with empty references and need manual cleanup. See [[findings/orphaned-dependents-keep-running-with-empty-owner-references-until-someone-deletes-them]].
- Recreating an owner with the same name gives a new UID, so old dependents are not adopted. See [[findings/recreating-an-owner-with-the-same-name-gives-a-new-uid-and-strands-its-old-dependents]].
- Backup and restore tools can strip references. See [[findings/backup-and-restore-tools-can-strip-owner-references-so-controllers-must-re-reconcile-them]].
- External resources are outside garbage collection, so cloud resources need finalizers or a provider deletion policy. See [[findings/destructive-deletion-of-external-resources]].

## Related

[[concepts/reconciliation-loop]], [[concepts/composition]], [[entities/kro]], [[entities/cluster-api]], [[entities/crossplane]], [[decisions/choose-foreground-or-a-pipeline-policy-for-ordered-composite-teardown]]

## Open questions

How kro sets ownership or labels on child resources, how ACK handles deletion, how Argo CD's `PrunePropagationPolicy` interacts with the modes, and whether Flux relies on owner references anywhere are unverified. See [[open-knowledge-gaps]].

---
title: "Research dossier: Owner References and Garbage Collection"
type: source
status: active
created: 2026-11-25
updated: 2026-11-26
sources:
  - id: kubernetes-finalizers-blog
    hash: 31da0061e2fb
    ingested: 2026-11-26
  - id: research-owner-references-and-garbage-collection
    hash: bd4cc1219f2d
    ingested: 2026-11-25
aliases: []
tags: [owner-references, garbage-collection, deletion, controllers, research-dossier]
---

# Research dossier: Owner References and Garbage Collection

> [!NOTE]
> **Raw file:** `raw/research-owner-references-and-garbage-collection.md` (sha256 prefix bd4cc1219f2d)<br>
> **Kind:** Research dossier summarizing 16 web pages, dated 2026-11-25<br>
> **Ingested:** 2026-11-25<br>
> **Caveat:** Several pages were read through a summarizing fetch and only the first 100,000 characters, so exact wording was not checked against full text. The Kubernetes finalizers blog and the design proposal summaries conflict with current documentation on foreground and background terminology. The OneUptime and GoLinuxCloud posts are near-duplicates and count as one viewpoint. kro and ACK were not read.

## Summary

Kubernetes records parent-child relationships in `metadata.ownerReferences`, where each entry names an owner by apiVersion, kind, name, and UID. Built-in controllers write these entries on the objects they create, and the entries are separate from labels and selectors. Two optional booleans refine an entry: `controller: true` marks the single managing owner, and `blockOwnerDeletion: true` lets a dependent hold up foreground deletion of its owner.

The garbage collector is a control-plane controller that builds a dependency graph from watch events on all resources and deletes dependents whose owners are all gone. A `propagationPolicy` on the delete call, or `kubectl delete --cascade=background|foreground|orphan`, selects one of three modes. Background, the default, removes the owner at once and cleans up dependents afterward. Foreground gives the owner a `deletionTimestamp` and a `foregroundDeletion` finalizer and keeps it visible until dependents with `blockOwnerDeletion=true` are gone. Orphan strips the owner reference from dependents through an `orphan` finalizer so they survive on their own.

The dossier frames finalizers as the companion mechanism. Ownership handles in-cluster, same-namespace cleanup, and finalizers handle external resources, cross-namespace or cluster-scoped cleanup, and ordered shutdown. Platform tools differ sharply. Cluster API and Crossplane lean on owner references, while Flux and Argo CD track applied objects through an inventory or labels and use finalizers on their own top-level object, and Config Connector offers an abandon policy for cloud resources.

## Key claims

Each URL below is a page that the dossier read. None is rich enough here to justify a separate source page, so all are cited through this page.

### Mechanism and rules

- The Kubernetes garbage collection page (https://kubernetes.io/docs/concepts/architecture/garbage-collection/) is the canonical reference. It defines owner and dependent, distinguishes ownership from label selection, and describes the three cascading modes. It also covers kubelet garbage collection of containers (every minute) and images (every five minutes), TTL cleanup of finished Jobs, and the v1.20+ `OwnerRefInvalidNamespace` event. Its statement is "Cross-namespace owner references are disallowed by design." See [[concepts/owner-references-and-garbage-collection]] and [[findings/cross-namespace-owner-references-are-treated-as-absent-and-the-dependent-can-be-collected]].
- The Owners and Dependents page (https://kubernetes.io/docs/concepts/overview/working-with-objects/owners-dependents/) says Kubernetes sets owner references automatically for ReplicaSets, DaemonSets, Deployments, Jobs, CronJobs, and ReplicationControllers, and that an admission controller restricts who can set `blockOwnerDeletion` based on delete permission on the owner. A namespaced dependent may have a cluster-scoped or same-namespace owner, a cluster-scoped dependent may only have a cluster-scoped owner, and a namespaced owner in the wrong namespace is treated as absent. See [[examples/built-in-workload-controllers-cascade-a-deployment-delete-through-replicasets-to-pods]].
- The Kubernetes blog post "Using Finalizers to Control Deletion" (https://kubernetes.io/blog/2021/05/14/using-finalizers-to-control-deletion/) ties finalizers to foreground cascading and to protection finalizers. The dossier warns that its summary called foreground "default for some resources", which conflicts with the current documentation that names background as the default. See [[concepts/finalizers]].
- The design proposal (https://github.com/kubernetes/design-proposals-archive/blob/main/api-machinery/garbage-collection.md) records why cascading deletion moved from kubectl to the server and describes a scanner, a garbage processor, and a propagator that keeps a dependency graph. Orphaning is implemented with a finalizer that removes owner references from dependents. The dossier says to use it for architecture and history, not for modern semantics. See [[examples/the-garbage-collector-builds-a-dependency-graph-from-watch-events-and-sorts-references-into-three-classes]].
- The SoByte walkthrough (https://www.sobyte.net/post/2022-06/k8s-gc/) describes the GraphBuilder, three queues (graph changes, `attemptToDelete`, `attemptToOrphan`), an absent-owner cache, and the classification of references as dangling, waiting-for-dependent-deletion, or solid. See the same example page.

### Hands-on and controller authoring

- The KKloud Tarus lab (https://kkloudtarus.net/en/blog/finalizers-ownerreferences-and-garbage-collection, 24 May 2026) shows a Pod's `ownerReferences` with `controller=true` and `blockOwnerDeletion=true`, then compares background, `--cascade=orphan`, and foreground, and finishes with a ConfigMap stuck Terminating on an invented finalizer. See [[examples/kubectl-cascade-modes-compared-in-a-hands-on-lab]] and [[comparisons/background-foreground-and-orphan-propagation-modes]].
- The OneUptime post (https://oneuptime.com/blog/post/2026-02-09-owner-references-garbage-collection/view) says `controllerutil.SetControllerReference` sets `controller: true` and `blockOwnerDeletion: true` and enables `Owns()` watches, that a dependent has many owners but only one controller owner, and that setting `blockOwnerDeletion` needs `update` on the owner's `/finalizers` subresource or the flag is silently not honored. The last claim is unverified and conflicts in tone with the official admission check. See [[examples/controller-runtime-sets-a-controller-reference-so-deleting-the-custom-resource-tears-down-its-children]] and [[findings/blockownerdeletion-needs-permission-on-the-owner-and-the-failure-mode-is-disputed]].
- The GoLinuxCloud explainer (https://www.golinuxcloud.com/kubernetes-operator-owner-references-and-gc/) covers the same ground as the OneUptime post and is treated as the same viewpoint.

### Tool behavior

- The Cluster API book (https://main.cluster-api.sigs.k8s.io/reference/api/owner-references) defines the chain Cluster, MachineDeployment, MachineSet, Machine, with infrastructure and bootstrap objects owned by the Machine, and says owner references drive cluster deletion and `clusterctl move`. Its rule is "Owner references should be re-reconciled if they are lost for an object." See [[examples/cluster-api-owner-reference-chain-drives-cluster-deletion-and-clusterctl-move]] and [[findings/backup-and-restore-tools-can-strip-owner-references-so-controllers-must-re-reconcile-them]].
- The Crossplane Compositions page (https://docs.crossplane.io/latest/composition/compositions/, v2.4) shows composed resources owned by their composite and describes composite deletion policies Background (default), Foreground, and Pipeline. See [[examples/crossplane-foreground-and-pipeline-deletion-policies-order-composed-resource-teardown]].
- Crossplane issue 6084 (https://github.com/crossplane/crossplane/issues/6084, opened Nov 2024, closed as stale in Apr 2025) explains that without foreground deletion the garbage collector marks all children deleted at once, so Usages cannot enforce order, and that Claims behave differently because the claim controller deletes the composite using `compositeDeletePolicy`. See [[findings/background-deletion-gives-no-teardown-ordering-between-dependents]] and [[decisions/choose-foreground-or-a-pipeline-policy-for-ordered-composite-teardown]].
- The Flux Kustomization reference (https://fluxcd.io/flux/components/kustomize/kustomizations/) describes `.spec.prune` with inventory in `.status.inventory`, the `kustomize.toolkit.fluxcd.io/prune: disabled` exemption, and `.spec.deletionPolicy` with MirrorPrune (default), Delete, WaitForTermination, and Orphan. Only about 100,000 of 121,000 characters were read, so whether Flux ever relies on owner references is unconfirmed. See [[examples/gitops-tools-garbage-collect-through-inventory-and-finalizers-not-owner-references]].
- The Argo CD App Deletion page (https://argo-cd.readthedocs.io/en/stable/user-guide/app_deletion/) says cascading to managed resources requires the `resources-finalizer.argocd.argoproj.io` finalizer on the Application, that cascade uses foreground propagation by default, and that background and non-cascading deletes are selectable. `PrunePropagationPolicy` was not read.
- The Config Connector page (https://docs.cloud.google.com/config-connector/docs/how-to/managing-deleting-resources) says deleting the object deletes the Google Cloud resource by default and that `cnrm.cloud.google.com/deletion-policy: abandon` keeps it. See [[entities/config-connector]].
- The kro launch post (https://cloud.google.com/blog/products/containers-kubernetes/introducing-kube-resource-orchestrator) says nothing about ownership or deletion, and kro's instances page could not be read. See [[entities/kro]].

### Failure story

- The Israeli Tech Radar post (https://medium.com/israeli-tech-radar/finding-a-race-condition-in-kuberenetes-like-a-detective-3a538f3b7038) describes a team whose JavaScript Kubernetes client deleted Jobs without a propagation policy, where that client's default was orphan unlike kubectl's background. The garbage collector stripped owner references from Pods before the application's suspend-and-delete step ran, leaving pending Pods that held volume claims, and explicit `Foreground` propagation fixed it. See [[findings/api-client-default-propagation-policy-can-differ-from-kubectl-and-orphan-dependents]].

## Gaps the source leaves open

The dossier could not read kro's instances or FAQ pages, found no ACK deletion-policy page, did not read Argo CD's `PrunePropagationPolicy` or tracking methods, and did not cover Crossplane v2 namespaced composites or `managementPolicies` against garbage collection. It fetched no KEPs on cross-namespace ownership or garbage collector performance. See [[open-knowledge-gaps]].

## Related

[[concepts/owner-references-and-garbage-collection]], [[concepts/finalizers]], [[sources/research-finalizers]]

## Correction note on the Kubernetes finalizers blog summary

Correction note, 2026-11-26: the caveat and the bullet above say a summary of the Kubernetes finalizers blog called foreground "default for some resources" and conflicted with current documentation. The full text of the post, now ingested, does not say that. It labels Background as parent first and Foreground as children first and says the kubectl default became background from v1.20, which agrees with the documentation. The earlier conflict came from the summarizing fetch. See [[sources/kubernetes-finalizers-blog]]. The design proposal summary was not re-read.

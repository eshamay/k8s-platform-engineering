# Research dossier: Owner References and Garbage Collection

Research date: 2026-11-25

## Overview

Kubernetes models "who created or manages whom" with the `metadata.ownerReferences` field. Each entry names an owner by apiVersion, kind, name, and UID. Built-in controllers (Deployment, ReplicaSet, Job, CronJob, DaemonSet, and others) write these references automatically on the objects they create. The references are separate from labels and selectors. A Service finds its EndpointSlices through labels, but each EndpointSlice also carries an owner reference to the Service, so that cleanup and "don't touch what you don't own" logic have a reliable signal. Two optional booleans refine an entry. `controller: true` marks the single managing owner. `blockOwnerDeletion: true` lets a dependent hold up foreground deletion of its owner.

The garbage collector (GC) is a control-plane controller. It builds a dependency graph from watch events on all resources and deletes dependents whose owners are all gone. The sources agree on three deletion modes, selected by `propagationPolicy` on the delete call, or `kubectl delete --cascade=background|foreground|orphan`. Background is the default. The owner is removed at once and the GC removes dependents afterward. Foreground puts the owner into a deletion-in-progress state: it gets a `deletionTimestamp` and a `foregroundDeletion` finalizer. The owner stays visible until the dependents that have `blockOwnerDeletion=true` are gone. Orphan strips the owner reference from dependents (via an `orphan` finalizer on the owner) so they survive as independent objects.

The sources frame finalizers as the companion mechanism. Ownership handles in-cluster, same-namespace parent-child cleanup. Finalizers handle anything else: external cloud resources, cross-namespace or cluster-scoped cleanup, and ordered shutdown. Both rely on the same `deletionTimestamp` machinery. An object with finalizers is only marked for deletion, and it disappears when the finalizer list is empty. That is why "stuck Terminating" problems appear in most failure stories.

Higher-level platform tools sit on top of this in different ways. Cluster API leans on owner references for cluster teardown and for `clusterctl move`. Crossplane uses them between composite and composed resources, and exposes its own deletion-policy knobs. Flux and Argo CD mostly avoid ownerReferences for pruning. They track applied objects in an inventory or by label/annotation, and use finalizers on their own top-level object. Cloud-resource controllers such as Config Connector add an "abandon" policy so that deleting the Kubernetes object need not delete the cloud resource. Note that several summaries below came from a summarizing fetch tool and not from raw page text, so exact wording should be re-checked before it is quoted in a tutorial.

## Sources

### 1. Garbage Collection (Kubernetes docs)
- URL: https://kubernetes.io/docs/concepts/architecture/garbage-collection/
- Title: Garbage Collection | Kubernetes
- Publisher: Kubernetes project (kubernetes.io)
- Kind: official documentation
- Summary: The canonical reference for ownership-based cleanup. It defines owner and dependent, and distinguishes ownership from label selection. It describes the three cascading-deletion modes: foreground (owner gets `deletionTimestamp` and `foregroundDeletion`, only `blockOwnerDeletion=true` dependents block it), background (default), and orphan (`propagationPolicy: Orphan`). It also covers kubelet garbage collection of containers (every minute) and images (every five minutes) with disk thresholds, plus TTL cleanup of finished Jobs and cleanup of stale CSRs, node leases, and similar objects. It documents the v1.20+ behavior where invalid cross-namespace references raise `OwnerRefInvalidNamespace` events. Useful as the first read for any tutorial. Only the first ~100,000 characters were read.
- Quote: "Cross-namespace owner references are disallowed by design."

### 2. Owners and Dependents (Kubernetes docs)
- URL: https://kubernetes.io/docs/concepts/overview/working-with-objects/owners-dependents/
- Title: Owners and Dependents | Kubernetes
- Publisher: Kubernetes project
- Kind: official documentation
- Summary: Explains the `ownerReferences` field and `blockOwnerDeletion`. It says Kubernetes sets owner references automatically for ReplicaSets, DaemonSets, Deployments, Jobs, CronJobs, and ReplicationControllers. An admission controller restricts who can set `blockOwnerDeletion`, based on delete permission on the owner. It states the namespace rules: a namespaced dependent can have a cluster-scoped or same-namespace owner, a cluster-scoped dependent can only have a cluster-scoped owner, and a namespaced owner in the wrong namespace is treated as absent. It also notes that Kubernetes adds finalizers to the owner for foreground and orphan deletion. Good for explaining the field and its constraints.
- Quote: "Owner references help different parts of Kubernetes avoid interfering with objects they don't control."

### 3. Using Finalizers to Control Deletion (Kubernetes blog)
- URL: https://kubernetes.io/blog/2021/05/14/using-finalizers-to-control-deletion/
- Title: Using Finalizers to Control Deletion
- Publisher: Kubernetes blog
- Kind: official blog / explainer
- Summary: Explains finalizers as keys in `metadata.finalizers` that make a delete request only set `deletionTimestamp`, with controllers doing cleanup and then removing their key. It ties finalizers to owner-reference cascading (foregroundDeletion) and to protection finalizers such as the PV/PVC protection ones. Common pitfalls it points to are a controller that crashes or is uninstalled before clearing its finalizer, and manual removal that skips cleanup. Caveat: I obtained this page through a summarizing fetch that read about 100,000 of 114,000 characters, so the pitfall wording is paraphrased and some phrasing (for example calling foreground "default for some resources") should be verified against the page.
- Quote: "Finalizers are strings stored in a resource's metadata.finalizers list that prevent immediate deletion." (as returned by the fetch tool; verify against the page)

### 4. Garbage collection design proposal (Kubernetes design-proposals-archive)
- URL: https://github.com/kubernetes/design-proposals-archive/blob/main/api-machinery/garbage-collection.md
- Title: garbage-collection.md (api-machinery)
- Publisher: Kubernetes SIG API Machinery
- Kind: design document
- Summary: The original rationale for moving cascading deletion from the client (kubectl) to the server. Goals: centralize logic and make orphaning optional. It defines `OwnerReferences` on object metadata, and an object is collected when none of its owners exist. It describes three GC components: a scanner that periodically fills a dirty queue, a garbage processor that checks owners and deletes, and a propagator that keeps a dependency graph (DAG) and watches events. Orphaning is implemented with a finalizer that removes owner references from dependents before the owner disappears. The fetch summary muddled the foreground/background terminology of the later implementation, so use it for architecture and history, not for modern semantics. Archived design, not current API docs.
- Quote: (none used)

### 5. Garbage collection mechanism in Kubernetes (SoByte)
- URL: https://www.sobyte.net/post/2022-06/k8s-gc/
- Title: Garbage collection mechanism in kubernetes
- Publisher: SoByte (community blog)
- Kind: source-code walkthrough
- Summary: Walks through the GC controller implementation. A GraphBuilder watches all resources through monitors and maintains a dependency graph with nodes holding dependents. It feeds three queues: graph changes, `attemptToDelete`, and `attemptToOrphan`. An absent-owner cache remembers UIDs of owners already confirmed gone. Owner references are classified as dangling, waiting-for-dependent-deletion, or solid. Dangling references are patched out, and deletion then follows background, foreground, or orphan logic. It also covers handling of circular `blockOwnerDeletion` cases. Valuable for the "how it works mechanically" tutorial.

### 6. Finalizers, ownerReferences and garbage collection (KKloud Tarus)
- URL: https://kkloudtarus.net/en/blog/finalizers-ownerreferences-and-garbage-collection
- Title: Finalizers, ownerReferences and garbage collection (Kubernetes From Scratch, part 30)
- Publisher: KKloud Tarus (author "Kai"), 24 May 2026
- Kind: hands-on tutorial
- Summary: A step-by-step lab. It shows a Pod's `ownerReferences` with `controller=true` and `blockOwnerDeletion=true`. It then compares background deletion (ReplicaSet vanishes, pods go Terminating afterward), `--cascade=orphan` (pods keep running and their `ownerReferences` becomes empty, so they must be deleted by hand), and foreground (parent held with a `foregroundDeletion` finalizer). It finishes with a ConfigMap carrying an invented finalizer that sticks in Terminating until patched away, and names built-in finalizers such as `kubernetes.io/pv-protection`. Excellent ramp-up reading and a source of reproducible demos.
- Quote: "Kubernetes checks for and deletes objects that no longer have owner references" (page quoting the Kubernetes docs)

### 7. How to Handle OwnerReferences and Garbage Collection in Custom Controllers (OneUptime)
- URL: https://oneuptime.com/blog/post/2026-02-09-owner-references-garbage-collection/view
- Title: How to Handle OwnerReferences and Garbage Collection in Custom Controllers
- Publisher: OneUptime blog
- Kind: engineering tutorial
- Summary: Controller-author view. `controllerutil.SetControllerReference` sets `controller: true` and `blockOwnerDeletion: true` and enables `Owns()` watches. `SetOwnerReference` adds a non-controller owner. Only one controller owner is allowed per dependent. Setting `blockOwnerDeletion` requires `update` on the owner's `/finalizers` subresource, otherwise the flag is silently not honored (per this article). Pitfalls listed: cross-namespace refs, recreating a CR with the same name (UID mismatch), and assuming cascade covers external resources. Recommends finalizers for external cleanup. Fetched through a summarizer; verify claims about silent behavior before publishing.
- Quote: "A dependent can have many owners but only ONE controller owner." (as returned by the fetch tool)

### 8. Kubernetes Owner References & GC: Cascade, Orphan, Foreground (GoLinuxCloud)
- URL: https://www.golinuxcloud.com/kubernetes-operator-owner-references-and-gc/
- Title: Kubernetes Owner References & GC: Cascade, Orphan, Foreground
- Publisher: GoLinuxCloud
- Kind: tutorial explainer
- Summary: A second operator-focused explainer covering the same ground as source 7: owner references as the basis for cascade deletion, controller-runtime helpers, the three propagation policies, and combining ownership with finalizers for external systems. Useful as a cross-check. The fetch result closely resembles source 7's summary, so treat the pair as one viewpoint and re-read both pages for distinct detail.

### 9. Owner References (The Cluster API Book)
- URL: https://main.cluster-api.sigs.k8s.io/reference/api/owner-references
- Title: Owner References - The Cluster API Book
- Publisher: Kubernetes SIG Cluster Lifecycle (Cluster API)
- Kind: project documentation / provider contract
- Summary: Defines the CAPI ownership chain Cluster, MachineDeployment, MachineSet, Machine, with infrastructure and bootstrap objects owned by Machine, and who sets each link. It states that owner references drive cluster deletion and `clusterctl move`. Controllers must re-reconcile references if they are lost, because tools like Velero can strip them. It warns against unnecessary owner references, stale API versions in references, and multiple owners (should be exceptional). A strong real-world case of ownership as a core API contract.
- Quote: "Owner references should be re-reconciled if they are lost for an object."

### 10. Compositions (Crossplane docs, v2.4)
- URL: https://docs.crossplane.io/latest/composition/compositions/
- Title: Compositions - Crossplane v2.4
- Publisher: Crossplane project
- Kind: official documentation
- Summary: Shows composed resources carrying `ownerReferences` to their composite resource. It describes composite deletion policies: `Background` (default, children deleted automatically by GC), `Foreground` (children deleted before the composite is removed), and `Pipeline` (a function controls ordering by removing resources from desired state step by step). It also states that a composed resource no longer returned by the function is deleted. The fetch summary did not cover managementPolicies or v2 namespacing, so those need another source.
- Quote: "Crossplane deletes the child composed resources. It keeps the parent composite resource until they're gone" (Foreground policy, via fetch tool)

### 11. Compositions: Allow Deletion Behaviour to be set for Composed Resources (Crossplane issue 6084)
- URL: https://github.com/crossplane/crossplane/issues/6084
- Title: Compositions: Allow Deletion Behaviour to be set for Composed Resources · Issue #6084
- Publisher: Crossplane GitHub community (opened Nov 2024, closed as stale / not planned Apr 2025)
- Kind: issue discussion / community knowledge
- Summary: A very instructive thread. A maintainer-level contributor explains that a standalone composite is treated like any other object. Without `foreground` deletion the GC walks the `ownerReferences` tree and marks all children deleted at once, so ordering via Usages cannot be enforced. Claims behave differently because the composite has no ownerReference pointing at the claim. The claim controller deletes the composite using `compositeDeletePolicy` / `defaultCompositeDeletePolicy`. A user reports being surprised that XRs lack that behavior, and the docs did not say so. The proposal to switch propagation during deletion was doubted by maintainers and the issue lapsed. Excellent for explaining why foreground deletion matters for ordered teardown.
- Quote: "the user must specify foreground deletion if that is required." (maintainer comment, paraphrase of a longer remark)

### 12. Kustomization (Flux docs)
- URL: https://fluxcd.io/flux/components/kustomize/kustomizations/
- Title: Kustomization | Flux
- Publisher: Flux project (CNCF)
- Kind: official documentation
- Summary: Flux garbage collection is its own mechanism, not ownerReferences. With `.spec.prune: true`, objects applied earlier but missing from the current source revision are removed, using the inventory in `.status.inventory`. An object can be exempted with `kustomize.toolkit.fluxcd.io/prune: disabled`. `.spec.deletionPolicy` (`MirrorPrune` default, `Delete`, `WaitForTermination`, `Orphan`) decides what happens to managed objects when the Kustomization itself is deleted. Only about 100,000 of 121,000 characters were read.
- Quote: ".spec.prune is a required boolean field to enable/disable garbage collection for a Kustomization."

### 13. App Deletion (Argo CD docs)
- URL: https://argo-cd.readthedocs.io/en/stable/user-guide/app_deletion/
- Title: App Deletion - Argo CD
- Publisher: Argo project (CNCF)
- Kind: official documentation
- Summary: Argo CD only cascades to managed resources if the Application carries the `resources-finalizer.argocd.argoproj.io` finalizer. Cascade deletion uses foreground propagation by default, and the page also describes background and non-cascading (orphan-style) deletes selectable with a propagation-policy flag. The fetch summary said the page did not discuss `PrunePropagationPolicy` explicitly; that is a sync option documented elsewhere.
- Quote: "Deletes both the app and its resources, rather than only the app." (cascade description, via fetch tool)

### 14. Config Connector: managing and deleting resources
- URL: https://docs.cloud.google.com/config-connector/docs/how-to/managing-deleting-resources
- Title: Managing and deleting resources | Config Connector
- Publisher: Google Cloud
- Kind: vendor documentation
- Summary: By default, deleting a Config Connector object deletes the real Google Cloud resource. The `cnrm.cloud.google.com/deletion-policy: abandon` annotation keeps the cloud resource when the Kubernetes object goes. It shows that Kubernetes delete semantics map onto external systems through finalizer-style controllers, not through ownerReferences. The page did not cover namespace deletion, finalizers, or ordering in what was returned.
- Quote: "deleting the object from your cluster will delete the resource." (as returned by the fetch tool; verify)

### 15. Introducing Kube Resource Orchestrator, or kro (Google Cloud blog)
- URL: https://cloud.google.com/blog/products/containers-kubernetes/introducing-kube-resource-orchestrator
- Title: Introducing Kube Resource Orchestrator, or kro
- Publisher: Google Cloud blog
- Kind: announcement / architecture overview
- Summary: Describes kro's ResourceGraphDefinition, which expands a CRD instance into a graph of Kubernetes resources treated as one unit, and its use alongside ACK, Config Connector, and ASO. It says nothing about ownership or deletion mechanics; those come from kro's docs (instances page), which I could not read. Useful only as context for why a group-of-resources abstraction relies on parent-child cleanup.

### 16. Finding a Race Condition in Kubernetes, Like a Detective (Israeli Tech Radar)
- URL: https://medium.com/israeli-tech-radar/finding-a-race-condition-in-kuberenetes-like-a-detective-3a538f3b7038
- Title: Finding a Race Condition in Kuberenetes — Like a Detective
- Publisher: Israeli Tech Radar (Medium)
- Kind: engineering postmortem-style blog
- Summary: A team using the JavaScript Kubernetes client deleted Jobs without a propagation policy. That client's default was orphan, unlike kubectl's background. The GC stripped owner references from Pods before the app's suspend-and-delete step ran, leaving orphaned pending Pods that held volume claims. The fix was explicit `Foreground` propagation. A concrete, memorable pitfall: API-client defaults differ from kubectl defaults.
- Quote: "if the garbage collector gets to it first" (fragment of the author's explanation)

## Real-world use cases

Built-in workload controllers are the everyday case. Deleting a Deployment cascades through ReplicaSets to Pods, and CronJobs cascade to Jobs (source 6, https://kkloudtarus.net/en/blog/finalizers-ownerreferences-and-garbage-collection; source 2, https://kubernetes.io/docs/concepts/overview/working-with-objects/owners-dependents/). Operators such as those written with controller-runtime set owner references on every Deployment, Service, and ConfigMap they create, so deleting the custom resource tears down the stack and `Owns()` watches trigger reconciliation (source 7, https://oneuptime.com/blog/post/2026-02-09-owner-references-garbage-collection/view).

Cluster API is the clearest named project. Its Cluster, MachineDeployment, MachineSet, Machine chain is how cluster deletion proceeds, and `clusterctl move` uses owner references to move a management cluster's objects in dependency order. Velero stripping references is called out as a known hazard (source 9, https://main.cluster-api.sigs.k8s.io/reference/api/owner-references).

Crossplane platform teams compose cloud resources under composites. Ownership gives automatic teardown. Teams that need dependency-ordered deletion (for example, a database before its network) use Foreground or Pipeline policies, or Usages (sources 10 and 11). One user in the issue switched from XRs to Claims for exactly this reason (https://github.com/crossplane/crossplane/issues/6084).

GitOps tools use inventory-based pruning for application delivery. Flux prunes removed manifests and Argo CD cascades app deletion through a finalizer (sources 12 and 13). Config Connector users apply the abandon annotation to keep production cloud resources when Kubernetes objects are removed (source 14).

## Pitfalls and how tools address them

Cross-namespace ownership is invalid. The API treats such a reference as absent, so the dependent can be garbage-collected unexpectedly, and v1.20+ emits `OwnerRefInvalidNamespace` events (sources 1 and 2). Cluster-scoped objects that must depend on namespaced ones are told to use labels plus finalizer-based cleanup (source 7).

Default propagation differs by client. kubectl and the API default to background for most resources, while one client library defaulted to orphan, which caused a race and leaked Pods (source 16). Always pass an explicit propagation policy from code.

Background deletion gives no ordering. The GC may delete a whole tree at once, so child-before-parent dependencies (databases before networks, Usage protections) are not honored unless foreground is requested. Crossplane's XR-versus-Claim difference shows this (source 11), and Crossplane's Pipeline policy is a tool-level answer (source 10).

Stuck Terminating objects come from finalizers whose controller is gone, crashed, or never written. Manually removing finalizers works but skips cleanup and can leak external resources (sources 3 and 6). Foreground deletion can also hang if a dependent with `blockOwnerDeletion=true` cannot be deleted.

`blockOwnerDeletion` needs permission. The API server's admission check requires delete rights on the owner (source 2), and source 7 adds that controllers need `update` on `<kind>/finalizers`, otherwise the flag may be dropped (verify, as this comes from a summarized blog).

Lost references. Backup and restore tools may remove or fail to restore owner references, so Cluster API requires controllers to re-reconcile them (source 9). Recreating an owner with the same name gives a new UID, so old dependents are not adopted and may be collected as orphans (source 7).

Orphaned objects are not cleaned automatically. With `--cascade=orphan` the dependents run on with empty `ownerReferences` and need manual deletion (source 6). Flux's `Orphan` deletion policy and Argo CD's non-cascading delete are the GitOps equivalents (sources 12 and 13).

External resources are outside GC. Owner references only reach Kubernetes objects. Cloud resources need finalizers, and controllers like Config Connector offer an abandon policy (sources 7 and 14).

## Tutorial and explainer links

- https://kubernetes.io/docs/concepts/architecture/garbage-collection/ — the authoritative starting page for modes and rules.
- https://kkloudtarus.net/en/blog/finalizers-ownerreferences-and-garbage-collection — runnable lab covering all three modes and a stuck finalizer.
- https://kubernetes.io/blog/2021/05/14/using-finalizers-to-control-deletion/ — the official finalizer explainer.
- https://www.sobyte.net/post/2022-06/k8s-gc/ — source-level walkthrough of the GC graph and queues.
- https://oneuptime.com/blog/post/2026-02-09-owner-references-garbage-collection/view — controller-author patterns.
- https://github.com/crossplane/crossplane/issues/6084 — case study of ordering problems with foreground vs background.
- https://medium.com/israeli-tech-radar/finding-a-race-condition-in-kuberenetes-like-a-detective-3a538f3b7038 — a short debugging story about propagation-policy defaults.

## Open questions

- kro: I could not read kro's instances or FAQ pages, so how kro sets ownership or labels on child resources, and what its deletion ordering is, remain unverified.
- ACK (`services.k8s.aws/deletion-policy`): the search failed with a server error. Not covered.
- Argo CD: the `PrunePropagationPolicy` sync option and its tracking methods (label vs annotation) were not read.
- Flux: whether Flux ever relies on ownerReferences at all (versus inventory only) was not stated in the part of the page read; the last ~21,000 characters were unread.
- The finalizers blog and design doc were read through a summarizing tool. Statements such as which deletion mode is "default for some resources" and the design doc's foreground/background labels conflict with the current docs, which say background is the default. Re-verify against the pages.
- The RBAC claim about `/finalizers` and silent dropping of `blockOwnerDeletion` (source 7) conflicts in tone with the official docs, which describe an admission check that rejects, not silently drops. Needs a test or source-code check.
- Crossplane v2 namespaced XRs and managementPolicies interaction with GC were not covered.
- No conference talks or KEPs were fetched (for example, KEPs on cross-namespace ownership or GC performance), nor a Stack Overflow thread (the page returned empty).

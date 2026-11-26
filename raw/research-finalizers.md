# Research dossier: Finalizers

Research date: 2026-11-25

## Overview

A finalizer is a string in `metadata.finalizers` that tells the API server "do not physically remove this object until I say so." When a client deletes an object that carries finalizers, the API server does not delete it. It sets `metadata.deletionTimestamp`, returns HTTP 202, and leaves the object visible in a Terminating state. Controllers watch for the timestamp, do their cleanup, and remove their own entry from the list. When the list is empty the object is deleted. Delete becomes a two-phase operation: first a mark, then a removal once every finalizer is gone.

Several rules follow from that. Once deletionTimestamp is set, nobody can add new finalizers, and the timestamp cannot be changed. The only allowed finalizer edit is removal, and the object cannot be resurrected. Custom finalizer names must be qualified (for example `example.com/cleanup`), and the API server rejects unqualified ones. Kubernetes uses finalizers itself, for example `kubernetes.io/pv-protection`, and `foregroundDeletion` and `orphan` for cascading deletion. Finalizers are separate from owner references. Owner references describe parent-child links for the garbage collector, while finalizers gate whether one object may vanish. The two interact in foreground deletion, where the GC adds a finalizer to the owner and waits for dependents that have `blockOwnerDeletion=true`.

The sources frame the topic in two ways. Controller authors (Kubebuilder, the Kubernetes blog, tutorial posts) treat finalizers as the standard way to release external resources such as buckets, cloud databases, or load balancers. They advise adding the finalizer before any external resource is created, making cleanup idempotent, and removing the finalizer only on success. Operators and SREs (Red Hat, Martin Heinz, incident-style blogs) see finalizers from the other side, as the reason namespaces and objects hang in Terminating. They stress diagnosing which controller owns the finalizer before removing it, because a forced removal skips cleanup and leaks infrastructure.

Platform stacks add policy on top of the raw mechanism. Crossplane, ACK, and Config Connector default to deleting the external resource when the Kubernetes object is deleted. They offer an opt-out (`deletionPolicy: Orphan`, `deletion-policy: retain`, `deletion-policy: abandon`). Argo CD and Flux attach their own finalizers or deletion policies to decide whether deleting a GitOps object also deletes its deployed children. kro and Cluster API order the teardown and keep the parent's finalizer until children are gone. The shared lesson is that a finalizer plus a deletion policy is a safety and cost control, and it is also the main cause of stuck deletions.

## Sources

### 1. Finalizers (Kubernetes docs)
- URL: https://kubernetes.io/docs/concepts/overview/working-with-objects/finalizers/
- Title: Finalizers | Kubernetes
- Publisher: Kubernetes project (kubernetes.io)
- Kind: official concept documentation
- Summary: The canonical definition. It walks through the deletion sequence: API server sets deletionTimestamp and returns 202, controllers clean up and remove their keys, and the object disappears when the list is empty. It uses the PV protection finalizer as an example. It states the restrictions after deletion is requested (cannot add finalizers, cannot change the timestamp) and the requirement for qualified custom names. A short comparison with owner references and a troubleshooting note say to check finalizers and owner references on the object and its dependents, and to avoid manual removal unless you understand the purpose. Start here for any tutorial.
- Quote: "Prevents the object from being removed until all items are removed from its `metadata.finalizers` field"

### 2. Garbage Collection (Kubernetes docs)
- URL: https://kubernetes.io/docs/concepts/architecture/garbage-collection/
- Title: Garbage Collection | Kubernetes
- Publisher: Kubernetes project
- Kind: official architecture documentation
- Summary: Explains owner references, the rule that cross-namespace owners are disallowed, and the three propagation modes. Background (default) deletes the owner at once and the GC controller removes dependents later. Foreground sets deletionTimestamp and the `foregroundDeletion` finalizer on the owner and removes it only after dependents with `blockOwnerDeletion=true` are gone. Orphan uses the `orphan` finalizer to leave dependents behind. This is the best source for why a parent can be stuck waiting on children.
- Quote: "The Kubernetes API server deletes the owner object immediately and the garbage collector controller cleans up dependents in the background."

### 3. Using Finalizers to Control Deletion (Kubernetes blog, 2021)
- URL: https://kubernetes.io/blog/2021/05/14/using-finalizers-to-control-deletion/
- Title: Using Finalizers to Control Deletion
- Publisher: Kubernetes blog
- Kind: official explainer
- Summary: A friendly walkthrough of the delete-then-linger behavior using a ConfigMap and a Job. It shows how a finalizer holds an object, how `kubectl delete --cascade` selects background, foreground, or orphan, and why an object seems to persist after deletion. It lists pitfalls: finalizers with no controller to clear them, and cleanup that fails or loops. Good first read for readers who have never seen a Terminating object.
- Quote: "You may think you've deleted something, only to find it still persists."

### 4. Using Finalizers (Kubebuilder Book)
- URL: https://book.kubebuilder.io/reference/using-finalizers
- Title: Using finalizers - The Kubebuilder Book
- Publisher: kubernetes-sigs/kubebuilder
- Kind: controller-authoring reference with code
- Summary: Shows the standard Reconcile pattern with controller-runtime: if deletionTimestamp is zero and the finalizer is missing, add it and update; if the object is being deleted and the finalizer is present, run cleanup, remove the finalizer, update, and stop. Notes that with a finalizer, delete shows up as an update, while without one the controller just sees a missing object. Stresses idempotent cleanup and the extra RBAC `resources/finalizers` update verb.
- Quote: "Finalizers allow controllers to implement asynchronous pre-delete hooks."

### 5. Stop Messing with Kubernetes Finalizers
- URL: https://martinheinz.dev/blog/74
- Title: Stop Messing with Kubernetes Finalizers
- Publisher: Martin Heinz (personal engineering blog)
- Kind: explainer and warning post
- Summary: Explains finalizers as pre-delete signals and argues against reflexively force-removing them. Describes the consequences: dangling cloud storage that keeps billing, possible data corruption with StatefulSets on shared storage, pods still running after the API object is gone, and namespaces that hang. Recommends finding the blocking finalizer, reading the owning controller's source to learn its purpose, and fixing the underlying condition.
- Quote: "backing storage in Cloud or any other infrastructure might not get deleted"

### 6. How to fix Kubernetes namespaces stuck in the terminating state
- URL: https://www.redhat.com/en/blog/troubleshooting-terminating-namespaces
- Title: How to fix Kubernetes namespaces stuck in the terminating state
- Publisher: Red Hat
- Kind: vendor troubleshooting guide
- Summary: Diagnoses a stuck namespace by reading `spec.finalizers` and status conditions such as SomeFinalizersRemain, then gives the last-resort fix: dump the namespace JSON, delete the `kubernetes` entry from spec.finalizers, and PUT it to the `/finalize` subresource (via `kubectl proxy` or `oc proxy`). Notes that editing in a UI does not work and that forced removal bypasses protective cleanup. Useful for showing the namespace finalizer is a spec field and is handled through a subresource.

### 7. Crossplane Managed Resources (v1.20)
- URL: https://docs.crossplane.io/v1.20/concepts/managed-resources/
- Title: Managed Resources
- Publisher: Crossplane (CNCF)
- Kind: official documentation
- Summary: Describes `deletionPolicy` (Delete by default, Orphan to keep the cloud resource) and how Crossplane holds a finalizer until the external resource is fully gone. Covers `managementPolicies` that restrict actions, which take precedence over deletionPolicy when enabled. Also documents the `crossplane.io/external-create-pending` annotation: if a provider suspects a leaked create, it stops and asks a human to remove the annotation once it is safe.
- Quote: "When the external resource is fully deleted Crossplane removes the Finalizer and deletes the managed resource object."

### 8. Crossplane issue 7801: protect ProviderConfig credentials until managed resources are gone
- URL: https://github.com/crossplane/crossplane/issues/7801
- Title: Protect ProviderConfig credentials until managed resources...
- Publisher: crossplane/crossplane GitHub community
- Kind: issue and design discussion
- Summary: A real failure mode. On namespace deletion, objects go in arbitrary order. A credentials Secret with no finalizer can disappear while managed resources still need it to call the cloud API, leaving them stuck Terminating. The issue weighs three fixes: finalizer protection on the Secret, provider-side credential caching, and ordered teardown. A contributor reports success protecting Secrets with finalizers in provider-gitlab. Excellent example of dependency ordering as a finalizer problem.

### 9. Argo CD ApplicationSet application deletion
- URL: https://argo-cd.readthedocs.io/en/stable/operator-manual/applicationset/Application-Deletion/
- Title: Application Pruning & Resource Deletion
- Publisher: Argo Project (CNCF)
- Kind: official documentation
- Summary: The `resources-finalizer.argocd.argoproj.io` finalizer on an Application makes deleting the Application also delete its deployed resources (cascading). Deleting an ApplicationSet cascades to Applications and then to cluster resources. `--cascade=orphan` leaves the Applications, but their finalizer still deletes workloads when they are removed. Setting `syncPolicy.preserveResourcesOnDeletion` stops the finalizer being added, so workloads survive.
- Quote: "prevents the finalizer from being added to the Application"

### 10. Flux Kustomization API
- URL: https://fluxcd.io/flux/components/kustomize/kustomizations/
- Title: Kustomization | Flux
- Publisher: Flux project (CNCF)
- Kind: official API reference
- Summary: Covers `spec.prune` garbage collection, the per-object `kustomize.toolkit.fluxcd.io/prune: disabled` opt-out, and `spec.deletionPolicy` (MirrorPrune default, Delete, WaitForTermination, Orphan) which governs what happens to deployed objects when a Kustomization is deleted. WaitForTermination blocks until children leave etcd, which makes Flux's own finalizer wait on other finalizers. I read the first ~100 KB of a longer page; the finalizer section itself was not isolated.
- Quote: "Garbage collection is also performed when a Kustomization object is deleted"

### 11. Cluster API machine deletion process
- URL: https://cluster-api.sigs.k8s.io/tasks/automated-machine-management/machine_deletions
- Title: Machine deletion process - The Cluster API Book
- Publisher: kubernetes-sigs/cluster-api
- Kind: official architecture documentation
- Summary: A multi-phase teardown triggered by deletionTimestamp: pre-drain hooks, node drain, volume detach, pre-terminate hooks, infrastructure and bootstrap deletion, then node deletion. Lists what blocks it: PodDisruptionBudgets, pods that are themselves terminating, attached volumes, failing hooks, unreachable nodes. Shows finalizer-like hooks implemented as annotations, and escape hatches such as `exclude-node-draining` and `nodeDrainTimeout`.

### 12. Config Connector: managing and deleting resources
- URL: https://docs.cloud.google.com/config-connector/docs/how-to/managing-deleting-resources
- Title: Managing and deleting resources | Config Connector
- Publisher: Google Cloud
- Kind: official documentation
- Summary: Deleting a Config Connector object deletes the Google Cloud resource by default. To keep the cloud resource, annotate with `cnrm.cloud.google.com/deletion-policy: abandon`, apply that first, then delete the manifest. The page does not discuss finalizers directly.
- Quote: "cnrm.cloud.google.com/deletion-policy: abandon"

### 13. GCP Config Connector in production: five failure patterns
- URL: https://perun.au/insights/config-connector-production/
- Title: GCP Config Connector in production: five failure patterns
- Publisher: perun.au (consultancy blog)
- Kind: engineering blog, practitioner experience
- Summary: Two patterns relate to finalizers. Deleting a KCC object deletes the GCP resource through a finalizer even if production uses it, so there is a deletion protection gap. And when a GKE cluster is deleted, the controller stops running, leaving orphaned GCP resources that keep billing. The post is a single vendor-style blog, so treat claims as practitioner opinion.

### 14. ACK deletion policy
- URL: https://aws-controllers-k8s.github.io/docs/guides/deletion-policy/
- Title: Deletion Policy | AWS Controllers for Kubernetes
- Publisher: AWS Controllers for Kubernetes project
- Kind: official documentation
- Summary: By default ACK deletes the AWS resource and then the Kubernetes object. The `services.k8s.aws/deletion-policy: retain` annotation keeps the AWS resource, useful for migrating between clusters or protecting S3 buckets and RDS databases. Policy lookup order is resource annotation, namespace annotation, controller default. Retained resources can be re-imported with the adoption annotations.

### 15. kro instance deletion
- URL: https://kro.run/docs/advanced/instance-deletion/
- Title: Instance Deletion | kro
- Publisher: kro project (kubernetes-sigs)
- Kind: official documentation
- Summary: kro holds the instance finalizer until all managed resources are gone, discovers them from a persisted ApplySet inventory, and deletes in reverse dependency order in waves, each wave fully gone before the next. A stuck instance shows `ResourcesReady=Unknown` with reason `UnderDeletion`; the fix is to find finalizers on children in the active wave.
- Quote: "kro keeps the instance finalizer until all managed resources are gone."

### 16. Pod stuck Terminating due to finalizer (OneUptime)
- URL: https://oneuptime.com/blog/post/2026-02-09-pod-stuck-terminating-finalizer/view
- Title: Diagnose Kubernetes Pod Stuck in Terminating State Due to Finalizers
- Publisher: OneUptime
- Kind: tutorial / runbook
- Summary: Concrete commands: list Terminating pods, inspect `metadata.finalizers`, find the operator and read its logs, then as a last resort patch finalizers to empty or remove one by JSON patch, and finally `--force --grace-period=0`. It advises timeout logic and monitoring in operators. Vendor blog, so a practical but not authoritative source. Note that pods rarely carry custom finalizers, and the claim that a Terminating pod shows Running status is a simplification.

### 17. Finalizers in Kubernetes Controllers (farishuskovic.dev)
- URL: https://www.farishuskovic.dev/blog/k8s-finalizers/
- Title: Finalizers in Kubernetes Controllers
- Publisher: Faris Huskovic (personal blog)
- Kind: tutorial
- Summary: Covers the controller pattern and its pitfalls: cleanup that always errors strands the object, cleanup must tolerate already-deleted external resources, and the finalizer must be on the object before the delete arrives. Recommends domain-scoped finalizer names. Suggests finalizers fit external resources, cross-namespace management, and audit logging, not in-cluster cleanup that GC already handles.
- Quote: "The finalizer must be on the resource before the delete request arrives."

## Real-world use cases

Protecting storage: Kubernetes itself uses `kubernetes.io/pv-protection` so a PersistentVolume in use by a pod cannot vanish (https://kubernetes.io/docs/concepts/overview/working-with-objects/finalizers/). Heinz notes that force-deleting a PV can leave cloud disks billing (https://martinheinz.dev/blog/74).

Releasing cloud resources: Crossplane providers, ACK controllers, and Config Connector all keep a finalizer so that deleting a Kubernetes object tears down the S3 bucket, RDS database, or GCP resource first (https://docs.crossplane.io/v1.20/concepts/managed-resources/, https://aws-controllers-k8s.github.io/docs/guides/deletion-policy/, https://docs.cloud.google.com/config-connector/docs/how-to/managing-deleting-resources). ACK names cluster migration and stateful buckets or databases as reasons to retain.

GitOps cascade control: Argo CD's resources finalizer decides whether deleting an Application removes what it deployed, with `preserveResourcesOnDeletion` for ApplicationSets that must not cascade (https://argo-cd.readthedocs.io/en/stable/operator-manual/applicationset/Application-Deletion/). Flux's Kustomization deletionPolicy and prune annotation serve the same purpose (https://fluxcd.io/flux/components/kustomize/kustomizations/). The named users in these sources are the projects themselves; no case study from a named company was found.

Infrastructure lifecycle: Cluster API machine deletion is gated by drain, volume detach, and hooks so that nodes are removed safely (https://cluster-api.sigs.k8s.io/tasks/automated-machine-management/machine_deletions). kro orders teardown of composed resource graphs (https://kro.run/docs/advanced/instance-deletion/).

Custom operators: the Kubebuilder pattern for external cleanup (https://book.kubebuilder.io/reference/using-finalizers).

## Pitfalls and how tools address them

Stuck Terminating objects are usually caused by a controller that is gone (uninstalled operator, deleted CRD controller), a cleanup that errors forever, or a child with its own finalizer. The Kubebuilder and farishuskovic sources show how a never-succeeding cleanup strands the object (https://www.farishuskovic.dev/blog/k8s-finalizers/). Diagnosis starts with reading the finalizers and the owning controller's logs (https://oneuptime.com/blog/post/2026-02-09-pod-stuck-terminating-finalizer/view).

Forced removal is the dangerous shortcut. Patching finalizers to empty, or editing a namespace's `/finalize` subresource, skips cleanup and can leak cloud resources, corrupt data, or leave workloads running (https://martinheinz.dev/blog/74, https://www.redhat.com/en/blog/troubleshooting-terminating-namespaces). Kubernetes docs tell readers not to remove one unless the purpose is understood and met another way.

Dependency ordering inside a namespace delete is a real hazard. Crossplane credentials Secrets without finalizers can disappear before managed resources finish cleanup, leaving them unable to authenticate (https://github.com/crossplane/crossplane/issues/7801). kro avoids this class by deleting in reverse dependency waves (https://kro.run/docs/advanced/instance-deletion/). Kubernetes foreground deletion only blocks on dependents with `blockOwnerDeletion=true` (https://kubernetes.io/docs/concepts/architecture/garbage-collection/).

Accidental destruction is the opposite risk. Config Connector and ACK delete the cloud resource by default, so a mistaken manifest removal or a GitOps prune can destroy production data (https://perun.au/insights/config-connector-production/). Mitigations are retain/abandon/Orphan policies, applied before deleting (https://docs.cloud.google.com/config-connector/docs/how-to/managing-deleting-resources), plus Crossplane managementPolicies. Argo CD and Flux expose similar knobs (preserveResourcesOnDeletion, prune: disabled, deletionPolicy: Orphan).

Orphaned cloud resources arise when the controller is not running at deletion time. The Config Connector article reports leaks after a GKE cluster is deleted (https://perun.au/insights/config-connector-production/). Crossplane's external-create-pending annotation is a related guard against leaks during create (https://docs.crossplane.io/v1.20/concepts/managed-resources/).

Cluster API surfaces drain blockers: PodDisruptionBudgets, volumes still attached, failing hooks (https://cluster-api.sigs.k8s.io/tasks/automated-machine-management/machine_deletions). It provides timeouts and exclude annotations as controlled escape hatches.

## Tutorial and explainer links

- https://kubernetes.io/blog/2021/05/14/using-finalizers-to-control-deletion/ : gentlest introduction for operators who see objects that will not die.
- https://kubernetes.io/docs/concepts/overview/working-with-objects/finalizers/ : the authoritative definition and rules.
- https://kubernetes.io/docs/concepts/architecture/garbage-collection/ : owner references and cascading deletion modes.
- https://book.kubebuilder.io/reference/using-finalizers : code pattern for writing a finalizer in a controller.
- https://www.redhat.com/en/blog/troubleshooting-terminating-namespaces : step-by-step stuck namespace fix with caveats.
- https://martinheinz.dev/blog/74 : why not to force-remove finalizers.
- https://oneuptime.com/blog/post/2026-02-09-pod-stuck-terminating-finalizer/view : command-level runbook.
- https://www.farishuskovic.dev/blog/k8s-finalizers/ : short controller-author tutorial with pitfalls.

## Open questions

- Several search hits were not read and could add depth: Cluster API issue 1514 (block deletion with finalizer or annotation), Flux garbage collection order write-ups, the Stack Overflow namespace threads, and kro's DeepWiki lifecycle page.
- The Flux page was read only partly (first ~100 KB of about 121 KB), and the Kubernetes finalizers, GC, and blog pages were each read through a summarizing fetch of the first ~100 KB, so exact wording was not verified against full text. The Flux page's own finalizer behavior (`finalizers.fluxcd.io`) was not confirmed from a primary source.
- No primary source covering Argo CD's non-cascading Application delete options beyond ApplicationSet, or Argo's `Foreground` and `Background` finalizer variants, was read.
- No named-company case study or postmortem was found. Real-world use cases are drawn from project docs and practitioner blogs.
- ACK, Config Connector, and kro pages do not explain how finalizers are named or removed in each tool, so a tutorial comparing them would need to inspect live objects or source code.
- Crossplane's issue 7801 is a proposal discussion. Its final resolution and whether a fix shipped were not confirmed.
- The OneUptime and perun.au posts are vendor or consultancy blogs with some simplified claims; corroborate before citing as fact.

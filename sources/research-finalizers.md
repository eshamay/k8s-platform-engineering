---
title: "Research dossier: Finalizers"
type: source
status: active
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-finalizers
    hash: ca11dffc241b
    ingested: 2026-11-25
aliases: []
tags: [finalizers, deletion, controllers, garbage-collection, research-dossier]
---

# Research dossier: Finalizers

> [!NOTE]
> **Raw file:** `raw/research-finalizers.md` (sha256 prefix ca11dffc241b)<br>
> **Kind:** Research dossier summarizing 17 web pages, dated 2026-11-25<br>
> **Ingested:** 2026-11-25<br>
> **Caveat:** The Flux page was read only to about 100 KB of roughly 121 KB, and the Kubernetes finalizers, garbage collection, and blog pages were read through a summarizing fetch of the first 100 KB, so exact wording was not checked against full text. The OneUptime and perun.au posts are vendor or consultancy blogs with some simplified claims. No named-company case study or postmortem was found.

## Summary

A finalizer is a string in `metadata.finalizers` that tells the API server not to remove an object until its owner says so. When a client deletes an object that carries finalizers, the API server sets `metadata.deletionTimestamp`, returns HTTP 202, and leaves the object visible in a Terminating state. Controllers see the timestamp, run their cleanup, and remove their own entry. When the list is empty the object is deleted, so delete becomes a mark followed by a removal.

The dossier states the rules that follow. After the timestamp is set nobody can add finalizers or change the timestamp, and the only permitted edit is removal. Custom finalizer names must be qualified, such as `example.com/cleanup`. Kubernetes itself uses `kubernetes.io/pv-protection`, `foregroundDeletion`, and `orphan`. Finalizers are separate from owner references, which describe parent-child links for the garbage collector, and the two meet in foreground deletion.

The sources frame the topic two ways. Controller authors treat finalizers as the standard way to release external resources, and they advise adding the finalizer before creating anything, making cleanup idempotent, and removing the finalizer only on success. Operators and site reliability engineers see finalizers as the reason that objects and namespaces hang in Terminating, and they advise diagnosing the owner before any forced removal. Platform tools add policy on top: Crossplane, ACK, and Config Connector delete the external resource by default with an opt-out, Argo CD and Flux decide whether a GitOps object cascades to its children, and kro and Cluster API order the teardown.

## Key claims

Each URL below is a page that the dossier read. None is rich enough here to justify a separate source page, so all are cited through this page.

### Mechanism and rules

- The Kubernetes finalizers page (https://kubernetes.io/docs/concepts/overview/working-with-objects/finalizers/) gives the canonical definition: a finalizer "prevents the object from being removed until all items are removed from its `metadata.finalizers` field." It walks through the sequence of `deletionTimestamp`, HTTP 202, cleanup, and removal, uses the PV protection finalizer as its example, states that finalizers cannot be added and the timestamp cannot be changed after deletion is requested, and requires qualified custom names. It compares finalizers with owner references and tells readers to check finalizers and owner references on the object and its dependents and to avoid manual removal unless they understand the purpose. See [[concepts/finalizers]] and [[examples/pv-protection-finalizer-keeps-an-in-use-volume-from-vanishing]].
- The Kubernetes garbage collection page (https://kubernetes.io/docs/concepts/architecture/garbage-collection/) explains owner references, forbids cross-namespace owners, and defines three propagation modes. Background, the default, means "The Kubernetes API server deletes the owner object immediately and the garbage collector controller cleans up dependents in the background." Foreground sets `deletionTimestamp` and the `foregroundDeletion` finalizer on the owner and removes it once dependents with `blockOwnerDeletion=true` are gone. Orphan uses the `orphan` finalizer to leave dependents behind. See [[findings/foreground-deletion-waits-only-for-dependents-with-blockownerdeletion-true]] and [[concepts/owner-references-and-garbage-collection]].
- The Kubernetes blog post "Using Finalizers to Control Deletion" (https://kubernetes.io/blog/2021/05/14/using-finalizers-to-control-deletion/, 2021) demonstrates the behavior with a ConfigMap and a Job, shows how `kubectl delete --cascade` selects background, foreground, or orphan, and opens with "You may think you've deleted something, only to find it still persists." It lists the pitfalls of finalizers with no controller to clear them and of cleanup that fails or loops.

### Controller authoring

- The Kubebuilder Book (https://book.kubebuilder.io/reference/using-finalizers) shows the Reconcile pattern: add the finalizer and update when the timestamp is zero and the finalizer is missing, and run cleanup, remove the finalizer, and update when the object is being deleted. It says "Finalizers allow controllers to implement asynchronous pre-delete hooks," that a delete appears as an update when a finalizer exists, that cleanup must be idempotent, and that the controller needs an extra RBAC update verb on `resources/finalizers`. See [[examples/kubebuilder-reconcile-adds-a-finalizer-before-external-work-and-removes-it-after-cleanup]] and [[entities/kubebuilder]].
- The farishuskovic.dev tutorial (https://www.farishuskovic.dev/blog/k8s-finalizers/) says cleanup that always errors strands the object, cleanup must tolerate an already-deleted external resource, and "The finalizer must be on the resource before the delete request arrives." It recommends domain-scoped names and suggests finalizers for external resources, cross-namespace management, and audit logging, not for in-cluster cleanup that garbage collection already handles. See [[findings/a-finalizer-added-after-the-delete-request-is-too-late-and-new-ones-are-refused]] and [[findings/cleanup-that-always-errors-or-assumes-the-external-resource-exists-strands-the-object]].

### Troubleshooting and forced removal

- Martin Heinz's post (https://martinheinz.dev/blog/74) argues against force-removing finalizers. It lists dangling cloud storage that keeps billing ("backing storage in Cloud or any other infrastructure might not get deleted"), possible corruption with StatefulSets on shared storage, pods still running after the API object is gone, and hanging namespaces, and it recommends finding the blocking finalizer and reading the owning controller's source. See [[findings/forcing-a-finalizer-off-skips-cleanup-and-can-leak-billing-resources-or-corrupt-data]].
- The Red Hat guide (https://www.redhat.com/en/blog/troubleshooting-terminating-namespaces) diagnoses a stuck namespace from `spec.finalizers` and conditions such as `SomeFinalizersRemain`, and gives a last-resort fix of removing the `kubernetes` entry and sending the JSON to the `/finalize` subresource through `kubectl proxy` or `oc proxy`. It says that a UI edit does not work and that forced removal bypasses protective cleanup. See [[examples/stuck-terminating-namespace-fixed-through-the-finalize-subresource]].
- The OneUptime runbook (https://oneuptime.com/blog/post/2026-02-09-pod-stuck-terminating-finalizer/view) lists the commands to find Terminating pods, inspect finalizers, read the operator's logs, patch finalizers, and finally use `--force --grace-period=0`. The dossier notes that pods rarely carry custom finalizers and that the claim that a Terminating pod shows Running is a simplification. See [[examples/diagnosing-a-pod-stuck-terminating-from-finalizer-to-force-delete]] and [[decisions/remove-a-stuck-finalizer-by-force-or-repair-the-owning-controller]].

### Provider tools and deletion policy

- The Crossplane managed resources page (https://docs.crossplane.io/v1.20/concepts/managed-resources/) says `deletionPolicy` is Delete by default and Orphan keeps the cloud resource, that "When the external resource is fully deleted Crossplane removes the Finalizer and deletes the managed resource object," that enabled `managementPolicies` take precedence over `deletionPolicy`, and that a suspected leaked create makes the provider stop and ask a human to remove `crossplane.io/external-create-pending`. See [[entities/crossplane]] and [[examples/crossplane-ack-and-config-connector-delete-the-cloud-resource-before-the-kubernetes-object]].
- Crossplane issue 7801 (https://github.com/crossplane/crossplane/issues/7801) reports that on namespace deletion a credentials Secret with no finalizer can vanish while managed resources still need it, leaving them stuck Terminating. It weighs finalizer protection on the Secret, provider-side credential caching, and ordered teardown, and one contributor reports success with Secret finalizers in provider-gitlab. Its resolution was not confirmed. See [[findings/a-credentials-secret-without-a-finalizer-can-vanish-before-managed-resources-finish-cleanup]] and [[decisions/protect-shared-credentials-with-finalizers-caching-or-ordered-teardown]].
- The ACK deletion policy guide (https://aws-controllers-k8s.github.io/docs/guides/deletion-policy/) says ACK deletes the AWS resource and then the Kubernetes object by default, that `services.k8s.aws/deletion-policy: retain` keeps the AWS resource for migrations and for S3 buckets and RDS databases, that lookup order is resource annotation, namespace annotation, then controller default, and that retained resources can be re-imported with the adoption annotations. See [[entities/ack]].
- The Config Connector page on managing and deleting resources (https://docs.cloud.google.com/config-connector/docs/how-to/managing-deleting-resources) says deletion removes the Google Cloud resource by default and that `cnrm.cloud.google.com/deletion-policy: abandon` keeps it, applied before the delete. It does not discuss finalizers. See [[entities/config-connector]].
- The perun.au article (https://perun.au/insights/config-connector-production/) reports that deleting a Config Connector object deletes the Google Cloud resource through a finalizer even if production uses it, and that deleting the GKE cluster stops the controller and orphans resources that keep billing. It is a single consultancy blog. See [[findings/deleting-the-cluster-first-orphans-cloud-resources-because-the-controller-is-gone]].

### GitOps and graph tools

- The Argo CD ApplicationSet deletion page (https://argo-cd.readthedocs.io/en/stable/operator-manual/applicationset/Application-Deletion/) says the `resources-finalizer.argocd.argoproj.io` finalizer makes deleting an Application also delete its deployed resources, that deleting an ApplicationSet cascades, that `--cascade=orphan` leaves Applications whose finalizer still deletes workloads later, and that `syncPolicy.preserveResourcesOnDeletion` "prevents the finalizer from being added to the Application." See [[entities/argo-cd]] and [[examples/argo-cd-resources-finalizer-cascades-an-application-delete-to-its-workloads]].
- The Flux Kustomization reference (https://fluxcd.io/flux/components/kustomize/kustomizations/) covers `spec.prune`, the `prune: disabled` annotation, and `spec.deletionPolicy` with MirrorPrune (default), Delete, WaitForTermination, and Orphan, and says "Garbage collection is also performed when a Kustomization object is deleted." The dossier did not isolate the finalizer section. See [[entities/flux]] and [[examples/flux-kustomization-deletion-policy-chooses-between-mirror-prune-delete-wait-and-orphan]].
- The kro instance deletion page (https://kro.run/docs/advanced/instance-deletion/) says "kro keeps the instance finalizer until all managed resources are gone," discovers resources from a persisted ApplySet inventory, and deletes in reverse dependency waves. A stuck instance shows `ResourcesReady=Unknown` with reason `UnderDeletion`. See [[entities/kro]] and [[examples/kro-deletes-instance-resources-in-reverse-dependency-waves]].
- The Cluster API machine deletion page (https://cluster-api.sigs.k8s.io/tasks/automated-machine-management/machine_deletions) describes drain, volume detach, hooks, infrastructure and bootstrap deletion, and node deletion, the blockers (PodDisruptionBudgets, terminating pods, attached volumes, failing hooks, unreachable nodes), and the escape hatches `exclude-node-draining` and `nodeDrainTimeout`. See [[entities/cluster-api]] and [[findings/machine-deletion-stalls-on-disruption-budgets-attached-volumes-and-failing-hooks]].

## Gaps the source leaves open

The dossier did not read Cluster API issue 1514, Flux garbage collection order write-ups, the Stack Overflow namespace threads, kro's DeepWiki lifecycle page, Argo CD's non-ApplicationSet delete options, or Argo CD's Foreground and Background finalizer variants. It found no named-company postmortem, and it could not say how ACK, Config Connector, and kro name and remove their finalizers. See [[open-knowledge-gaps]] and [[comparisons/finalizer-gated-teardown-across-argo-cd-flux-kro-and-cluster-api]].

## Related

[[concepts/finalizers]], [[concepts/owner-references-and-garbage-collection]], [[findings/finalizers-strand-objects-in-terminating-when-the-controller-is-missing-or-failing]]

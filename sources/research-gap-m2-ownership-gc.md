---
title: "Research dossier: ownership and garbage collection gaps (m2-ownership-gc)"
type: source
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-m2-ownership-gc
    hash: 62aafaded9c0
    ingested: 2026-11-26
aliases: []
tags: [owner-references, garbage-collection, kro, argo-cd, crossplane, cluster-api, controller-runtime, blockownerdeletion, research-dossier, gap-closing, targeted-pass]
---

# Research dossier: ownership and garbage collection gaps (m2-ownership-gc)

> [!NOTE]
> **Raw file:** `raw/research-gap-m2-ownership-gc.md` (sha256 prefix 62aafaded9c0)<br>
> **Kind:** Verified research dossier for gap cluster m2-ownership-gc, dated 2026-11-26<br>
> **Ingested:** 2026-11-26 as a targeted pass over the owner-reference and garbage collection pages<br>
> **Caveat:** kro claims are read from the v0.10.0 tag. Argo CD, Cluster API, controller-runtime, and Kubernetes claims are read from default-branch files, not tagged releases. Latest releases seen were kro v0.10.0 (2026-11-10), Argo CD v3.6.3, Cluster API v1.14.4 (2026-11-03), controller-runtime v0.25.3 (2026-11-16), Crossplane v2.5.0 (2026-11-24), and Kubernetes v1.37.3.

## Summary

The dossier settles most of seven open ownership gaps. kro, which the earlier owner-reference dossier could not read, is now documented: it sets no owner references on the resources an instance creates, stamps a documented set of labels and annotations, tracks children in an ApplySet inventory, and deletes them itself in reverse dependency waves. It does set owner references on its own RGD-level objects. An alpha annotation releases a resource by stripping kro's labels and annotations.

The `blockOwnerDeletion` dispute is settled for clusters that enable the `OwnerReferencesPermissionEnforcement` admission plugin: a write that adds the flag without `update` on the owner's `finalizers` subresource is rejected with Forbidden, and no code drops the flag. The plugin is not default-on upstream. The blog claim of a silent drop stays unverified.

Argo CD's three tracking methods and its foreground prune default are read from docs and source. No KEP dedicated to cross-namespace ownership or garbage collector performance was found. Crossplane's namespace-deleted-with-provider-down case is not documented, and how `managementPolicies` interact with the owner-reference cascade is not documented either. The dossier recommends nothing.

## Key claims

### kro (v0.10.0)

- kro does not set owner references on instance-managed resources by default, because owner references delete without ordering and a namespaced owner cannot own a cluster-scoped child. VERIFIED. https://github.com/kubernetes-sigs/kro/blob/v0.10.0/website/docs/docs/concepts/rgd/06-instances.md
- Children carry labels including `kro.run/owned`, `kro.run/kro-version`, `kro.run/instance-id`, `kro.run/instance-name`, `kro.run/instance-namespace` (namespaced instances only), `kro.run/instance-group`, `kro.run/instance-version`, `kro.run/instance-kind`, `app.kubernetes.io/managed-by: kro`, `kro.run/node-id`, and `applyset.kubernetes.io/part-of`. Collection items add `kro.run/collection-index` and `kro.run/collection-size`. Long values are hashed with an `h-` prefix and kept in full in an `internal.kro.run/...` annotation. VERIFIED. Same URL and https://github.com/kubernetes-sigs/kro/blob/v0.10.0/pkg/metadata/labels.go
- kro uses the ApplySet specification for tracking and pruning. VERIFIED. Same instances page.
- Deletion runs in reverse waves recorded in the `internal.kro.run/apply-order` annotation, children are found from the persisted ApplySet inventory, and a wave must disappear completely before the next starts, so a child finalizer pauses the rest. Children with no valid annotation go in a final unordered wave. VERIFIED. https://github.com/kubernetes-sigs/kro/blob/v0.10.0/website/docs/docs/advanced/06-instance-deletion.md
- The alpha Graph API also sets no owner references and cleans up from `status.managedResources` and a Graph finalizer. VERIFIED. https://github.com/kubernetes-sigs/kro/blob/v0.10.0/website/docs/docs/concepts/graph/05-status-and-lifecycle.md
- kro stamps an RGD owner reference on its generated CRD and on GraphRevision objects, and re-adopts orphaned revisions by stamping it again. VERIFIED. https://github.com/kubernetes-sigs/kro/blob/v0.10.0/pkg/metadata/owner_reference.go and https://github.com/kubernetes-sigs/kro/blob/v0.10.0/pkg/controller/resourcegraphdefinition/controller_reconcile.go
- Manual owner references on children are possible but risky: resources "may be garbage collected out of order", cross-namespace or cluster-scoped children fail validation, and timing can conflict with kro. The FAQ Argo CD example uses `controller: false`, `blockOwnerDeletion: true`, and the `argocd.argoproj.io/tracking-id` annotation. VERIFIED. https://github.com/kubernetes-sigs/kro/blob/v0.10.0/website/docs/docs/faq.md
- The annotation `kro.run/deletion-policy: Orphaned` (alpha, behind the `DeletionPolicy` feature gate, default off) releases a resource by stripping kro's labels and annotations, applies whenever kro would remove the resource, must be on the live object before removal, and lets a later instance adopt it. Releasing does not touch `metadata.ownerReferences`. VERIFIED. https://github.com/kubernetes-sigs/kro/blob/v0.10.0/website/docs/docs/concepts/reconciliation/06-deletion-policy.md and https://github.com/kubernetes-sigs/kro/blob/v0.10.0/pkg/features/features.go
- For CRDs, kro separates adoption (same RGD name, different ID) from conflict (different RGD or not kro-owned). After the v0.10.0 upgrade the new engine adopts existing resources in place through the unchanged `kro.run/applyset` field manager. A Graph apply that conflicts with another Graph's field manager is rejected. VERIFIED. https://github.com/kubernetes-sigs/kro/blob/v0.10.0/pkg/metadata/labels.go, https://github.com/kubernetes-sigs/kro/blob/v0.10.0/website/docs/docs/upgrading/01-v0.10.0.md
- KREP-004 (owner references and deletion policy for RGD and CRD lifecycle) is draft and distinct from KREP-014. SECONDARY-ONLY, from the roadmap table; neither KREP was read. https://github.com/kubernetes-sigs/kro/blob/v0.10.0/docs/v1-roadmap.md

### Argo CD

- Tracking methods are set by `application.resourceTrackingMethod`: `annotation` (default, `argocd.argoproj.io/tracking-id`), `annotation+label`, and `label` (`app.kubernetes.io/instance`). In `annotation+label` the label is informational only and truncated at 63 characters. Label mode truncates at 63 characters in the docs. Changing the method needs a re-sync. VERIFIED. https://github.com/argoproj/argo-cd/blob/master/docs/user-guide/resource_tracking.md
- A tracking annotation that does not reference the resource it sits on means the resource "will neither affect the application's sync status nor be marked for pruning". VERIFIED. Same URL.
- Label-only mode keeps the label value untruncated in source and lets Kubernetes report the validation error. VERIFIED. https://github.com/argoproj/argo-cd/blob/master/util/argo/resource_tracking.go
- Pruned resources use foreground deletion by default, and `PrunePropagationPolicy` accepts background, foreground, and orphan, with foreground as the controller fallback and gitops-engine default. VERIFIED. https://github.com/argoproj/argo-cd/blob/master/docs/user-guide/sync-options.md, https://github.com/argoproj/argo-cd/blob/master/controller/sync.go, https://github.com/argoproj/gitops-engine/blob/master/pkg/sync/sync_context.go
- Application deletion defaults to foreground, and the `/background` finalizer selects background. VERIFIED. https://github.com/argoproj/argo-cd/blob/master/docs/user-guide/app_deletion.md
- Nothing was found on how tracking methods interact with owner-reference-based child discovery. Not found.

### Kubernetes

- With `OwnerReferencesPermissionEnforcement` enabled, adding `blockOwnerDeletion: true` needs `update` on the `finalizers` subresource of each referenced owner, and failure returns Forbidden with "cannot set blockOwnerDeletion if an ownerReference refers to a resource you can't set finalizers on". Setting an owner reference on a non-created object needs `delete` on the dependent. VERIFIED. https://github.com/kubernetes/kubernetes/blob/master/plugin/pkg/admission/gc/gc_admission.go and https://github.com/kubernetes/website/blob/main/content/en/docs/reference/access-authn-authz/admission-controllers.md
- The plugin is not in the default-on list upstream. VERIFIED. https://github.com/kubernetes/kubernetes/blob/master/pkg/kubeapiserver/options/plugins.go
- The owners-and-dependents page words the control as based on delete permission on the owner, while the plugin source requires `update` on `finalizers`. The dossier treats the source as authoritative. VERIFIED for the source. https://github.com/kubernetes/website/blob/main/content/en/docs/concepts/overview/working-with-objects/owners-dependents.md
- The blog claim that the flag is silently not honored without permission could not be located. UNVERIFIED, so it may appear only as an open question.
- Cross-namespace owner references are disallowed, an invalid one produces the `OwnerRefInvalidNamespace` warning event, and a cluster-scoped dependent with a namespaced owner kind cannot be garbage collected. VERIFIED. Same owners-and-dependents URL.
- Issue 65200 (closed 2020-11-17) and issue 94631 (closed 2020-09-09) cover invalid cross-namespace owner references and a request to add a namespace to owner references. VERIFIED. https://github.com/kubernetes/kubernetes/issues/65200 and https://github.com/kubernetes/kubernetes/issues/94631. The link to the v1.20 docs behavior is by timing and subject only.
- KEP-5080 (ordered namespace deletion, stable in v1.34) says namespace deletion uses background propagation and leaves owner-reference dependencies to the garbage collector. VERIFIED. https://github.com/kubernetes/enhancements/blob/master/keps/sig-api-machinery/5080-ordered-namespace-deletion/README.md
- KEP-2336 (`resource` field on owner references, alpha, milestone "0.0", last updated 2019-06-12) proposes avoiding "upwards of 20 discovery calls". Whether the field shipped is unconfirmed. VERIFIED for the proposal. https://github.com/kubernetes/enhancements/blob/master/keps/sig-api-machinery/2336-OwnerReference-resource-field/README.md
- The design archive file (last commit 2017-11-03) says `OrphanDependents` "defaults to true, because controllers before release 1.2 expect dependent objects to be orphaned" and that "Controllers are responsible for adopting orphaned dependent resources." VERIFIED, and outdated against current docs for the default. https://github.com/kubernetes/design-proposals-archive/blob/main/api-machinery/garbage-collection.md
- A KEP dedicated to cross-namespace ownership or garbage collector performance exists. UNVERIFIED (searched, none found).

### Cluster API and controller-runtime

- The Cluster API MachineSet controller adopts Machines that match its selector and have no controller reference, by patching a controller owner reference, and emits `SuccessfulAdopt` or `FailedAdopt` events. VERIFIED. https://github.com/kubernetes-sigs/cluster-api/blob/main/core/reconcilers/machineset/machineset_controller.go
- The book lists adoption duties for MachineSet and MachineDeployment, and the owner-reference guidelines say to create objects with an owner reference, re-reconcile it if lost, and use the latest apiVersion. VERIFIED. https://github.com/kubernetes-sigs/cluster-api/blob/main/docs/book/src/developer/core/controllers/machine-set.md and https://github.com/kubernetes-sigs/cluster-api/blob/main/docs/book/src/reference/api/owner-references.md
- `clusterctl move` sets `Cluster.Spec.Paused` to true before moving. VERIFIED. https://github.com/kubernetes-sigs/cluster-api/blob/main/docs/book/src/reference/clusterctl/commands/move.md
- No Cluster API non-test Go source uses orphan delete propagation, so deletion relies on default garbage collection. UNVERIFIED, a negative search.
- controller-runtime `SetControllerReference` sets `blockOwnerDeletion: true`, returns an error if another controller already controls the object, and rejects cross-namespace owners. VERIFIED. https://github.com/kubernetes-sigs/controller-runtime/blob/main/pkg/controller/controllerutil/controllerutil.go

### Crossplane

- The managed resource finalizer holds the object until the external resource is fully deleted, and uninstalling out of order can leave cloud resources running. VERIFIED. https://github.com/crossplane/docs/blob/master/content/v2.5/managed-resources/managed-resources.md and https://github.com/crossplane/docs/blob/master/content/v2.5/guides/uninstall-crossplane.md
- Issue 7801 reports that the namespace controller deletes objects in no particular order, so the credentials Secret can go first and leave the managed resource, usage objects, ProviderConfig, and namespace Terminating, and that hand-removing finalizers orphans external resources. VERIFIED as stated in the issue, open since 2026-09-02. https://github.com/crossplane/crossplane/issues/7801
- A 2026-10-14 comment reports finalization counts in provider-gitlab tests: with a namespaced ProviderConfig and Secret, 0 of 5 on master with crossplane-runtime v2.4.2 and 1 of 5 with the ProviderConfigUsage protection fix, and with `ClusterProviderConfig` 3 of 3 to 5 of 5 depending on build. SECONDARY-ONLY, user-run measurements.
- Pull request 7594 (the ProviderConfigUsage protection one-pager) is merged, and the Secret case is out of scope in the design. VERIFIED. https://github.com/crossplane/crossplane/pull/7594
- crossplane-runtime issue 1150 (open, reporter on v2.3.3) says `Connect()` runs before the deleted check and a rejected `ProviderConfigUsage` create (403 `NamespaceTerminating`) can block managed resource deletion for hours. SECONDARY-ONLY, only the start of the body was read. https://github.com/crossplane/crossplane-runtime/issues/1150
- A namespaced managed resource whose provider is absent stays Terminating and holds its namespace. UNVERIFIED, an inference from finalizer behavior.
- Composition functions do not run on composite deletion. The alpha deletion policy (behind `--enable-function-controlled-deletion`) has Background (default), Foreground, and Pipeline. Legacy cluster-scoped composites always use Background, `--cascade` flags bypass the policy, and Argo CD foreground propagation makes Crossplane ignore it with a warning event. VERIFIED. https://github.com/crossplane/docs/blob/master/content/v2.5/composition/compositions.md and https://github.com/crossplane/docs/blob/master/content/v2.5/composition/composite-resources.md
- `managementPolicies` is beta, default-on, and provider-dependent. Without `Delete`, Crossplane does not delete the external resource when deleting the managed resource, and an empty list pauses. VERIFIED. https://github.com/crossplane/docs/blob/master/content/v2.5/managed-resources/managed-resources.md
- How `managementPolicies` interact with the owner-reference cascade is documented. UNVERIFIED (the docs do not say).

## Open questions

- Whether the OneUptime blog describes any behavior other than the plugin's rejection is not established, and the post could not be found.
- Whether KEP-2336's `resource` field exists in any release is unconfirmed.
- Argo CD's tracking methods and owner-reference-based child discovery were not found to interact, and the official docs are silent.
- No controller-runtime helper for adopting orphaned objects was read, and the in-tree `ControllerRefManager` was not read.
- KREP-004 and KREP-014 were not read.
- Namespace deletion with the provider absent is undocumented, and whether KEP-5080 changes ordering for CRD-defined objects was not verified.

## Related pages

[concepts/owner-references-and-garbage-collection](../concepts/owner-references-and-garbage-collection.md), [entities/kro](../entities/kro.md), [entities/argo-cd](../entities/argo-cd.md), [entities/cluster-api](../entities/cluster-api.md), [entities/controller-runtime](../entities/controller-runtime.md), [entities/crossplane](../entities/crossplane.md), [comparisons/how-tools-garbage-collect-owner-references-inventory-and-finalizers](../comparisons/how-tools-garbage-collect-owner-references-inventory-and-finalizers.md)

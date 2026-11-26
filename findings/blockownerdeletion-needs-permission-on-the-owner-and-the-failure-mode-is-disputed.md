---
title: "blockOwnerDeletion needs permission on the owner and the failure mode is disputed"
type: finding
status: active
created: 2026-11-25
updated: 2026-11-26
sources:
  - id: research-gap-m2-ownership-gc
    hash: 62aafaded9c0
    ingested: 2026-11-26
  - id: research-owner-references-and-garbage-collection
    hash: bd4cc1219f2d
    ingested: 2026-11-25
aliases: []
tags: [pitfall, rbac, blockownerdeletion, verification]
---

# blockOwnerDeletion needs permission on the owner and the failure mode is disputed

> [!NOTE]
> **Correction 2026-11-26:** The admission plugin source shows a rejected write with a Forbidden error when the plugin is enabled, and the permission is `update` on the owner's `finalizers` subresource, not delete permission on the owner. The silent-drop claim stays unverified. See [[sources/research-gap-m2-ownership-gc]].

## Observation

The Owners and Dependents page says an admission controller restricts who can set `blockOwnerDeletion`, in wording based on delete permission on the owner. A controller-author blog from OneUptime says controllers need `update` on the owner's `/finalizers` subresource and that otherwise the flag is silently not honored. [[sources/research-owner-references-and-garbage-collection]]

## What the source settles

The admission plugin `OwnerReferencesPermissionEnforcement` (`plugin/pkg/admission/gc/gc_admission.go`, master) validates creates and updates. Edits that do not change owner references pass. For non-create operations the caller needs `delete` on the dependent. If the change adds `blockOwnerDeletion: true`, the caller also needs `update` on the `finalizers` subresource of every referenced owner, or `update` on `finalizers` for `*`. When the check fails the plugin returns `admission.NewForbidden` with "cannot set blockOwnerDeletion if an ownerReference refers to a resource you can't set finalizers on". That is a rejected request, not a silent drop. Creates are exempt from the delete check but not from the blocking check. The admission controllers reference states the same `finalizers` rule, so the source and that reference are authoritative over the owners-and-dependents wording. [[sources/research-gap-m2-ownership-gc]]

## The plugin is off by default upstream

`DefaultOffAdmissionPlugins()` in `pkg/kubeapiserver/options/plugins.go` subtracts a default-on list that does not include `OwnerReferencesPermissionEnforcement`, so upstream kube-apiserver does not run it unless it is enabled with `--enable-admission-plugins`. On such a cluster the write is accepted and the flag is stored with no permission check. Platform-specific defaults of managed distributions were not read. A search of kubernetes/kubernetes for `BlockOwnerDeletion` found no code path that strips the flag on write, which is a negative search and not proof. [[sources/research-gap-m2-ownership-gc]]

## Still unverified

The blog claim that the flag is "silently not honored" could not be located again, so it is unverified. One reading that fits the source is that where the plugin is off, the garbage collector honors the flag because its graph treats `blockOwnerDeletion: true` dependents as blocking in foreground deletion. Whether the blog describes some other behavior is not established. [[sources/research-gap-m2-ownership-gc]]

## Consequence

Where the plugin is enabled, a controller without `update` on the owner's `finalizers` subresource gets a Forbidden error when it creates or patches a dependent with the flag, which shows up as a reconcile error. Where it is off, the flag is stored and foreground deletion of the owner waits for the dependent as usual. Operator authors on clusters with the plugin enabled should grant `update` on `<owner resource>/finalizers`. See [[findings/foreground-deletion-waits-only-for-dependents-with-blockownerdeletion-true]] and [[concepts/owner-references-and-garbage-collection]].

## Related

[[examples/controller-runtime-sets-a-controller-reference-so-deleting-the-custom-resource-tears-down-its-children]]

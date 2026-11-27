---
title: Older ObserveOnly and deletionPolicy advice needs translation to managementPolicies
type: finding
status: active
created: 2026-11-25
updated: 2026-11-26
sources:
  - id: research-managed-resource
    hash: 09ca2f9dcdc6
    ingested: 2026-11-25
  - id: research-gap-g3-crossplane-v2
    hash: 073a1fe74dec
    ingested: 2026-11-26
aliases: []
tags: [pitfall, crossplane, terminology, deletion-policy, management-policies]
---

# Older ObserveOnly and deletionPolicy advice needs translation to managementPolicies

## Observation

Crossplane's vocabulary for ownership has changed. The design document began with three modes (FullControl, OrphanOnDelete, ObserveOnly), and the shipped feature became a list of verbs in `spec.managementPolicies`. Older blog advice, including the consultancy post the dossier read, still speaks of `ObserveOnly` and `deletionPolicy: Orphan`. The OnCallReady lesson adds that namespaced v2 managed resources have no `deletionPolicy` at all, and that the orphan idiom there is "everything except Delete". The managed resource dossier found no page that spells out the mapping from the old enum to the list. [sources/research-managed-resource](../sources/research-managed-resource.md) The v2.5 verification pass confirms that no single official page tabulates it either, and assembles the mapping from release notes, docs, and runtime code, see the update below.

## Why it matters

A reader who copies a v1-era recipe onto a v2 object may set a field that does not exist or that is overridden. The design document also lists a conflict risk between `deletionPolicy` and `managementPolicies`, and the wiki's [entities/crossplane](../entities/crossplane.md) page records that enabled management policies take precedence over `deletionPolicy`.

## Mitigations

Translate when teaching: observe-only becomes `["Observe"]`, orphan-on-delete becomes every verb except Delete, and a pause becomes an empty list. State the Crossplane version of any recipe. The mapping is now assembled, though still not on one official page, see [open-knowledge-gaps](../open-knowledge-gaps.md). See [concepts/managed-resource](../concepts/managed-resource.md) and [comparisons/deletion-policies-across-gitops-and-provider-tools](../comparisons/deletion-policies-across-gitops-and-provider-tools.md).

## Update from the v2.5 verification pass (2026-11-26)

Assembled mapping, from three sources ([sources/research-gap-g3-crossplane-v2](../sources/research-gap-g3-crossplane-v2.md)): `ObserveOnly` equals `managementPolicies: ["Observe"]` (the runtime code comment reads "ObserveOnly, just observe action is done, the external resource is considered as read-only", and the docs say "Crossplane only observes the resource"). Pause equals an empty list. `deletionPolicy: Orphan` equals a list without `Delete`. The default is `["*"]`. Taking control of an imported resource means changing `["Observe"]` to `["*"]`. The runtime lists about 15 supported combinations and rejects the rest with an error.

Status: `managementPolicies` is still beta in the v2.5 docs and the import guide. The v2.0.0 release removed `deletionPolicy` from namespaced managed resources, existing cluster-scoped ones keep it, and a deprecated runtime resolver combines the two fields (deleting only when both allow it). Issue 5283 to deprecate it is still open, see [examples/crossplane-issue-5283-has-left-deletionpolicy-deprecation-open-since-2024](../examples/crossplane-issue-5283-has-left-deletionpolicy-deprecation-open-since-2024.md). Correction note: the earlier statement that `managementPolicies` simply take precedence over `deletionPolicy` is too coarse for legacy resources. See [findings/a-managed-resource-without-delete-in-its-management-policies-is-removed-from-kubernetes-but-its-cloud-resource-stays](a-managed-resource-without-delete-in-its-management-policies-is-removed-from-kubernetes-but-its-cloud-resource-stays.md).

---
title: A down conversion webhook can stall garbage collection
type: finding
status: active
created: 2026-11-25
updated: 2026-11-26
sources:
  - id: research-custom-resource-definition
    hash: 6c26f7f89147
    ingested: 2026-11-25
  - id: research-gap-m6-admission-crds
    hash: 7cac38f11490
    ingested: 2026-11-26
aliases: []
tags: [pitfall, crd, conversion, webhooks, garbage-collection]
---

# A down conversion webhook can stall garbage collection

## Observation

A bug report in the Kubernetes repository describes what happens when the conversion webhook service behind a CRD is unavailable. The garbage collector in kube-controller-manager can fail to sync its cache, and cascading deletes then stop. In the reported case a Deployment is deleted but its ReplicaSets and Pods remain. The issue was closed as a duplicate of #101078, and the proposed direction was to let the garbage collector keep working with a partially synced informer. URL: https://github.com/kubernetes/kubernetes/issues/110720. The issue text, as returned by the fetch tool, reads "When the webhook service is down, the GC of controller-manager to be still working," which is likely a typo for "not working." [sources/research-custom-resource-definition](../sources/research-custom-resource-definition.md)

## Why it matters

A single third-party CRD with a conversion webhook can degrade core control-plane behavior far from the CRD itself, because the garbage collector watches every resource type, including custom ones. This is a blast-radius problem: the webhook is optional infrastructure from a platform team's view, but its absence harms unrelated workloads.

## Mitigations suggested by the sources

The dossier suggests preferring `None` conversion when schemas are compatible, using CEL rules instead of validating webhooks, and running webhooks highly available. These are the dossier's synthesis and not a documented fix. Correction 2026-11-26: the stall was fixed in Kubernetes 1.32 (see below).

## Related

[concepts/crd-versioning-and-storage-migration](../concepts/crd-versioning-and-storage-migration.md), [comparisons/crd-conversion-strategies-none-webhook-and-hub-and-spoke](../comparisons/crd-conversion-strategies-none-webhook-and-hub-and-spoke.md), [concepts/owner-references-and-garbage-collection](../concepts/owner-references-and-garbage-collection.md), [findings/admission-webhook-outages-are-a-recurring-failure-class](admission-webhook-outages-are-a-recurring-failure-class.md), and [open-knowledge-gaps](../open-knowledge-gaps.md).

## Status update from the admission and CRD dossier

Pull request 125796 merged on 2024-09-25 with milestone v1.32, and issue 101078 closed as completed. The collector now proceeds after a failed cache sync, but owners with `blockOwnerDeletion: true` in the unsynced type are not seen. Details and remaining unknowns are in [findings/since-kubernetes-1-32-the-garbage-collector-proceeds-after-a-failed-cache-sync-but-cannot-see-block-owner-deletion-owners-of-the-unsynced-type](since-kubernetes-1-32-the-garbage-collector-proceeds-after-a-failed-cache-sync-but-cannot-see-block-owner-deletion-owners-of-the-unsynced-type.md). [sources/research-gap-m6-admission-crds](../sources/research-gap-m6-admission-crds.md)

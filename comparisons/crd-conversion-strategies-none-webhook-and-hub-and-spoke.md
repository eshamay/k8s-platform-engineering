---
title: CRD conversion strategies, None, webhook, and hub-and-spoke
type: comparison
status: draft
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
tags: [crd, conversion, versioning, kubebuilder]
---

# CRD conversion strategies, None, webhook, and hub-and-spoke

## Summary

A CRD that serves several versions must convert between them. The API offers two strategies, and the hub-and-spoke pattern is a way to organize the code behind the webhook strategy. [[sources/research-custom-resource-definition]]

## Side by side

| Aspect | `None` | `Webhook` | Webhook organized as hub-and-spoke |
|---|---|---|---|
| What it does | Rewrites only `apiVersion` | Calls a service to translate objects | Same, with one hub version |
| Schema requirement | Versions must have compatible schemas | Schemas may differ | Schemas may differ |
| Runtime dependency | None | A service reachable by the apiserver, with `conversionReviewVersions` and a `caBundle` | Same |
| Code to write | None | Conversion logic | About 2(N-1) functions for N versions, not pairwise |
| Failure risk | Low | Webhook outage can stall requests and garbage collection | Same as webhook |

The `None` and `Webhook` rows come from the versioning task page at https://kubernetes.io/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definition-versioning/, and the hub-and-spoke column comes from https://book.kubebuilder.io/multiversion-tutorial/conversion-concepts.html. The outage risk comes from https://github.com/kubernetes/kubernetes/issues/110720.

## Guidance in the sources

Prefer `None` when schemas are compatible, because it removes the webhook dependency. Crossplane adds that breaking XRD changes need conversion webhooks and that group and names are immutable. Before dropping an old version from the spec, check `status.storedVersions` so that no stored objects remain in it.

## Related

[[concepts/crd-versioning-and-storage-migration]], [[decisions/conversion-webhook-versus-new-xrd-for-breaking-changes]], [[examples/kubebuilder-hub-and-spoke-conversion-for-multi-version-crds]], and [[findings/a-down-conversion-webhook-can-stall-garbage-collection]].

## Additions from the admission and CRD dossier

A down conversion webhook stalled garbage collection until Kubernetes 1.32 ([[findings/since-kubernetes-1-32-the-garbage-collector-proceeds-after-a-failed-cache-sync-but-cannot-see-block-owner-deletion-owners-of-the-unsynced-type]]). Cluster API uses conversion webhooks at `/convert` and its own migrator ([[findings/cluster-api-labels-crds-with-contract-versions-and-runs-a-crd-migrator-for-storage-version-migration]]). [[sources/research-gap-m6-admission-crds]]

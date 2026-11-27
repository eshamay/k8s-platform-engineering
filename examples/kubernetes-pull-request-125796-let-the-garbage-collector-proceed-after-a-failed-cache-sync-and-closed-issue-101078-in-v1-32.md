---
title: "Kubernetes pull request 125796 let the garbage collector proceed after a failed cache sync and closed issue 101078 in v1.32"
type: example
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-m6-admission-crds
    hash: 7cac38f11490
    ingested: 2026-11-26
aliases: []
tags: [garbage-collection, conversion-webhook, kubernetes-1-32, pull-request, verified]
---

# Kubernetes pull request 125796 let the garbage collector proceed after a failed cache sync and closed issue 101078 in v1.32

## Scenario

Issue 101078, "Creating a CRD with broken converter webhook prevents GC controller from initialization", stayed open through abandoned attempts: PR 110858 (closed unmerged 2024-02-04) and PR 120164 (closed unmerged 2024-08-28). PR 125796 "garbagecollector: controller should not be blocking on failed cache sync" merged 2024-09-25 with milestone v1.32 ("Garbage collector controller should not block indefinitely on cache sync failure."), and 101078 was closed as completed that day. https://github.com/kubernetes/kubernetes/pull/125796 and https://github.com/kubernetes/kubernetes/issues/101078 [sources/research-gap-m6-admission-crds](../sources/research-gap-m6-admission-crds.md)

## Reliability

VERIFIED from the issue and pull request pages and the 1.32 changelog. The remaining limitation is in the finding linked below.

## Related

[findings/since-kubernetes-1-32-the-garbage-collector-proceeds-after-a-failed-cache-sync-but-cannot-see-block-owner-deletion-owners-of-the-unsynced-type](../findings/since-kubernetes-1-32-the-garbage-collector-proceeds-after-a-failed-cache-sync-but-cannot-see-block-owner-deletion-owners-of-the-unsynced-type.md) and [examples/kubernetes-issue-127105-a-failing-resource-sync-stalled-garbage-collection-of-other-resources-in-an-ha-kind-cluster](kubernetes-issue-127105-a-failing-resource-sync-stalled-garbage-collection-of-other-resources-in-an-ha-kind-cluster.md).

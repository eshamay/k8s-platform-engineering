---
title: "Since Kubernetes 1.32 the garbage collector proceeds after a failed cache sync, but cannot see blockOwnerDeletion owners of the unsynced type"
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-m6-admission-crds
    hash: 7cac38f11490
    ingested: 2026-11-26
aliases: []
tags: [garbage-collection, conversion-webhook, crd, kubernetes-1-32, verified]
---

# Since Kubernetes 1.32 the garbage collector proceeds after a failed cache sync, but cannot see blockOwnerDeletion owners of the unsynced type

## Observation

The stall in which a broken CRD conversion webhook kept the garbage collector from starting was fixed upstream. Pull request 125796, "garbagecollector: controller should not be blocking on failed cache sync", merged on 2024-09-25 with milestone v1.32, and issue 101078 was closed as completed at the same moment. The Kubernetes 1.32 changelog carries the release note, which says the collector can continue when a resource cannot be listed or watched and adds: "Any objects in the unsynced resource type with owner references with `blockOwnerDeletion: true` will not be known to the garbage collector." Current master source logs "not all resource monitors could be synced, proceeding anyways". https://raw.githubusercontent.com/kubernetes/kubernetes/master/CHANGELOG/CHANGELOG-1.32.md and https://raw.githubusercontent.com/kubernetes/kubernetes/master/pkg/controller/garbagecollector/garbagecollector.go [[sources/research-gap-m6-admission-crds]]

## What is still not settled

A down webhook still leaves that resource type unwatched by the collector (the error appears and the metric `GarbageCollectorResourcesSyncError` counts it), so cascading deletes for owners and dependents of that type are not handled until the webhook recovers. No source read measures how long dependents linger, and no further partial-informer-sync work beyond this pull request was found. These two points are UNVERIFIED and stay open. The workaround comment in issue 101078 (delete the converter webhook while the controller is down) predates the fix.

## Related

[[findings/a-down-conversion-webhook-can-stall-garbage-collection]], [[examples/kubernetes-pull-request-125796-let-the-garbage-collector-proceed-after-a-failed-cache-sync-and-closed-issue-101078-in-v1-32]], [[concepts/owner-references-and-garbage-collection]], and [[concepts/crd-versioning-and-storage-migration]].

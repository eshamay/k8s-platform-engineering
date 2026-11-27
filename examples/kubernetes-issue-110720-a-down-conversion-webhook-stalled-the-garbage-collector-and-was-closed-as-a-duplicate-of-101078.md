---
title: "Kubernetes issue 110720, a down conversion webhook stalled the garbage collector and was closed as a duplicate of 101078"
type: example
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-m6-admission-crds
    hash: 7cac38f11490
    ingested: 2026-11-26
aliases: []
tags: [garbage-collection, conversion-webhook, crd, issue, verified]
---

# Kubernetes issue 110720, a down conversion webhook stalled the garbage collector and was closed as a duplicate of 101078

## Scenario

Issue 110720 was closed on 2022-06-24 as a duplicate of 101078 by maintainer liggitt, whose recommendation was that the collector stop blocking on discovery or informer sync, because "the only reason we block until discovered resources have synced is for blockOwnerDeletion", which is already advisory and racy. https://github.com/kubernetes/kubernetes/issues/110720 [sources/research-gap-m6-admission-crds](../sources/research-gap-m6-admission-crds.md)

## Reliability

VERIFIED. The fix arrived two years later, in [examples/kubernetes-pull-request-125796-let-the-garbage-collector-proceed-after-a-failed-cache-sync-and-closed-issue-101078-in-v1-32](kubernetes-pull-request-125796-let-the-garbage-collector-proceed-after-a-failed-cache-sync-and-closed-issue-101078-in-v1-32.md).

## Related

[findings/a-down-conversion-webhook-can-stall-garbage-collection](../findings/a-down-conversion-webhook-can-stall-garbage-collection.md) and [findings/since-kubernetes-1-32-the-garbage-collector-proceeds-after-a-failed-cache-sync-but-cannot-see-block-owner-deletion-owners-of-the-unsynced-type](../findings/since-kubernetes-1-32-the-garbage-collector-proceeds-after-a-failed-cache-sync-but-cannot-see-block-owner-deletion-owners-of-the-unsynced-type.md).

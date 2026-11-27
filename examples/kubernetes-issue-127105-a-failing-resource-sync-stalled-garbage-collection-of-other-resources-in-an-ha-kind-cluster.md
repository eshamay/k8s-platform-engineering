---
title: "Kubernetes issue 127105, a failing resource sync stalled garbage collection of other resources in an HA kind cluster"
type: example
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-m6-admission-crds
    hash: 7cac38f11490
    ingested: 2026-11-26
aliases: []
tags: [garbage-collection, crd, issue, kubernetes-1-32, verified]
---

# Kubernetes issue 127105, a failing resource sync stalled garbage collection of other resources in an HA kind cluster

## Scenario

Issue 127105, opened 2024-09-04 and closed 2024-10-08, described the same stall in an HA kind cluster. The reporter wrote "I'd expect that one resource failing to sync would not block the garbage collection of other resources." It closed shortly after PR 125796 merged. https://github.com/kubernetes/kubernetes/issues/127105 [sources/research-gap-m6-admission-crds](../sources/research-gap-m6-admission-crds.md)

## Reliability

VERIFIED for dates and quote. The reporter's setup details were not reproduced.

## Related

[examples/kubernetes-pull-request-125796-let-the-garbage-collector-proceed-after-a-failed-cache-sync-and-closed-issue-101078-in-v1-32](kubernetes-pull-request-125796-let-the-garbage-collector-proceed-after-a-failed-cache-sync-and-closed-issue-101078-in-v1-32.md) and [findings/a-down-conversion-webhook-can-stall-garbage-collection](../findings/a-down-conversion-webhook-can-stall-garbage-collection.md).

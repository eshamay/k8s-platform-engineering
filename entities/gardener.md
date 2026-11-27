---
title: Gardener
type: entity
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-scale-and-sharding
    hash: d082d1d36d7e
    ingested: 2026-11-25
aliases: []
tags: [gardener, managed-kubernetes, scale, multi-cluster]
---

# Gardener

## What it is

Gardener is a managed-Kubernetes project whose operators run many clusters, and its documentation includes sizing guidance for those clusters. In this wiki it matters as a source of operator advice that sits below the tested maximums in the SIG Scalability envelope. [sources/research-scale-and-sharding](../sources/research-scale-and-sharding.md)

## Scale guidance

The Gardener scalability guide says etcd is practically limited around 8 GB, that healthy clusters stay under about 3 GB and about 100,000 objects excluding events, that an API server pod is safe up to about 3 cores and 16 GB, and that most clusters should stay below 500 nodes. It names webhooks as a bottleneck risk and conversion webhooks as especially dangerous, because outages block garbage collection. These figures came through a summarizing fetch and need to be rechecked before use. https://gardener.cloud/docs/guides/administer-shoots/scalability/

## Status of this page

The page is a draft because the wiki holds only one source about Gardener and it was read through a digest.

## Related pages

[examples/gardener-advises-keeping-most-clusters-under-about-500-nodes-and-controlling-webhooks-and-object-counts](../examples/gardener-advises-keeping-most-clusters-under-about-500-nodes-and-controlling-webhooks-and-object-counts.md), [concepts/scale-and-sharding](../concepts/scale-and-sharding.md), [findings/etcd-scale-limits-of-the-shared-store](../findings/etcd-scale-limits-of-the-shared-store.md).

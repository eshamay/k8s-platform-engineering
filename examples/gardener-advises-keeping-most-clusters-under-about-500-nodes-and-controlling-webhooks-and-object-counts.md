---
title: Gardener advises keeping most clusters under about 500 nodes and controlling webhooks and object counts
type: example
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-scale-and-sharding
    hash: d082d1d36d7e
    ingested: 2026-11-25
aliases: []
tags: [gardener, scale, etcd, webhooks, multi-cluster]
---

# Gardener advises keeping most clusters under about 500 nodes and controlling webhooks and object counts

## Scenario

An operator that runs many clusters for many tenants cannot rely on the largest tested cluster size, because it must keep every cluster healthy over time. Gardener is such an operator, and its guide for administering shoot clusters gives practical limits. [[sources/research-scale-and-sharding]]

## What the guide says

The guide says etcd is practically limited around 8 GB, healthy clusters stay under about 3 GB and about 100,000 objects excluding events, and an API server pod is safe up to about 3 cores and 16 GB. Most clusters should stay below 500 nodes. Webhooks can become a bottleneck, and conversion webhooks are especially risky because an outage blocks garbage collection. The digest quotes a conditional promise: if you configure your cluster correctly, use extensibility features reasonably, and keep load within recommended limits, the cluster should stay healthy. That wording came from a digest and should be verified. https://gardener.cloud/docs/guides/administer-shoots/scalability/

## Lesson

The guide is a counterweight to the headline 5,000-node figure and a reminder that extension points such as CRDs and webhooks, and not node count, are often what breaks a cluster. See [[findings/tested-scalability-maximums-and-operator-advice-differ-by-an-order-of-magnitude]], [[findings/a-down-conversion-webhook-can-stall-garbage-collection]], [[entities/gardener]], and [[concepts/scale-and-sharding]].

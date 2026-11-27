---
title: The Amazon EKS kro overview lists ResourceGraphDefinition as the only primary resource type and names no kro version
type: finding
status: draft
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: resource-composition-with-kro
    hash: 1d5781610376
    ingested: 2026-11-26
aliases: []
tags: [kro, eks, aws, managed-kro, graph-api, version, vendor-docs]
---

# The Amazon EKS kro overview lists ResourceGraphDefinition as the only primary resource type and names no kro version

## Observation

The Amazon EKS overview page for kro says that kro "supports a single primary resource type", the ResourceGraphDefinition, and it never mentions the alpha `Graph` kind, a kro release number, or a feature gate. Its example uses `kro.run/v1alpha1`. [sources/resource-composition-with-kro](../sources/resource-composition-with-kro.md)

## Why it matters

The wiki records that kro v0.10.0 ships an alpha `Graph` kind that is off by default and that the RGD controller now runs on the graph engine, see [entities/kro](../entities/kro.md) and [decisions/build-platform-apis-on-resourcegraphdefinitions-or-track-the-alpha-graph-api](../decisions/build-platform-apis-on-resourcegraphdefinitions-or-track-the-alpha-graph-api.md). The AWS sentence does not conflict with that, because an off-by-default alpha kind is not a primary resource type that a customer would meet. It does mean the page cannot tell a reader whether the managed capability tracks upstream releases, lags them, or exposes the Graph kind at all. A platform team choosing between building on RGDs and tracking Graph therefore has no managed-offering answer from AWS's overview and has to read the capability's own reference or test a cluster.

## Limits of this finding

The statement is about what the overview page says. A longer AWS page or the capability's API reference may name a version, and this ingest did not read one. The page is vendor documentation, so the "fully managed" claim is AWS's description of its own service. Whether the managed offering changes the scaling behavior of kro's shared queue is not addressed, see [findings/kro-s-single-shared-queue-can-starve-resources-and-a-maintainer-proposed-weighted-queues](kro-s-single-shared-queue-can-starve-resources-and-a-maintainer-proposed-weighted-queues.md).

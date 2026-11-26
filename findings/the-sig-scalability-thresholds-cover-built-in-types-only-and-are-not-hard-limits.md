---
title: The SIG Scalability thresholds cover built-in types only and are not hard limits
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-g3-scale-recheck
    hash: d9bd6911bff7
    ingested: 2026-11-26
aliases: []
tags: [scale, sig-scalability, thresholds, crd-count, caveat]
---

# The SIG Scalability thresholds cover built-in types only and are not hard limits

## Observation

The SIG Scalability thresholds page is headed "Thresholds related to API server and etcd storage for builtin resource types". Its cluster-scope table gives 5000 nodes, 10000 namespaces, 150000 pods, and 10000 services, and its per-resource-type table gives 150,000 non-event objects, 1,000,000 events, 1.5 MB per object, and 3 GB total size. It adds namespace-scope limits of 3000 pods, 5000 services, 2000 deployments, and 250 endpoints per service, and a pods-per-node rule of min(110, 10 times the number of cores). It states "thresholds are NOT hard limits - crossing the limit results in degraded performance", and it says "For smaller clusters, the limits are proportionally lower." The page is written for Kubernetes head, and the release-blocking scale tests have run on kops since December 2025, so the figures are tied to that test setup. The file's last commit was on 2026-11-24 per the GitHub API. https://raw.githubusercontent.com/kubernetes/community/master/sig-scalability/configs-and-limits/thresholds.md [[sources/research-gap-g3-scale-recheck]]

## Why it matters

Because the table covers built-in types, it says nothing about custom resources, and the absence of a CRD count there is a scoping fact and not an oversight. The Crossplane provider-families blog of 13 June 2023 independently says CRD count was "never officially included as a Kubernetes scaling threshold". A platform team that uses the 5,000-node figure as a promise for a cluster full of CRDs, webhooks, and controllers is reading the table beyond its scope. Gardener's guide gives the more conservative operating advice, see [[findings/tested-scalability-maximums-and-operator-advice-differ-by-an-order-of-magnitude]].

## Related pages

[[concepts/scale-and-sharding]], [[findings/etcd-scale-limits-of-the-shared-store]], [[examples/gardener-advises-keeping-most-clusters-under-about-500-nodes-and-controlling-webhooks-and-object-counts]].

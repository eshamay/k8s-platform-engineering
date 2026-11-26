---
title: Upbound tested a multi-cloud control plane of about 2,000 managed resources and upstreamed Kubernetes fixes
type: example
status: active
created: 2026-11-25
updated: 2026-11-26
sources:
  - id: research-scale-and-sharding
    hash: d082d1d36d7e
    ingested: 2026-11-25
  - id: research-gap-g3-scale-recheck
    hash: d9bd6911bff7
    ingested: 2026-11-26
aliases: []
tags: [crossplane, upbound, crd-count, discovery, openapi, scale]
---

# Upbound tested a multi-cloud control plane of about 2,000 managed resources and upstreamed Kubernetes fixes

## Scenario

While testing a multi-cloud control plane with roughly 2,000 managed resources, Upbound found that installing thousands of CRDs broke both clients and the API server. The dossier cites the engineering post that records what failed and what was fixed. [[sources/research-scale-and-sharding]]

## What broke

On the client side, discovery needed around 300 HTTP requests and hit client-side throttling, and the kubectl disk cache was slow because of fsync use. A log line from the post reads "Waited for 1.033772408s due to client-side throttling, not priority and fairness, request". On the server side, OpenAPI computation burned CPU, memory use reached "a little over 4MiB" of resident memory per CRD, measured with 780 CRDs in the post's screenshot, and managed services "won't begin scaling until the API server is repeatedly OOM killed". Redundant etcd clients and loggers added overhead. The 2026-11-26 recheck read the full post text and confirmed these figures, which are Upbound's own self-reported measurements, so this page's earlier "several MiB" wording is corrected to "a little over 4 MiB". The post does not describe a formal out-of-memory test, only the observation. [[sources/research-gap-g3-scale-recheck]] https://www.upbound.io/blog/scaling-kubernetes-to-thousands-of-crds

## What was fixed

The fixes included higher kubectl discovery limits, checksum-based caching, lazy OpenAPI computation in Kubernetes 1.23, and shared loggers. The Crossplane project then chose provider families as its own remedy, because code-generated providers outgrew the upstream fixes. See [[examples/crossplane-provider-families-let-operators-install-only-the-cloud-services-they-use]] and [[decisions/split-a-large-provider-into-families-or-filter-or-lazy-load-its-crds]].

## Lesson

The log line separates client-side throttling from API Priority and Fairness, which is the distinction recorded in [[findings/client-side-throttling-and-server-side-apf-are-separate-layers]]. The wider CRD cost is described in [[findings/one-crd-per-external-resource-type-overloads-api-server-discovery-and-openapi-computation]] and [[concepts/scale-and-sharding]].

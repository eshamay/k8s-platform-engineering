---
title: Aggregated discovery exists because per-group-version discovery caused a request storm
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-m5-informers-caches
    hash: 1a6a4969c0c2
    ingested: 2026-11-26
aliases: [KEP-3352 rationale]
tags: [discovery, aggregated-discovery, kep, api-machinery, mechanism]
---

# Aggregated discovery exists because per-group-version discovery caused a request storm

## Observation

KEP-3352, owned by SIG api-machinery and implemented, gives the rationale that the wiki previously lacked. Discovery was served as many small per-group-version documents, and the KEP says "This causes a storm of requests for clusters and is a source of latency and throttling." The dossier reports up to 80 requests for a client to learn the whole API surface, and the KEP notes that kubectl "has implemented a 6 hour timer during which the discovery API is not refreshed", which is a freshness trade-off made to limit that traffic. The KEP names controllers among the affected clients but does not mention controller-runtime's mapper. https://github.com/kubernetes/enhancements/blob/master/keps/sig-api-machinery/3352-aggregated-discovery/README.md [[sources/research-gap-m5-informers-caches]]

The `kep.yaml` (created 2022-06-07) lists alpha v1.26, beta v1.27 and stable v1.30, with the feature gate `AggregatedDiscovery`. https://github.com/kubernetes/enhancements/blob/master/keps/sig-api-machinery/3352-aggregated-discovery/kep.yaml

## What this means for mappers

A dynamic mapper that reloads on a miss is cheaper when one reload is one request and not dozens. The KEP does not make this link for controller-runtime, so the connection is an inference from the two sources. See [[findings/the-dynamic-restmapper-is-confirmed-as-the-controller-runtime-default-at-v0-3-0-from-the-release-notes-and-tag-source]], [[concepts/api-discovery-and-restmapper]], and [[findings/one-crd-per-external-resource-type-overloads-api-server-discovery-and-openapi-computation]].

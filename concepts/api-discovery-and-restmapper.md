---
title: API discovery and the RESTMapper
type: concept
status: active
created: 2026-11-25
updated: 2026-11-26
sources:
  - id: research-gvk-and-gvr
    hash: 5c56bb1e05a8
    ingested: 2026-11-25
  - id: research-gap-m5-informers-caches
    hash: 1a6a4969c0c2
    ingested: 2026-11-26
aliases: [RESTMapper, discovery, aggregated discovery]
tags: [api-machinery, discovery, client-go]
---

# API discovery and the RESTMapper

## Definition

The Kubernetes API publishes itself in two ways: the Discovery API and OpenAPI. Clients use the discovery documents to learn which group-versions and resources exist, and they feed that knowledge into a RESTMapper that translates a [[concepts/gvk-and-gvr]] Kind into the resource that appears in a URL. [[sources/research-gvk-and-gvr]]

## Discovery

Unaggregated discovery requires one request per group-version after the `/api` and `/apis` roots. Aggregated discovery, stable in Kubernetes v1.30, serves every resource for `/api` and `/apis` in one request when the client sends the `apidiscovery.k8s.io` Accept header, so modern clients make far fewer startup calls. OpenAPI v3 has been stable since v1.27 and is preferred over v2. KEP-3352 (alpha v1.26, beta v1.27, stable v1.30) gives the rationale: per-group-version discovery "causes a storm of requests for clusters and is a source of latency and throttling" ([[findings/aggregated-discovery-exists-because-per-group-version-discovery-caused-a-request-storm]]). Correction note, 2026-11-26: this page previously said no KEP was found. URL: https://kubernetes.io/docs/concepts/overview/kubernetes-api/.

## The RESTMapper and the Scheme

The client-go restmapper package builds a mapper from discovery output with `NewDiscoveryRESTMapper` and `GetAPIGroupResources`. It assembles per-group-version DefaultRESTMappers with priority ordering, preferring the preferred version and putting core v1 first. `NewShortcutExpander` adds abbreviations such as `po`. A second registry, the Scheme, maps GVKs to Go types so typed clients can decode JSON, while dynamic and unstructured clients skip the Scheme and take a GVR directly. See [[entities/client-go]] and [[comparisons/restmapper-strategies-static-deferred-and-dynamic]].

## Why discovery is a snapshot

A mapper built once reflects the cluster at that moment. A CRD installed later is unknown until the mapper is reset or rebuilt, which produces "no matches for kind" errors. See [[findings/stale-restmapper-hides-newly-installed-crds]].

## Related

[[concepts/custom-resource-definition]], [[concepts/informers-reflectors-and-workqueues]], [[entities/controller-runtime]]

## Dynamic mapper history

controller-runtime's v0.3.0 release notes (2019-10-10) list the `DynamicRESTMapper` and the v0.3.0 manager source returns it as the default. Pull request 2296 (merged 2023-05-04) reworked it into a single mapper that holds an aggregated-discovery-capable client. See [[findings/the-dynamic-restmapper-is-confirmed-as-the-controller-runtime-default-at-v0-3-0-from-the-release-notes-and-tag-source]]. [[sources/research-gap-m5-informers-caches]]

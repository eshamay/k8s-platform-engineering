---
title: Config Connector caches only its own configuration kinds by default
type: example
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-m5-informers-caches
    hash: 1a6a4969c0c2
    ingested: 2026-11-26
aliases: []
tags: [config-connector, cache, memory, client, no-cache]
---

# Config Connector caches only its own configuration kinds by default

## Scenario

By default the Config Connector manager's client caches only `ConfigConnector` and `ConfigConnectorContext` objects and CRDs, and disables caching for Namespace, Secret, ConfigMap and IAM kinds. The code comment gives the goal: "so that our memory usage should not grow with the size of objects in the cluster, only those we are actively reconciling." It also says "Don't cache unstructured objects (this is the default anyway)". https://github.com/GoogleCloudPlatform/k8s-config-connector/blob/master/pkg/controller/kccmanager/nocache/clientbuilder.go (default branch read 2026-11-26) [[sources/research-gap-m5-informers-caches]]

The alternative mode that caches everything is gated by a `UseCache` field commented "Currently only used in preview". https://github.com/GoogleCloudPlatform/k8s-config-connector/blob/master/pkg/controller/kccmanager/kccmanager.go The manager flags include a client QPS of 20 and burst of 30 and a scoped-namespace flag that limits the cache. https://github.com/GoogleCloudPlatform/k8s-config-connector/blob/master/cmd/manager/main.go

The design trades memory for live reads, the same trade-off as `DisableFor` in [[findings/controller-runtime-narrows-its-cache-with-selectors-transforms-metadata-only-informers-and-disable-for-and-each-option-has-a-cost]]. See [[comparisons/informer-and-cache-choices-across-kro-config-connector-ack-and-cluster-api]] and [[entities/config-connector]].

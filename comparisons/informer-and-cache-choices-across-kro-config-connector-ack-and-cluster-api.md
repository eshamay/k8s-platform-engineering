---
title: Informer and cache choices across kro, Config Connector, ACK, and Cluster API
type: comparison
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-m5-informers-caches
    hash: 1a6a4969c0c2
    ingested: 2026-11-26
aliases: []
tags: [kro, config-connector, ack, cluster-api, informers, cache, rate-limits]
---

# Informer and cache choices across kro, Config Connector, ACK, and Cluster API

Values were read from each project's default branch on 2026-11-26 (kro release v0.10.0), not from release tags for the other three. No memory measurement exists for any of them. [[sources/research-gap-m5-informers-caches]]

| Choice | kro | Config Connector | ACK | Cluster API |
|---|---|---|---|---|
| Informer keying | One shared metadata-only informer per GVR | One controller per CRD group and kind | One controller binary per AWS service | controller-runtime caches by GVK |
| What the manager caches | Object metadata for watched GVRs | Only ConfigConnector and ConfigConnectorContext objects and CRDs | Namespaces from `--watch-namespace`, label selector from `--watch-selectors` | Secrets with the cluster-name label only, plus a partial-metadata Secret cache |
| Cache bypass | Not read | Namespace, Secret, ConfigMap and IAM kinds, and unstructured | Not read | ConfigMap and Secret on the manager client |
| Periodic mechanism | Resync 36000 s on the metadata informers | Not read | `RequeueAfter` of 10 hours after success | `--sync-period` 10 minutes, a cache replay |
| Client rate | QPS 100, burst 150 | QPS 20, burst 30 | Not read | kube-api QPS 100, burst 200, and workload-cluster QPS 20, burst 30 |
| Concurrency | 1 for each controller flag, apply concurrency 20 | Not read | 1 per resource, per-kind override | Per-controller flags, for example machine 100, cluster 50, clustercache 100 |
| Event filter | Not read | Not read | `GenerationChangedPredicate` unless ignore-field-drift is on | Not read |
| Notable extra | Optional warmup before leader election | Cache-everything mode is preview-only | Separate cross-account cache when several namespaces are watched | Per-workload-cluster cache that strips managed fields |

## Reading the table

The four tools reach for different narrowing options, and none of them leaves the default of caching everything. kro narrows by type of data, Config Connector by which kinds are cached, ACK by namespace and label, and Cluster API by label and by splitting caches per target cluster. A cell that says "Not read" means the dossier did not read that setting for that tool, and it does not mean the tool lacks the control. Backstage was not researched. See [[examples/kro-keeps-one-metadata-only-shared-informer-per-gvr]], [[examples/config-connector-caches-only-its-own-configuration-kinds-by-default]], [[examples/ack-service-controllers-scope-their-cache-by-namespace-and-label-selector-and-trigger-on-generation-changes]], [[examples/cluster-api-caches-only-cluster-labelled-secrets-and-gives-each-workload-cluster-its-own-cache]], and [[decisions/narrow-the-controller-cache-with-selectors-transforms-or-metadata-only-informers-or-bypass-it-for-some-types]]. For Flux, Argo CD and Crossplane see [[comparisons/concurrency-and-cache-memory-controls-across-flux-argo-cd-and-crossplane]].

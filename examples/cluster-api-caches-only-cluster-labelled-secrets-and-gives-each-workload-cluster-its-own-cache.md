---
title: Cluster API caches only cluster-labelled Secrets and gives each workload cluster its own cache
type: example
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-m5-informers-caches
    hash: 1a6a4969c0c2
    ingested: 2026-11-26
aliases: []
tags: [cluster-api, cache, secrets, cluster-cache, workload-cluster]
---

# Cluster API caches only cluster-labelled Secrets and gives each workload cluster its own cache

## Scenario

The Cluster API core manager (main) restricts its Secret cache to Secrets that carry the cluster-name label, with the comment "We only cache secrets that have the cluster-name label", and keeps data only for Secrets named for kubeconfigs. ConfigMap and Secret are excluded from the manager client's cache, and a separate partial-metadata Secret cache exists. The client does use the cache for Unstructured get and list calls: "Use the cache for all Unstructured get/list calls that are done with this client." https://github.com/kubernetes-sigs/cluster-api/blob/main/core/setup/setup.go [[sources/research-gap-m5-informers-caches]]

A `ClusterCache` holds a cache per workload cluster. It uses `DefaultTransform: ctrlcache.TransformStripManagedFields()` and disables caching for Pods, DaemonSets and more, with its own client QPS of 20 and burst of 30. The management-cluster client uses kube-api QPS 100 and burst 200, and the `--sync-period` default is `10*time.Minute`, with per-controller concurrency flags such as machine 100, cluster 50 and clustercache 100. https://github.com/kubernetes-sigs/cluster-api/blob/main/core/main.go

The sync period is the controller-runtime cache replay and not a cloud poll ([[findings/the-cluster-api-sync-period-flag-is-a-cache-resync-and-not-a-poll-of-the-cloud-infrastructure]]). See [[comparisons/informer-and-cache-choices-across-kro-config-connector-ack-and-cluster-api]] and [[entities/cluster-api]].

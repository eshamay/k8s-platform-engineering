---
title: Argo CD application controller shards clusters and tunes processor counts
type: example
status: active
created: 2026-11-25
updated: 2026-11-26
sources:
  - id: research-informers-reflectors-and-workqueues
    hash: f9de5ca73ab6
    ingested: 2026-11-25
  - id: research-scale-and-sharding
    hash: d082d1d36d7e
    ingested: 2026-11-25
  - id: research-gap-g3-argocd-capi
    hash: c3d485fa58ae
    ingested: 2026-11-26
  - id: research-gap-g3-scale-recheck
    hash: d9bd6911bff7
    ingested: 2026-11-26
aliases: []
tags: [argo-cd, sharding, cache, memory, scale]
---

# Argo CD application controller shards clusters and tunes processor counts

## Scenario

An Argo CD installation manages many applications across many clusters. The application controller must compare live state with desired state for all of them without repeated API queries or running out of memory. [[sources/research-informers-reflectors-and-workqueues]]

## What the operator manual says

The controller keeps a lightweight cluster cache fed by Kubernetes watch APIs and does not query repeatedly. To scale it, the manual describes three levers. Clusters can be sharded across controller replicas with one of three algorithms: `legacy`, `round-robin`, or `consistent-hashing`. The `--status-processors` and `--operation-processors` flags set the worker counts, with defaults of 20 and 10. The docs give a worked example: "For 1000 applications, we use 50 for `--status-processors` and 25 for `--operation-processors`", verified in the v3.6.3 file and on master on 2026-11-26. [[sources/research-gap-g3-scale-recheck]] Setting `GOMEMLIMIT` to 80 to 90 percent of the container memory limit helps the Go runtime collect garbage before the container is killed for running out of memory. URL: https://argo-cd.readthedocs.io/en/stable/operator-manual/high_availability/.

## Lesson

Argo CD answers the cache-memory problem by splitting the cache across replicas, which is sharding by cluster, and answers the concurrency problem with explicit worker counts. This is the only sharding evidence in the wiki so far, and it covers Argo CD alone. See [[entities/argo-cd]], [[findings/informer-caches-hold-every-watched-object-and-memory-grows-with-cluster-size]], and [[comparisons/concurrency-and-cache-memory-controls-across-flux-argo-cd-and-crossplane]].

## Additional evidence from the scale dossier

The scale dossier confirms the sharding description from the same high-availability page and adds the details that `ARGOCD_CONTROLLER_REPLICAS` tells each replica the total, that clusters can be pinned to a shard through the cluster secret, and that the legacy algorithm is uneven while round-robin and consistent-hashing were labelled experimental, a label that the 2026-11-26 recheck found unchanged at v3.6.3 and on master. The two internal queues handle reconciliation in milliseconds and syncing in seconds. Hub-and-spoke setups, where one control plane manages many destination clusters, are the typical scenario. Still no named adopter is given. See [[findings/argo-cd-legacy-sharding-can-be-uneven-and-the-other-algorithms-were-labelled-experimental]], [[comparisons/flux-label-sharding-versus-argo-cd-cluster-sharding]], and [[sources/research-scale-and-sharding]].

## Algorithm maturity at v3.6.3

The 2026-11-26 dossier read the same high-availability page at v3.6.3 and found round-robin and consistent-hashing still described as "an experimental feature", with the maturity page listing both as Alpha. The docs ask for community feedback before a production-ready state, and cite a CNOE benchmark blog that was not read. The `legacy` method is "uid based distribution (non-uniform)". See [[findings/argo-cd-legacy-sharding-can-be-uneven-and-the-other-algorithms-were-labelled-experimental]] and [[sources/research-gap-g3-argocd-capi]].

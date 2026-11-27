---
title: etcd scale limits of the shared store
type: finding
status: contradicted
created: 2026-11-25
updated: 2026-11-26
sources:
  - id: research-universal-control-plane
    hash: 037575049a4c
    ingested: 2026-11-25
  - id: research-custom-resource-definition
    hash: 6c26f7f89147
    ingested: 2026-11-25
  - id: research-gap-g3-scale-recheck
    hash: d9bd6911bff7
    ingested: 2026-11-26
  - id: research-gap-m6-admission-crds
    hash: 7cac38f11490
    ingested: 2026-11-26
aliases: []
tags: [pitfall, etcd, scale]
---

# etcd scale limits of the shared store

## Observation

Every custom resource lives in etcd, and etcd was not designed as a general-purpose database. Learnk8s lists the limits: a single Raft write leader, so that "every write takes at least one network round-trip to the followers, plus a disk fsync on each node"; a single bbolt file whose default storage limit is 2 GiB, with 8 GiB as a suggested maximum (corrected 2026-11-26, see Contradictions); MVCC revision growth that needs compaction and defragmentation; and request-size limits. The API server then amplifies list and watch load. [sources/research-universal-control-plane](../sources/research-universal-control-plane.md)

## Symptoms

Quota alarms freeze writes, compaction lags, memory spikes, and many controllers contending for the same objects produce write conflicts. The API conventions answer conflicts with `resourceVersion` and HTTP 409 retries. Each added CRD and controller adds load and failure surface.

## Mitigations

- Move Events to a separate etcd.
- Use Kine with SQL backends, or cloud-provider custom backends.
- Use watch-cache and streaming-list improvements.
- Give tenants their own control planes through vCluster or [entities/kcp](../entities/kcp.md).

vCluster argues that one etcd cannot be sharded across replication groups for a logical keyspace and cites degradation around 30,000 to 40,000 objects. That figure is a vendor claim that depends on the workload.

## Related

[concepts/universal-control-plane](../concepts/universal-control-plane.md), [concepts/informers-reflectors-and-workqueues](../concepts/informers-reflectors-and-workqueues.md), [comparisons/tenancy-models-namespaces-vcluster-kcp](../comparisons/tenancy-models-namespaces-vcluster-kcp.md), and the seeded gap on scale in [open-knowledge-gaps](../open-knowledge-gaps.md).

## Additions from the CRD dossier

Custom resources share the same storage and watch paths as built-in objects. The SIG Scalability thresholds page, read in full on 2026-11-26, gives a 1.5 MB size per object, 150,000 non-event objects per resource type, and 3 GB total size for built-in types, and says the thresholds "are NOT hard limits". Gardener's guide independently says "ETCD has a practical space limit of 8 GB" and that a healthy database is under 3 GB. [sources/research-gap-g3-scale-recheck](../sources/research-gap-g3-scale-recheck.md) The earlier note that the 1.5 MB figure was unconfirmed is superseded by this check. Ant Group tuned the apiserver watch cache and etcd for a cluster of more than 10,000 nodes, cutting memory from roughly 400 GB to 100 GB, though without CRD-specific numbers. [sources/research-custom-resource-definition](../sources/research-custom-resource-definition.md) See [examples/ant-group-large-cluster-tuning-of-apiserver-watch-cache-and-etcd](../examples/ant-group-large-cluster-tuning-of-apiserver-watch-cache-and-etcd.md).

## Contradictions

> [!WARNING]
> **This page said:** the secondary explainer lists "a single bbolt file with an 8 GB default cap".<br>
> **The 2026-11-26 dossier says:** the etcd limits page states a default storage limit of 2 GiB and "8 GiB is a suggested maximum size for normal environments", and the default maximum request size is 1.5 MiB. [sources/research-gap-m6-admission-crds](../sources/research-gap-m6-admission-crds.md)<br>
> **Suggested resolution:** the body text above is already corrected. A reviewer can return the page to active. See [findings/etcd-limits-requests-to-1-5-mib-and-storage-to-2-gib-by-default-and-8-gib-is-a-suggested-maximum-not-the-default](etcd-limits-requests-to-1-5-mib-and-storage-to-2-gib-by-default-and-8-gib-is-a-suggested-maximum-not-the-default.md).

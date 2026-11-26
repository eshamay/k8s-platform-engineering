---
title: etcd scale limits of the shared store
type: finding
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-universal-control-plane
    hash: 037575049a4c
    ingested: 2026-11-25
aliases: []
tags: [pitfall, etcd, scale]
---

# etcd scale limits of the shared store

## Observation

Every custom resource lives in etcd, and etcd was not designed as a general-purpose database. Learnk8s lists the limits: a single Raft write leader, so that "every write takes at least one network round-trip to the followers, plus a disk fsync on each node"; a single bbolt file with an 8 GB default cap; MVCC revision growth that needs compaction and defragmentation; and request-size limits. The API server then amplifies list and watch load. [[sources/research-universal-control-plane]]

## Symptoms

Quota alarms freeze writes, compaction lags, memory spikes, and many controllers contending for the same objects produce write conflicts. The API conventions answer conflicts with `resourceVersion` and HTTP 409 retries. Each added CRD and controller adds load and failure surface.

## Mitigations

- Move Events to a separate etcd.
- Use Kine with SQL backends, or cloud-provider custom backends.
- Use watch-cache and streaming-list improvements.
- Give tenants their own control planes through vCluster or [[entities/kcp]].

vCluster argues that one etcd cannot be sharded across replication groups for a logical keyspace and cites degradation around 30,000 to 40,000 objects. That figure is a vendor claim that depends on the workload.

## Related

[[concepts/universal-control-plane]], [[concepts/informers-reflectors-and-workqueues]], [[comparisons/tenancy-models-namespaces-vcluster-kcp]], and the seeded gap on scale in [[open-knowledge-gaps]].

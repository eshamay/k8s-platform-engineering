---
title: How core controllers handle cache lag
type: example
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-level-triggered-vs-edge-triggered
    hash: 27a34aa0de59
    ingested: 2026-11-25
aliases: []
tags: [controllers, replicaset, statefulset, deployment, cache]
---

# How core controllers handle cache lag

## Scenario

The ReplicaSet, StatefulSet, and Deployment controllers are the canonical level-triggered controllers. Each must create Pods to close a gap between desired and observed replicas, and each reads from an informer cache that can lag behind its own writes. [[sources/research-level-triggered-vs-edge-triggered]]

## How each one copes

According to the controller-runtime FAQ, StatefulSet appends ordinal numbers to Pod names and Deployment hashes the Pod template into names, so a duplicate create is rejected by the API server because the name already exists. ReplicaSet instead tracks its own actions (expectations) and requeues until the cache catches up. The FAQ also describes a requeue-after-timeout approach for cases that use generateName. See [[findings/stale-cache-and-double-action]].

## Why it matters

The same level-based loop is made safe by two different mechanisms, which shows that correctness here comes from design discipline and not from the trigger model alone. The HackerNoon article adds a remark attributed to Joe Beda that Kubernetes has shipped bugs that went unnoticed because the loop self-corrected, which is the level-triggered property working as intended. That quote was not verified against its cited book. See [[concepts/level-triggered-vs-edge-triggered]] and [[entities/controller-runtime]].

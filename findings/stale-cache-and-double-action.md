---
title: Stale cache and double action
type: finding
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-level-triggered-vs-edge-triggered
    hash: 27a34aa0de59
    ingested: 2026-11-25
  - id: research-eventual-consistency-and-convergence
    hash: bb35eafbd239
    ingested: 2026-11-25
aliases: [Expectations problem]
tags: [pitfall, controllers, cache, level-triggered]
---

# Stale cache and double action

## Observation

A level-triggered controller reads its informer cache, and that cache can lag the controller's own writes. If the controller creates a Pod and reconciles again before the cache shows it, the gap still appears to exist and the controller may create a second Pod. A simulation in the Ayson blog post shows the same effect abstractly: a regulator that cannot see its own recent writes ends with four plates when three were wanted. Edge-triggered handling survives delay but not loss, while level-triggered handling survives loss but not blind spots about its own actions. [[sources/research-level-triggered-vs-edge-triggered]]

## Interpretation

Pure level-triggering is not enough. The post's fix is Kubernetes-style expectations, where the loop remembers its own unseen writes and clears them using API resource versions. This is why mature controllers are a hybrid of level-based logic plus bookkeeping about in-flight actions. See [[decisions/events-as-hints-state-as-truth]].

## Mitigations

The controller-runtime FAQ lists two approaches used by built-in controllers. StatefulSet and Deployment use deterministic names (ordinal numbers and a hash of the pod template), so the API server rejects a duplicate create. ReplicaSet tracks its own actions as expectations and requeues, and generateName cases can requeue after a timeout. See [[examples/how-core-controllers-handle-cache-lag]] and [[entities/controller-runtime]].

## Caveat

The Ayson post was read only through a summarizing fetch, and the "Kubernetes Controller Writing Guide" it cites was not located. See [[open-knowledge-gaps]].

## Kubernetes v1.36 staleness work

Kubernetes v1.36 adds staleness mitigation and metrics for cache synchronization and watch latency, and optimistic concurrency through `resourceVersion` turns a write based on stale data into a 409 conflict that the controller retries. [[sources/research-eventual-consistency-and-convergence]] See [[concepts/informers-reflectors-and-workqueues]].

## Related

[[concepts/informers-reflectors-and-workqueues]], [[concepts/idempotency]], [[concepts/level-triggered-vs-edge-triggered]]

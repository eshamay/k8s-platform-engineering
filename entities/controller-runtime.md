---
title: controller-runtime
type: entity
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
  - id: research-gvk-and-gvr
    hash: 5c56bb1e05a8
    ingested: 2026-11-25
aliases: [sigs.k8s.io/controller-runtime]
tags: [tool, controllers, framework]
---

# controller-runtime

controller-runtime is the Kubernetes SIGs library for writing controllers and operators in Go, and it is the code-level home of the level-based contract. [[entities/kubebuilder]] builds on it. [[sources/research-level-triggered-vs-edge-triggered]]

## The Reconciler contract

The reconcile package states that "Reconciliation is level-based, meaning action isn't driven off changes in individual Events, but instead is driven by actual cluster state." A `Request` carries only a namespaced name and no event type, so authors cannot write event-specific logic even if they wanted to. Returning a non-nil error requeues the request with exponential backoff, except for a `TerminalError`, which stops retrying. `RequeueAfter` schedules a timed revisit. See [[concepts/reconciliation-loop]] and [[findings/failure-retry-loops-and-backoff]].

## Author guidance from the FAQ

The FAQ recommends one controller per root object type, with other objects mapped to the root through owner or map-function handlers. It tells authors not to branch on create, update, or delete, to reconcile idempotently by reading all needed state and then writing updates, to assume cache reads can be stale, and to test with envtest rather than fake clients. See [[findings/event-specific-logic-in-reconcilers]], [[findings/stale-cache-and-double-action]], and [[concepts/idempotency]].

## Requeue semantics

A third-party guide summarizes the return values: nil with an empty result means converged, `RequeueAfter` means waiting, and an error means failure with exponential backoff. [[sources/research-eventual-consistency-and-convergence]] See [[findings/errors-used-as-timers-in-reconcilers]].

## Related

[[concepts/level-triggered-vs-edge-triggered]], [[concepts/informers-reflectors-and-workqueues]], [[examples/how-core-controllers-handle-cache-lag]]

## To research

Informer resync semantics and the exact cache implementation were not covered; see [[open-knowledge-gaps]].

## Dynamic RESTMapper

Issue 321 documents that a client's RESTMapper built once at startup could not see CRDs created later. The fix was a dynamic, rate-limited mapper that invalidates on lookup failure, reported as the default since v0.3.0, a claim that should be checked against release notes. [[sources/research-gvk-and-gvr]] See [[findings/stale-restmapper-hides-newly-installed-crds]], [[comparisons/restmapper-strategies-static-deferred-and-dynamic]], and [[entities/client-go]].

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
  - id: research-operator-pattern
    hash: eab72eca2e1b
    ingested: 2026-11-25
  - id: research-reconciliation-loop
    hash: df7d66206baf
    ingested: 2026-11-25
  - id: research-idempotency
    hash: 4704ffd77903
    ingested: 2026-11-25
  - id: research-informers-reflectors-and-workqueues
    hash: f9de5ca73ab6
    ingested: 2026-11-25
  - id: research-owner-references-and-garbage-collection
    hash: bd4cc1219f2d
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

## Foundation for Kubebuilder and the Operator SDK

The operator-pattern dossier describes Kubebuilder and the Operator SDK as both built on controller-runtime, which supplies the informer, cache, and workqueue plumbing that the controller guidelines require. [[sources/research-operator-pattern]] See [[entities/operator-sdk]] and [[concepts/operator-pattern]].

## Result, TerminalError, and backoff tuning

The reconcile package defines `Request` (name and namespace only), `Result` with a deprecated `Requeue`, `RequeueAfter`, and an optional `Priority`, and `TerminalError`, which is logged and counted but not retried. Backoff is tuned through the controller's `RateLimiter` option. Sources disagree on whether `Requeue: true` backs off. [[sources/research-reconciliation-loop]] See [[decisions/choose-error-requeueafter-or-terminalerror-in-a-reconciler]] and [[findings/the-requeue-true-result-is-deprecated-and-described-inconsistently]].

## FAQ guidance on idempotent reconcilers

The controller-runtime FAQ says reconcile functions must be idempotent and must read all the state they need before writing updates, so skipped or coalesced events and restarts are harmless. It recommends deterministic object names so the API server rejects a duplicate create, tracking actions and requeueing when names are generated, and testing with envtest against resulting state and not against which API calls were made. The dossier read the raw GitHub copy because the rendered page was empty. [[sources/research-idempotency]] See [[examples/built-in-controllers-use-deterministic-names-to-avoid-duplicate-children]] and [[concepts/idempotency]].

## Cache, cache-backed client, and default limiter

The Kubernetes blog describes the cache as an in-memory, watch-fed copy that the manager's cache-backed client reads from, while writes and status updates go to the API server and authoritative reads need an explicit uncached reader. Memory grows with watched objects and there is no eviction. The default workqueue limiter, as extracted, takes the maximum of a per-item exponential limiter (5 ms base, 1000 s cap) and a token bucket (10 per second, burst 100). `Owns()` and `Watches()` register informers and event-to-key mappings. [[sources/research-informers-reflectors-and-workqueues]] See [[concepts/informers-reflectors-and-workqueues]], [[findings/informer-caches-hold-every-watched-object-and-memory-grows-with-cluster-size]], and [[findings/stale-cache-and-double-action]].

## Owner reference helpers

`controllerutil.SetControllerReference` writes an owner reference with `controller: true` and `blockOwnerDeletion: true` and enables `Owns()` watches, and `SetOwnerReference` adds a non-controller owner. A dependent can have only one controller owner. [[sources/research-owner-references-and-garbage-collection]] See [[examples/controller-runtime-sets-a-controller-reference-so-deleting-the-custom-resource-tears-down-its-children]].

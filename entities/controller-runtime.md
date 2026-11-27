---
title: controller-runtime
type: entity
status: active
created: 2026-11-25
updated: 2026-11-26
sources:
  - id: research-gap-m2-ownership-gc
    hash: 62aafaded9c0
    ingested: 2026-11-26
  - id: research-gap-b1-recheck-flux-k8s
    hash: c78dc9a9635e
    ingested: 2026-11-26
  - id: research-gap-g3-k8s-and-controller-runtime
    hash: 2b4e3378c119
    ingested: 2026-11-26
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
  - id: research-gap-g3-scale-recheck
    hash: d9bd6911bff7
    ingested: 2026-11-26
  - id: research-gap-b1-unverified-claims
    hash: d152f98abb04
    ingested: 2026-11-26
  - id: research-gap-m5-informers-caches
    hash: 1a6a4969c0c2
    ingested: 2026-11-26
aliases: [sigs.k8s.io/controller-runtime]
tags: [tool, controllers, framework]
---

# controller-runtime

controller-runtime is the Kubernetes SIGs library for writing controllers and operators in Go, and it is the code-level home of the level-based contract. [entities/kubebuilder](kubebuilder.md) builds on it. [sources/research-level-triggered-vs-edge-triggered](../sources/research-level-triggered-vs-edge-triggered.md)

## The Reconciler contract

The reconcile package states that "Reconciliation is level-based, meaning action isn't driven off changes in individual Events, but instead is driven by actual cluster state." A `Request` carries only a namespaced name and no event type, so authors cannot write event-specific logic even if they wanted to. Returning a non-nil error requeues the request with exponential backoff, except for a `TerminalError`, which stops retrying. `RequeueAfter` schedules a timed revisit. See [concepts/reconciliation-loop](../concepts/reconciliation-loop.md) and [findings/failure-retry-loops-and-backoff](../findings/failure-retry-loops-and-backoff.md).

## Author guidance from the FAQ

The FAQ recommends one controller per root object type, with other objects mapped to the root through owner or map-function handlers. It tells authors not to branch on create, update, or delete, to reconcile idempotently by reading all needed state and then writing updates, to assume cache reads can be stale, and to test with envtest rather than fake clients. See [findings/event-specific-logic-in-reconcilers](../findings/event-specific-logic-in-reconcilers.md), [findings/stale-cache-and-double-action](../findings/stale-cache-and-double-action.md), and [concepts/idempotency](../concepts/idempotency.md).

## Requeue semantics

A third-party guide summarizes the return values: nil with an empty result means converged, `RequeueAfter` means waiting, and an error means failure with exponential backoff. [sources/research-eventual-consistency-and-convergence](../sources/research-eventual-consistency-and-convergence.md) See [findings/errors-used-as-timers-in-reconcilers](../findings/errors-used-as-timers-in-reconcilers.md). The source-level behavior of `Requeue: true` is in the section "Result, TerminalError, and backoff tuning" below.

## Related

[concepts/level-triggered-vs-edge-triggered](../concepts/level-triggered-vs-edge-triggered.md), [concepts/informers-reflectors-and-workqueues](../concepts/informers-reflectors-and-workqueues.md), [examples/how-core-controllers-handle-cache-lag](../examples/how-core-controllers-handle-cache-lag.md)

## To research

Correction note, 2026-11-26: resync semantics and the cache options are now covered in the section "Cache, resync, and mapper details (m5 dossier)" below. What a running informer does when its CRD is deleted remains open; see [open-knowledge-gaps](../open-knowledge-gaps.md).

## Dynamic RESTMapper

Issue 321 documents that a client's RESTMapper built once at startup could not see CRDs created later. The fix was a dynamic, rate-limited mapper that invalidates on lookup failure, reported as the default since v0.3.0, a claim that should be checked against release notes. [sources/research-gvk-and-gvr](../sources/research-gvk-and-gvr.md) See [findings/stale-restmapper-hides-newly-installed-crds](../findings/stale-restmapper-hides-newly-installed-crds.md), [comparisons/restmapper-strategies-static-deferred-and-dynamic](../comparisons/restmapper-strategies-static-deferred-and-dynamic.md), and [entities/client-go](client-go.md).

## Foundation for Kubebuilder and the Operator SDK

The operator-pattern dossier describes Kubebuilder and the Operator SDK as both built on controller-runtime, which supplies the informer, cache, and workqueue plumbing that the controller guidelines require. [sources/research-operator-pattern](../sources/research-operator-pattern.md) See [entities/operator-sdk](operator-sdk.md) and [concepts/operator-pattern](../concepts/operator-pattern.md).

## Result, TerminalError, and backoff tuning

The reconcile package defines `Request` (name and namespace only), `Result` with a deprecated `Requeue`, `RequeueAfter`, and an optional `Priority`, and `TerminalError`, which is logged and counted but not retried. Backoff is tuned through the controller's `RateLimiter` option. [sources/research-reconciliation-loop](../sources/research-reconciliation-loop.md) See [decisions/choose-error-requeueafter-or-terminalerror-in-a-reconciler](../decisions/choose-error-requeueafter-or-terminalerror-in-a-reconciler.md) and [findings/the-requeue-true-result-is-deprecated-and-described-inconsistently](../findings/the-requeue-true-result-is-deprecated-and-described-inconsistently.md).

At v0.25.3 (published 2026-11-16), `Requeue: true` with a nil error is a rate-limited requeue with per-item exponential backoff that keeps the failure history, while `RequeueAfter > 0` calls `Queue.Forget(req)` and adds the item after exactly that duration. `UsePriorityQueue` defaults to true, and its default limiter is the per-item exponential limiter (5 ms base, 1000 s cap) alone, with no overall bucket. With it disabled the default is client-go's `DefaultTypedControllerRateLimiter`, which adds a 10 qps, 100 burst bucket. The `reconcile_total` metric labels results `error`, `requeue_after`, `requeue`, and `success`. [sources/research-gap-g3-k8s-and-controller-runtime](../sources/research-gap-g3-k8s-and-controller-runtime.md) See [findings/a-requeue-true-result-backs-off-exponentially-because-only-requeueafter-forgets-the-failure-history](../findings/a-requeue-true-result-backs-off-exponentially-because-only-requeueafter-forgets-the-failure-history.md).

Correction note, 2026-11-26: this section previously said that sources disagree on whether `Requeue: true` backs off. The v0.25.3 source settles it, and it does back off.

## Read-your-own-writes design

controller-runtime PR 3473, "Read your own write client design", merged on 2026-10-05, and issue 3320 ("Feature: ReadYourWritesConsistency") was still open on 2026-11-26. Correction 2026-11-26: the v0.25.0 release (2026-09-03) already shipped an experimental, opt-in `ReadYourWritesConsistency` feature, enabled with `Client.EnableReadYourWritesConsistency`, so the earlier statement that no release up to v0.25.3 is confirmed to ship it was wrong ([findings/controller-runtime-v0-25-0-ships-an-experimental-opt-in-read-your-writes-client](../findings/controller-runtime-v0-25-0-ships-an-experimental-opt-in-read-your-writes-client.md), [sources/research-gap-b1-unverified-claims](../sources/research-gap-b1-unverified-claims.md)). [sources/research-gap-g3-k8s-and-controller-runtime](../sources/research-gap-g3-k8s-and-controller-runtime.md) See [examples/controller-runtime-merged-a-read-your-own-write-client-design-in-october-2026-but-no-release-is-confirmed-to-ship-it](../examples/controller-runtime-merged-a-read-your-own-write-client-design-in-october-2026-but-no-release-is-confirmed-to-ship-it.md).

## FAQ guidance on idempotent reconcilers

The controller-runtime FAQ says reconcile functions must be idempotent and must read all the state they need before writing updates, so skipped or coalesced events and restarts are harmless. It recommends deterministic object names so the API server rejects a duplicate create, tracking actions and requeueing when names are generated, and testing with envtest against resulting state and not against which API calls were made. The dossier read the raw GitHub copy because the rendered page was empty. [sources/research-idempotency](../sources/research-idempotency.md) See [examples/built-in-controllers-use-deterministic-names-to-avoid-duplicate-children](../examples/built-in-controllers-use-deterministic-names-to-avoid-duplicate-children.md) and [concepts/idempotency](../concepts/idempotency.md).

## Cache, cache-backed client, and default limiter

The Kubernetes blog describes the cache as an in-memory, watch-fed copy that the manager's cache-backed client reads from, while writes and status updates go to the API server and authoritative reads need an explicit uncached reader. Memory grows with watched objects and there is no eviction. The client-go default workqueue limiter, `DefaultTypedControllerRateLimiter`, takes the maximum of a per-item exponential limiter (5 ms base, 1000 s cap) and a token bucket (10 per second, burst 100) that the source comment says applies only to the overall retry rate, not per item. Correction from the 2026-11-26 recheck: that is the client-go default, not necessarily what a controller-runtime controller uses. In the version read, controller-runtime uses only the exponential limiter when its priority queue is on, which is the default, and `MaxConcurrentReconciles` defaults to 1. [sources/research-gap-g3-scale-recheck](../sources/research-gap-g3-scale-recheck.md) `Owns()` and `Watches()` register informers and event-to-key mappings. [sources/research-informers-reflectors-and-workqueues](../sources/research-informers-reflectors-and-workqueues.md) See [concepts/informers-reflectors-and-workqueues](../concepts/informers-reflectors-and-workqueues.md), [findings/informer-caches-hold-every-watched-object-and-memory-grows-with-cluster-size](../findings/informer-caches-hold-every-watched-object-and-memory-grows-with-cluster-size.md), and [findings/stale-cache-and-double-action](../findings/stale-cache-and-double-action.md).

## Owner reference helpers

`controllerutil.SetControllerReference` writes an owner reference with `controller: true` and `blockOwnerDeletion: true` and enables `Owns()` watches, and `SetOwnerReference` adds a non-controller owner. A dependent can have only one controller owner. [sources/research-owner-references-and-garbage-collection](../sources/research-owner-references-and-garbage-collection.md) See [examples/controller-runtime-sets-a-controller-reference-so-deleting-the-custom-resource-tears-down-its-children](../examples/controller-runtime-sets-a-controller-reference-so-deleting-the-custom-resource-tears-down-its-children.md).

## Requeue history and issue 808

Update 2026-11-26: the `Requeue: true` result has been a rate-limited requeue since at least v0.4.0 (source at v0.4.0, v0.7.0, and v0.15.0 calls `AddRateLimited`), issue 808 never claims it is immediate ([findings/controller-runtime-issue-808-is-a-documentation-request-and-does-not-claim-that-requeue-true-is-immediate](../findings/controller-runtime-issue-808-is-a-documentation-request-and-does-not-claim-that-requeue-true-is-immediate.md)), and the field was deprecated by pull request 3107 on 2025-02-24, with pull request 3574 to document the behavior still open ([examples/controller-runtime-pull-request-3107-deprecated-requeue-true-on-2025-02-24-and-pull-request-3574-to-document-it-is-still-open](../examples/controller-runtime-pull-request-3107-deprecated-requeue-true-on-2025-02-24-and-pull-request-3574-to-document-it-is-still-open.md)). Whether any release ships read-your-writes was not rechecked in this pass. The page moves from draft to active because its Reconciler contract and requeue behavior are now read from source at four tags. [sources/research-gap-b1-recheck-flux-k8s](../sources/research-gap-b1-recheck-flux-k8s.md)

## Adoption and refusal rules in the owner reference helpers

`SetControllerReference` returns an `AlreadyOwnedError` when another controller already controls the object ("Return early with an error if the object is already controlled"), and rejects owner and dependent pairs in different namespaces and cluster-scoped dependents with namespaced owners. A plain operator therefore does not take over a controlled object, and adopting orphans is code the operator writes itself. Orphaning on delete is a client option, either the propagation policy in the request or an operator finalizer. No controller-runtime adoption helper was read, and the in-tree `ControllerRefManager` was not read. Latest release read was v0.25.3. [sources/research-gap-m2-ownership-gc](../sources/research-gap-m2-ownership-gc.md) See [findings/blockownerdeletion-needs-permission-on-the-owner-and-the-failure-mode-is-disputed](../findings/blockownerdeletion-needs-permission-on-the-owner-and-the-failure-mode-is-disputed.md).

## Cache, resync, and mapper details (m5 dossier)

`SyncPeriod` defaults to 10 hours with jitter, "does not sync between the local cache and the server", and emits an artificial Update event with the same object in both positions, so `GenerationChangedPredicate` filters it out ([findings/a-resync-replays-the-informers-local-cache-to-the-handlers-and-never-contacts-the-api-server](../findings/a-resync-replays-the-informers-local-cache-to-the-handlers-and-never-contacts-the-api-server.md)). `cache.Options` offers `ByObject`, namespace and selector defaults, transforms, `DropManagedFields`, `DefaultUnsafeDisableDeepCopy` and `ReaderFailOnMissingInformer`, and `client.Options.Cache.DisableFor` sends listed types to live reads, with unstructured reads uncached by default ([findings/controller-runtime-narrows-its-cache-with-selectors-transforms-metadata-only-informers-and-disable-for-and-each-option-has-a-cost](../findings/controller-runtime-narrows-its-cache-with-selectors-transforms-metadata-only-informers-and-disable-for-and-each-option-has-a-cost.md)). Informers are tracked per GVK in structured, unstructured and metadata maps and mapped to a GVR through the RESTMapper ([findings/controller-runtime-tracks-informers-by-gvk-while-client-go-factories-key-by-go-type-or-gvr](../findings/controller-runtime-tracks-informers-by-gvk-while-client-go-factories-key-by-go-type-or-gvr.md)). The dynamic RESTMapper is the default from v0.3.0 (release notes of 2019-10-10, [findings/the-dynamic-restmapper-is-confirmed-as-the-controller-runtime-default-at-v0-3-0-from-the-release-notes-and-tag-source](../findings/the-dynamic-restmapper-is-confirmed-as-the-controller-runtime-default-at-v0-3-0-from-the-release-notes-and-tag-source.md)). Issues 3303 and 2589 are user reports of stale CRD state ([examples/controller-runtime-issue-3303-a-recreated-crd-with-a-different-scope-was-not-picked-up-by-the-client-or-restmapper](../examples/controller-runtime-issue-3303-a-recreated-crd-with-a-different-scope-was-not-picked-up-by-the-client-or-restmapper.md), [examples/controller-runtime-issue-2589-a-controller-started-before-its-crd-existed-did-not-recover-until-the-cache-sync-timeout](../examples/controller-runtime-issue-2589-a-controller-started-before-its-crd-existed-did-not-recover-until-the-cache-sync-timeout.md)). [sources/research-gap-m5-informers-caches](../sources/research-gap-m5-informers-caches.md)

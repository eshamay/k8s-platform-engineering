---
title: "Research dossier: Kubernetes and controller-runtime gap cluster (staleness mitigation, Mutating Admission Policy, StorageVersionMigration, Requeue backoff)"
type: source
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-g3-k8s-and-controller-runtime
    hash: 2b4e3378c119
    ingested: 2026-11-26
aliases: []
tags: [kubernetes, controller-runtime, staleness, mutating-admission-policy, storage-version-migration, requeue, research-dossier, gap-closing, targeted-pass]
---

# Research dossier: Kubernetes and controller-runtime gap cluster (staleness mitigation, Mutating Admission Policy, StorageVersionMigration, Requeue backoff)

> [!NOTE]
> **Raw file:** `raw/research-gap-g3-k8s-and-controller-runtime.md` (sha256 prefix 2b4e3378c119)<br>
> **Kind:** Verified research dossier for gap cluster g3-k8s-and-controller-runtime, dated 2026-11-26<br>
> **Ingested:** 2026-11-26 as a targeted pass over existing informer, admission, CRD versioning, and reconcile pages<br>
> **Caveat:** Claims are labeled VERIFIED or UNVERIFIED in the dossier. Only VERIFIED claims enter wiki pages as fact, and the UNVERIFIED claims appear only as open questions.

## Summary

The dossier reads primary sources at stated versions: the Kubernetes v1.36 and v1.37 CHANGELOG files, `kube_features.go` at tags v1.36.0 and v1.37.0, KEP 4192 and KEP 5647 metadata, the kubernetes.io blog and docs pages, and the controller-runtime source at tag v0.25.3 (published 2026-11-16, the newest release on the research date). Kubernetes v1.37.3, v1.36.7 and v1.35.11 were the latest patch releases on 2026-11-25.

Three of the four gaps are answered by primary text. MutatingAdmissionPolicy is GA and enabled by default since v1.36, so the "still beta" belief is out of date. StorageVersionMigration is GA in v1.37 and is user-triggered, not automatic. In controller-runtime v0.25.3, `Result{Requeue: true}` is a rate-limited requeue with per-item exponential backoff, which matches the package comment and does not match the "immediate" reading. The staleness gap is largely answered, with naming discrepancies between the v1.36 blog and the CHANGELOG and code.

## Key claims

### Staleness mitigation (KEP 5647)

- The client-go feature gate `AtomicFIFO` makes the informer FIFO process list and relist batches atomically. It is Beta and on by default from 1.36 (tag v1.37.0 `known_features.go`).
- A `Store` gained `LastStoreSyncResourceVersion()`, which can return an empty string before the first sync and depends on `AtomicFIFO` (CHANGELOG-1.36, PR 134827).
- Four kube-controller-manager controllers (DaemonSet, StatefulSet, ReplicaSet, Job) record the resource version of their own writes and skip a sync if the cache has not caught up. Each has a gate named `StaleControllerConsistency<API type>`, Beta, default true from 1.36, and each depends on `AtomicFIFO` (tag v1.36.0 `kube_features.go`). The blog says the changes are "on by default for these controllers".
- A client-go helper, `ConsistencyStore`, has the methods `WroteAt`, `EnsureReady`, and `Clear`, for authors of other informer-based controllers (v1.36 blog).
- When a sync is deferred, the DaemonSet and Job controllers increment `daemonset_controller_stale_sync_skips_total` and `job_controller_stale_sync_skips_total` and log a message (CHANGELOG-1.36, PRs 134937 and 137210). The dossier found no CHANGELOG names for the ReplicaSet and StatefulSet skip metrics.
- The blog calls the skip counter `stale_sync_skips_total` and the gauge `store_resource_version` and labels the skip metric alpha. The code registers the client-go gauge as `informer_store_resource_version` (subsystem `informer`, labels name, group, version, resource, alpha) with the help text "The 15 least significant digits of the resource version of the store."
- Kubernetes v1.37 extends the mitigation to the HorizontalPodAutoscaler controller (`StaleControllerConsistencyHPA`, Beta, default true) and adds `NodeControllerLeaseCircuitBreaker` (Beta, default true). The v1.37 release blog also describes a `BookmarkFunc` callback and an observation-only `MonitorInformerStaleness` mode that polls the apiserver every 5 seconds. The last two appear only in the blog, so their stage and default are not confirmed by code.
- The v1.37 kube-scheduler publishes `informer_store_resource_version`, `informer_queued_items`, and `informer_processing_latency_seconds` (CHANGELOG-1.37, PR 140511).
- KEP 5647 (Stale Controller Handling, author michaelasp, SIG API Machinery) tracks the work. Its `kep.yaml` lists beta as v1.37, while the gate table shows Beta from 1.36, so the KEP metadata lags the gates and the gate table is the better citation for stage.
- The v1.36 blog says the project is working with controller-runtime to give all controller-runtime controllers read-your-own-writes semantics. controller-runtime PR 3473 ("Read your own write client design") merged on 2026-10-05, and issue 3320 ("Feature: ReadYourWritesConsistency") was still open on 2026-11-26.

### Mutating Admission Policy

- The live docs page says "Stable since Kubernetes v1.36; enabled by default", and CHANGELOG-1.36 says "Promoted the `MutatingAdmissionPolicy` to GA (v1) in Kubernetes `v1.36`. The feature is now enabled by default." (PR 136039).
- The gate history at tag v1.36.0 is Alpha 1.32 (off), Beta 1.34 (off), and GA 1.36 (on).
- The docs page also says "It was first available in the v1.30 release", which conflicts with the gate table. The dossier did not resolve the conflict.
- Kubernetes v1.37 makes manifest-based admission control Beta, which is an adjacent feature and not the MAP stage.

### StorageVersionMigration

- The `storagemigration.k8s.io/v1` API and the `StorageVersionMigrator` controller in kube-controller-manager are GA and enabled by default in v1.37 (GA blog dated 2026-08-31, release blog 2026-08-26, CHANGELOG-1.37 PR 138560). KEP 4192 gives alpha v1.30, beta v1.35, and stable v1.37, and the gate was Beta with default false at v1.36.0.
- At v1.37.0 the type is cluster-scoped with a status subresource. `spec.resource` is an immutable `GroupResource`, `status.conditions` has the types Running, Succeeded, and Failed, and `status.resourceVersion` is set when kube-controller-manager first observes the object.
- Migration is not triggered automatically. KEP 4192 says the creation of the migration object "will be deferred to the user", and the GA blog says "Initiating a storage version migration is as simple as creating a declarative StorageVersionMigration object". The out-of-tree trigger controller, which discovered resources every 10 minutes, was not moved in-tree.
- After a successful CRD migration, `.status.storedVersions` should contain only the preferred version, and otherwise the migration should be retried. The task page says migration needs an integer resource version and fails for resources such as aggregated APIs.
- CHANGELOG-1.37 records progress reporting in conditions (PR 138875), merge patch in place of server-side apply (PR 138874), and a kube-controller-manager panic fix when the target resource is missing from the RESTMapper (PR 140586). The KEP lists the metrics `storage_migrator_core_migrator_migrated_objects_total`, `..._remaining_objects_total`, and `..._migrations_total`.
- The kubernetes.io task page header still reads "Beta since Kubernetes v1.35; disabled by default" while its body says the gate and API are enabled by default, so the header is stale and should not be cited for stage.

### Requeue backoff in controller-runtime v0.25.3

- `Result.Requeue` is documented as "perform a ratelimited requeue using the workqueues ratelimiter" and is marked "Deprecated: Use `RequeueAfter` instead." The Reconciler docs say the request "will be requeued using exponential backoff."
- The handler code (`pkg/internal/controller/controller.go`) requeues rate-limited for `result.Requeue`, increments the `requeue` result label, and does not reset the per-item failure counter.
- `RequeueAfter` takes precedence over `Requeue`, calls `c.Queue.Forget(req)` first, and then adds the item after exactly the given duration.
- A non-nil error requeues rate-limited and ignores both fields, logging a warning if either is set, except `TerminalError`, which is not requeued.
- `UsePriorityQueue` defaults to true. With it the default limiter is the per-item exponential limiter (5 ms base, 1000 s cap) alone. With it disabled the default is client-go's `DefaultTypedControllerRateLimiter`, the maximum of that limiter and a 10 qps, 100 burst bucket (read from client-go master, not a pinned tag). In the priority queue the smaller of the rate-limit delay and an explicit `After` wins.
- The `reconcile_total` metric carries result labels `error`, `requeue_after`, `requeue`, and `success`.
- Issue 808 ("Document ways to trigger/not trigger exponential backoff") is still open. Its body says it is unclear what forces a requeue with or without backoff and does not say that `Requeue: true` is immediate. The comment thread was not read, so the origin of the "immediate" claim is not located.

## Open questions left by the dossier

- Whether any controller-runtime release up to v0.25.3 ships read-your-writes behavior (not checked beyond the PR title).
- The skip-counter metric names for the ReplicaSet and StatefulSet controllers.
- The stage and default of `MonitorInformerStaleness` and `BookmarkFunc`, which are not in the v1.37 gate table or CHANGELOG.
- The exact field shape of the StorageVersionMigration progress-reporting conditions.
- The comment thread of controller-runtime issue 808 and the docs history behind the "first available in v1.30" line for Mutating Admission Policy.
- The text of KEP 5647 itself, which was not read.

## Pages updated from this source

[findings/stale-cache-and-double-action](../findings/stale-cache-and-double-action.md), [concepts/informers-reflectors-and-workqueues](../concepts/informers-reflectors-and-workqueues.md), [entities/controller-runtime](../entities/controller-runtime.md), [entities/client-go](../entities/client-go.md), [examples/how-core-controllers-handle-cache-lag](../examples/how-core-controllers-handle-cache-lag.md), [findings/the-requeue-true-result-is-deprecated-and-described-inconsistently](../findings/the-requeue-true-result-is-deprecated-and-described-inconsistently.md), [decisions/choose-error-requeueafter-or-terminalerror-in-a-reconciler](../decisions/choose-error-requeueafter-or-terminalerror-in-a-reconciler.md), [concepts/reconciliation-loop](../concepts/reconciliation-loop.md), [findings/errors-used-as-timers-in-reconcilers](../findings/errors-used-as-timers-in-reconcilers.md), [comparisons/admission-mechanisms-webhooks-vap-map-and-crd-rules](../comparisons/admission-mechanisms-webhooks-vap-map-and-crd-rules.md), [concepts/admission-webhooks-and-cel](../concepts/admission-webhooks-and-cel.md), [concepts/crd-versioning-and-storage-migration](../concepts/crd-versioning-and-storage-migration.md), [concepts/custom-resource-definition](../concepts/custom-resource-definition.md), and [findings/crd-version-removal-without-migration-strands-stored-objects](../findings/crd-version-removal-without-migration-strands-stored-objects.md).

## Pages created from this source

[examples/kubernetes-v1-36-daemonset-statefulset-replicaset-and-job-controllers-skip-a-sync-until-the-cache-catches-up-with-their-own-write](../examples/kubernetes-v1-36-daemonset-statefulset-replicaset-and-job-controllers-skip-a-sync-until-the-cache-catches-up-with-their-own-write.md), [examples/controller-runtime-merged-a-read-your-own-write-client-design-in-october-2026-but-no-release-is-confirmed-to-ship-it](../examples/controller-runtime-merged-a-read-your-own-write-client-design-in-october-2026-but-no-release-is-confirmed-to-ship-it.md), [examples/a-user-created-storageversionmigration-object-rewrites-stored-objects-so-a-crd-can-retire-an-old-version](../examples/a-user-created-storageversionmigration-object-rewrites-stored-objects-so-a-crd-can-retire-an-old-version.md), [findings/the-kubernetes-v1-36-staleness-blog-names-metrics-differently-from-the-changelog-and-source](../findings/the-kubernetes-v1-36-staleness-blog-names-metrics-differently-from-the-changelog-and-source.md), [findings/kubernetes-docs-pages-disagree-with-the-code-on-mutating-admission-policy-and-storage-version-migration-stage](../findings/kubernetes-docs-pages-disagree-with-the-code-on-mutating-admission-policy-and-storage-version-migration-stage.md), [findings/a-requeue-true-result-backs-off-exponentially-because-only-requeueafter-forgets-the-failure-history](../findings/a-requeue-true-result-backs-off-exponentially-because-only-requeueafter-forgets-the-failure-history.md), and [findings/storage-version-migration-is-not-triggered-automatically-so-a-retired-crd-version-needs-a-user-created-object](../findings/storage-version-migration-is-not-triggered-automatically-so-a-retired-crd-version-needs-a-user-created-object.md).

---
title: "Research dossier: recheck of kro and Crossplane gaps (b1-recheck-kro-crossplane)"
type: source
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-b1-recheck-kro-crossplane
    hash: ccee0efa5bdd
    ingested: 2026-11-26
aliases: []
tags: [kro, crossplane, research-dossier, gap-closing, targeted-pass, verification, source-code]
---

# Research dossier: recheck of kro and Crossplane gaps (b1-recheck-kro-crossplane)

> [!NOTE]
> **Raw file:** `raw/research-gap-b1-recheck-kro-crossplane.md` (sha256 prefix ccee0efa5bdd)<br>
> **Kind:** Verified research dossier for gap cluster b1-recheck-kro-crossplane, dated 2026-11-26<br>
> **Ingested:** 2026-11-26 as a targeted pass over the kro and Crossplane pages that rested on documentation alone<br>
> **Caveat:** The evidence is Go source, release notes, and GitHub issue and pull request text read through `gh api`. No cluster was run, so issue 7453 was not reproduced, and the dossier ran no independent scale benchmark.

## Summary

The dossier rechecked five gaps by reading source instead of documentation pages. For kro it read `cmd/controller/main.go`, `dynamic_controller.go`, the instance controller, and the API types at v0.9.4 and v0.10.0 (v0.10.0 was published 2026-11-10). It settles that the rate-limiter and tuning defaults are identical across both tags except for four flags that v0.10.0 adds, that instance requeue became a per-instance capped exponential backoff in v0.10.0, that the four built-in instance conditions are Go constants, and that the `FAILED` instance state is a deprecated legacy constant that v0.10.0 no longer defines.

For Crossplane it read v2.5.0 (released 2026-11-24). It settles how a function's per-resource ready signal becomes the composite resource `Ready` condition, shows that open pull request 8080 fixes stale XR condition replay and not asynchronous `Synced` signaling, records the server-side apply field owners in the v2.5.0 source, and records v2.5.0 scaling defaults that differ from the v2.1.0 release notes. It could not reproduce issue 7453 and does not say whether it is a real bug.

## Key claims

- The newest kro release is v0.10.0 (2026-11-10), preceded by v0.10.0-rc.0 (2026-09-22) and v0.9.4 (2026-09-04). VERIFIED. https://api.github.com/repos/kubernetes-sigs/kro/releases
- At v0.9.4 and v0.10.0 these `cmd/controller/main.go` defaults are identical: 1 dynamic-controller worker, rate-limiter min delay 200 ms and max delay 1000 s, rate limit 10 and burst limit 100, instance requeue interval 3 s, resync 36000 s, 20 queue retries, client QPS 100 and burst 150, RGD progress requeue delay 3 s. VERIFIED. https://github.com/kubernetes-sigs/kro/blob/v0.9.4/cmd/controller/main.go
- v0.10.0 adds `watch-sync-timeout` 30 s, `graph-concurrent-reconciles` 1, `apply-concurrency` 20, and `cel-cost-limit` 0 (disabled). VERIFIED. https://github.com/kubernetes-sigs/kro/blob/v0.10.0/cmd/controller/main.go
- The flags `rgd-max-collection-size` (1000) and `rgd-max-collection-dimension-size` (10) exist in `main.go` at both tags, so the collection limit is confirmed as a flag default. VERIFIED.
- The dynamic controller queue is a `MaxOf` rate limiter combining a per-item exponential failure limiter with a token bucket, identical at both tags. VERIFIED. https://github.com/kubernetes-sigs/kro/blob/v0.10.0/pkg/dynamiccontroller/dynamic_controller.go
- v0.10.0 has a `pkg/controller/backoff` package with factor 2 and a five-minute cap, seeded from the instance requeue interval, and a clean reconcile resets it. VERIFIED. https://github.com/kubernetes-sigs/kro/blob/v0.10.0/pkg/controller/backoff/backoff.go
- The v0.9.4 tree has no backoff package, so its instance requeue is the fixed interval. The absence of the package is VERIFIED and the fixed-delay behavior is an inference from that plus the flag help text. The help text still says "Fixed delay" at v0.10.0, so it is stale there.
- The built-in instance conditions are `Ready`, `InstanceManaged`, `GraphResolved`, and `ResourcesReady`, with `Ready` the root built by `apis.NewReadyConditions(InstanceManaged, GraphResolved, ResourcesReady)`, and the same line exists at v0.9.4. RGD conditions are root `Ready` with `GraphRevisionsResolved`, `GraphAccepted`, `KindReady`, and `ControllerReady`. VERIFIED. https://github.com/kubernetes-sigs/kro/blob/v0.10.0/api/v1alpha1/conditions.go
- v0.10.0 defines instance states IN_PROGRESS, ACTIVE, DELETING, and ERROR. v0.9.4 also defines FAILED, with the comment "Deprecated: InstanceStateFailed is a legacy state kept for compatibility." VERIFIED. https://github.com/kubernetes-sigs/kro/blob/v0.10.0/api/v1alpha1/instance_state.go
- That v0.9.4 never sets `InstanceStateFailed` is UNVERIFIED beyond three grepped files (`controller.go`, `status.go`, `deletion.go`), because repository-wide code search was rate limited.
- kro validates author conditions at build time: `runtime.newCondition` status must be True, False, or Unknown, the type must be non-empty, declared types must be unique, and `runtime.condition(schema, ...)` must name a built-in type. VERIFIED. https://github.com/kubernetes-sigs/kro/blob/v0.10.0/pkg/graph/conditions.go
- In Crossplane v2.5.0 a composed resource counts as ready only when the function returns `READY_TRUE` (`Ready: dr.GetReady() == fnv1.Ready_READY_TRUE`), so `READY_FALSE` and `READY_UNSPECIFIED` both count as not ready. VERIFIED. https://github.com/crossplane/crossplane/blob/v2.5.0/internal/controller/apiextensions/composite/composition_functions.go
- The XR `Ready` condition is `Available` when no composed resource is unready and `Creating` with the message "Unready resources: ..." otherwise. An explicit XR-level ready from the function supersedes the derived value, and a deleting XR is `Deleting`. `Synced` is `ReconcileSuccess` unless a composed resource is unsynced, which gives `ReconcileError` with "Unsynced resources: ...". VERIFIED. https://github.com/crossplane/crossplane/blob/v2.5.0/internal/controller/apiextensions/composite/reconciler.go
- `function-auto-ready` honors explicit readiness first and otherwise marks a resource ready when its observed `Ready` condition is True. VERIFIED. https://github.com/crossplane-contrib/function-auto-ready/blob/main/fn.go
- Pull request 8080 ("fix(composite): stop stale XR condition replay", opened 2026-11-20, updated 2026-11-23) is open and unmerged, with review decision REVIEW_REQUIRED. It says `Fixes #7062` and `Fixes #8033`, both XR-level stale-cache condition replays, and it does not target the asynchronous managed-resource `Synced` signaling of provider-aws issue 2287. VERIFIED. https://github.com/crossplane/crossplane/pull/8080
- The v2.5.0 source still has the two-write pattern (a `Status().Patch` in `composition_functions.go` and a `Status().Update` in `reconciler.go`), so pull request 8080 is not in v2.5.0. VERIFIED by source structure.
- v2.5.0 applies resource references and status with `client.Apply` and `ForceOwnership` under the field owner `apiextensions.crossplane.io/composite`, and composed resources use per-XR owners prefixed `apiextensions.crossplane.io/composed`. A `TODO(adamwg)` says to stop using `client.Apply` after v2.2, and it is still present on main. VERIFIED. https://github.com/crossplane/crossplane/blob/v2.5.0/internal/controller/apiextensions/composite/composition_functions.go
- Issue 7453 (v2.3.1, function-go-templating) is open with labels `bug` and `stale`. The only maintainer comment (2026-08-27) says it could not be reproduced and that `kubectl get -o yaml` hides `managedFields`. Pull requests 7783 and 7787 are open, unmerged, and both say `FromStruct()` replaces the XR object and loses `managedFields`. VERIFIED as state. Whether the bug is real is UNVERIFIED, and reading the status-apply source did not explain the reported loss of `spec.externalRef`. https://github.com/crossplane/crossplane/issues/7453
- v2.5.0 defaults are poll interval 1 m, sync interval 1 h, `MaxConcurrentReconciles` 100 (`--max-reconcile-rate` is an alias, "worker pool size"), and an XR circuit breaker with burst 100, refill 1.0 per second, and cooldown 5 m. The v2.1.0 release notes described 50 burst and one per 2 s. VERIFIED. https://github.com/crossplane/crossplane/blob/v2.5.0/cmd/crossplane/core/core.go
- v2.1.0 renamed `--max-reconcile-rate` to `--max-concurrent-reconciles`, yet the v2.5 pods guide still describes `--max-reconcile-rate` as "the rate, in times per second, Crossplane reconciles resources". VERIFIED. https://github.com/crossplane/docs/blob/master/content/v2.5/guides/pods.md
- v2.3.0 adds the per-resource `crossplane.io/poll-interval` annotation and an XRD scale subresource, and v2.4.0 starts safe-start provider runtimes at zero replicas until a ManagedResourceDefinition is active. The MRD docs cite about 3 MiB of API server memory per CRD and 300 MiB or more for large providers. VERIFIED.
- The v2.5 Scalable Composition guide covers the Kubernetes `scale` subresource on XRs and gives no controller capacity numbers. VERIFIED.
- Numeric limits for XRs or composed resources per Crossplane controller, and independent benchmarks of Crossplane v2 scale, are UNVERIFIED. Nothing was found in the pods guide, the v2.1 to v2.5 release notes, or the docs tree.
- Asynchronous `Synced` behavior for managed resources (provider-aws 2287, upjet) was not rechecked, so the earlier finding stands. UNVERIFIED in this pass.

## Not found

- A reproduction of issue 7453, a maintainer closing note for it, and any code path in v2.5.0 that clears `managedFields` (not every write path was traced, including the finalizer update and claim propagation).
- A design one-pager for the XR circuit breaker, and the release in which its default moved from 50 burst to 100.
- A repository-wide search for use of `InstanceStateFailed` in kro v0.9.4.

## Unreadable sources

- The rendered Crossplane pods guide at docs.crossplane.io returned an empty body, so the dossier read the same page from the crossplane/docs repository. GitHub code search was rate limited.

## Relation to earlier dossiers

[[sources/research-gap-g3-kro]] and [[sources/research-gap-g3-crossplane-v2]] supplied the documentation-level baselines that this dossier confirms from source. [[sources/research-gap-b1-unverified-claims]] re-confirmed the state of issue 7453 on the same day, and nothing here conflicts with it.

## Pages updated from this source

[[entities/kro]], [[entities/crossplane]], [[findings/the-kro-docs-disagree-on-whether-an-instance-state-of-failed-exists]], [[findings/kro-reserves-the-right-to-change-instance-sub-conditions-so-only-ready-is-a-stable-contract]], [[examples/kro-shared-queue-tunes-throughput]], [[examples/kro-rgd-authors-define-instance-conditions-with-cel-and-readywhen]], [[comparisons/retry-and-backoff-controls-across-tools]], [[comparisons/concurrency-and-cache-memory-controls-across-flux-argo-cd-and-crossplane]], [[comparisons/crossplane-composition-functions-versus-kro-resource-graph-execution-models]], [[examples/crossplane-xr-spec-pins-composition-and-status-reports-synced-and-ready]], [[examples/crossplane-issue-7453-reports-an-external-ssa-writer-losing-a-field-on-a-composite-resource]], [[findings/managedfields-are-hidden-from-kubectl-output-by-default]], [[findings/upjet-and-crossplane-runtime-source-still-reports-reconcilesuccess-while-an-async-operation-runs]], [[examples/crossplane-max-reconcile-rate-turns-reconcile-rate-into-an-api-call-budget]], [[findings/crossplane-poll-interval-defaults-differ-by-layer-with-one-minute-in-core-and-runtime-and-ten-minutes-in-upjet-providers]], [[concepts/scale-and-sharding]], [[examples/crossplane-v2-4-and-v2-5-cut-memory-on-clusters-with-hundreds-to-two-thousand-crds]], [[examples/a-scalable-composition-lets-hpa-and-keda-drive-an-xr-through-the-scale-subresource]], [[decisions/split-a-large-provider-into-families-or-filter-or-lazy-load-its-crds]].

## Pages created from this source

[[findings/kro-v0-10-0-requeues-an-unready-instance-with-per-instance-exponential-backoff-capped-at-five-minutes-while-v0-9-4-has-no-backoff-package]], [[findings/kro-validates-author-defined-conditions-at-build-time-so-a-bad-status-or-a-duplicate-type-is-rejected-before-an-instance-exists]], [[findings/a-crossplane-composed-resource-counts-as-ready-only-when-the-function-sets-ready-true-so-unspecified-readiness-leaves-the-xr-creating]], [[findings/crossplane-v2-5-0-writes-xr-status-twice-so-a-lagging-cache-can-replay-old-conditions]], [[findings/the-crossplane-v2-5-docs-describe-max-reconcile-rate-as-a-rate-but-source-treats-it-as-a-worker-pool-size-alias]], [[findings/the-crossplane-xr-circuit-breaker-default-is-burst-100-in-v2-5-0-source-while-the-v2-1-0-notes-say-burst-50]], [[examples/crossplane-pull-request-8080-guards-the-xr-status-write-with-a-resource-version-to-stop-stale-condition-replay]], [[examples/crossplane-pull-requests-7783-and-7787-say-fromstruct-drops-managedfields-on-the-composite-resource]].

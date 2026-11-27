---
title: "Research dossier: informer and cache gaps (m5-informers-caches)"
type: source
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-m5-informers-caches
    hash: 1a6a4969c0c2
    ingested: 2026-11-26
aliases: []
tags: [informers, resync, cache, controller-runtime, client-go, gvk, gvr, restmapper, research-dossier, gap-closing, targeted-pass]
---

# Research dossier: informer and cache gaps (m5-informers-caches)

> [!NOTE]
> **Raw file:** `raw/research-gap-m5-informers-caches.md` (sha256 prefix 1a6a4969c0c2)<br>
> **Kind:** Verified research dossier for gap cluster m5-informers-caches, dated 2026-11-26<br>
> **Ingested:** 2026-11-26 as a targeted pass over the informer, cache, resync, GVK and GVR pages<br>
> **Caveat:** Source files were read on default branches (main or master) on 2026-11-26, not pinned to release tags, except the controller-runtime v0.3.0 tag. Field names and defaults may differ in older releases. No memory figures were measured for any option or tool.

## Summary

The dossier answers eight open gaps from client-go, controller-runtime, Kubernetes community documents, a KEP, and the source of Flux, Crossplane, kro, Config Connector, ACK, Cluster API and Argo CD. Its main results are the following.

A resync replays objects from the informer's local store to the handlers as update events and does not contact the API server. controller-runtime's `SyncPeriod` is built on that, defaults to 10 hours with jitter, and its own documentation says it "does not sync between the local cache and the server". The word "resync" names different mechanisms in different tools, because ACK's resync is a `RequeueAfter` on a successful reconcile and kro's flag text calls its resync a re-list.

"Level driven, not edge driven." is the third guideline in the Controller Writing Guide at `contributors/devel/sig-api-machinery/controllers.md` in kubernetes/community. The design-principle form ("Edge-triggered behavior must be just an optimization") is in the archived design proposals, and Tim Hockin's June 2017 slides are a primary talk. The Joe Beda quotation reaches the wiki only through a 2018 Hacker Noon post and stays secondary.

controller-runtime offers per-type selectors, namespace scoping, transforms, managed-field dropping, metadata-only informers, and a client-side `DisableFor` list. Flux controllers each run their own manager with a watch label selector and keep Secrets and ConfigMaps out of the cache unless a feature gate is on. Crossplane core strips CRD schemas from one cache and disables caching Secrets. kro holds one metadata-only informer per GVR. Config Connector caches only its own configuration kinds by default. ACK scopes by namespace and label selector. Cluster API caches only cluster-labelled Secrets and gives each workload cluster its own cache.

controller-runtime keys informers by GVK and maps to a GVR through the RESTMapper, client-go's typed factory keys by Go type, and its dynamic and metadata factories key by GVR. Argo CD, ACK and Config Connector key by group and kind with no version, and Cluster API resolves the version from CRD contract labels. The v0.3.0 release notes list the `DynamicRESTMapper`, and the v0.3.0 manager source shows it as the default. KEP-3352 gives the aggregated discovery rationale.

## Key claims

- A resync delivers "an update notification for every object in the informer's local cache" and adds "no interactions with the authoritative storage". VERIFIED. https://github.com/kubernetes/client-go/blob/master/tools/cache/shared_informer.go
- `DeltaFIFO.Resync` re-queues keys from its known-objects store as Sync deltas, and the reflector calls `store.Resync()` when `ShouldResync` allows. VERIFIED. https://github.com/kubernetes/client-go/blob/master/tools/cache/delta_fifo.go
- `HasSynced` concerns the initial full LIST and is "unrelated to resync". A zero resync period means no resync at all. VERIFIED. Same shared_informer.go file.
- controller-runtime `SyncPeriod` defaults to 10 hours, "does not sync between the local cache and the server", emits an artificial Update event with the same object in both `ObjectOld` and `ObjectNew`, and the guidance is to return `RequeueAfter` instead of shortening it. VERIFIED. https://github.com/kubernetes-sigs/controller-runtime/blob/main/pkg/cache/cache.go (latest release tag read was v0.25.3)
- kro's flag help calls its 36000 second resync an interval at which the controller will "re list resources even with no changes", while the mechanism is the metadata informer's resync argument. VERIFIED for the flag text. https://github.com/kubernetes-sigs/kro/blob/main/cmd/controller/main.go
- ACK's per-resource "resync" is `requeue.NeededAfter(nil, r.resyncPeriod)` with `defaultResyncPeriod = 10 * time.Hour`, so it is a requeue and not an informer resync. VERIFIED. https://github.com/aws-controllers-k8s/runtime/blob/main/pkg/runtime/reconciler.go
- The Controller Writing Guide contains "Level driven, not edge driven." as guideline 3, says "you can't count on having seen it turn from `false` to `true`, only that you now observe it being `true`", and says to record the last decision in the object's status. VERIFIED. https://github.com/kubernetes/community/blob/main/contributors/devel/sig-api-machinery/controllers.md
- The file history on the old path begins 2016-11-30 ("imported docs/devel as a subtree") and the file moved to sig-api-machinery on 2019-01-23. VERIFIED. The design principles say "Edge-triggered behavior must be just an optimization" (first commit on that file 2017-09-06). VERIFIED. https://github.com/kubernetes/design-proposals-archive/blob/main/architecture/principles.md
- Tim Hockin's deck of 2017-06-02 says "State is more useful than events". VERIFIED. https://speakerdeck.com/thockin/edge-vs-level-triggered-logic
- The Joe Beda quotation from Cloud Native Infrastructure is quoted by a Hacker Noon post of 2018-01-23. SECONDARY-ONLY. https://hackernoon.com/level-triggering-and-reconciliation-in-kubernetes-1f17fe30333d
- controller-runtime `cache.Options` provides `ByObject`, `DefaultNamespaces`, `DefaultLabelSelector`, `DefaultFieldSelector`, `DefaultTransform`, `DefaultDropManagedFields`, `DefaultUnsafeDisableDeepCopy`, `ReaderFailOnMissingInformer` and `SyncPeriod`, with precedence ByObject, then `DefaultNamespaces[ns]`, then `Default*`. VERIFIED. cache.go above.
- `TransformStripManagedFields` "can lead to a significant reduction in memory usage" (a documentation statement, not a measurement), `DropManagedFields` should not be enabled if you read managed fields from cached objects, and `client.Options.Cache.DisableFor` forces a live lookup for the listed types. VERIFIED. cache.go and https://github.com/kubernetes-sigs/controller-runtime/blob/main/pkg/client/client.go
- Memory cost measurements for the cache options are UNVERIFIED.
- Flux kustomize-, helm- and source-controller each build their own manager, narrow the cache with `ByObject` `Label: watchSelector`, and append Secret and ConfigMap to `DisableFor` unless a feature gate is on, which costs "increased memory usage and cluster-wide RBAC permissions (list and watch)". VERIFIED. https://github.com/fluxcd/kustomize-controller/blob/main/main.go and https://github.com/fluxcd/pkg/blob/main/runtime/controller/features.go
- An explicit statement that Flux controllers do not share informer caches was not found, and the claim is inferred from each `main.go` building its own manager. UNVERIFIED as a statement.
- Flux docs say extra replicas "are failover standbys. Only the elected leader reconciles", and sharding uses a unique label selector per controller instance. VERIFIED. https://fluxcd.io/flux/installation/configuration/sharding/
- Crossplane core strips OpenAPI schemas from typed CRDs in one cache, disables caching Secrets, and defaults max concurrent reconciles to 100. Crossplane docs give a one-minute poll interval and a one-hour sync interval. VERIFIED. https://github.com/crossplane/crossplane/blob/main/cmd/crossplane/core/core.go and https://github.com/crossplane/docs/blob/master/content/master/guides/pods.md
- A current Crossplane performance or sharding guide was not found. UNVERIFIED. An Upbound knowledge-base article says a provider restart requeues all managed resources at once. SECONDARY-ONLY. https://help.upbound.io/articles/9922842107-understanding-gcp-provider-reconcile-rates-and-api-call-volume
- kro's watch manager "owns the lifecycle of one shared informer per GVR" and its informers are metadata-only so "memory stays bounded". kro defaults are resync 36000 s, rate limiter 10 per second with burst 100, client QPS 100 and burst 150, with an optional warmup before leader election. VERIFIED. https://github.com/kubernetes-sigs/kro/blob/main/pkg/watch/manager.go
- Config Connector caches only its own ConfigConnector and ConfigConnectorContext objects by default and disables caching for Namespace, Secret, ConfigMap and IAM kinds. Its client uses QPS 20 and burst 30. VERIFIED. https://github.com/GoogleCloudPlatform/k8s-config-connector/blob/master/pkg/controller/kccmanager/nocache/clientbuilder.go
- ACK service controllers set cache namespaces and a label selector from flags, default to one concurrent reconcile per resource, and trigger on generation changes only unless ignore-field-drift is on. VERIFIED. https://github.com/aws-controllers-k8s/runtime/blob/main/pkg/runtime/reconciler.go
- Cluster API caches only Secrets with the cluster-name label, sets sync-period to 10 minutes, kube-api QPS 100 and burst 200, and gives workload clusters a ClusterCache that strips managed fields with its own QPS 20 and burst 30. VERIFIED. https://github.com/kubernetes-sigs/cluster-api/blob/main/core/setup/setup.go
- Production memory figures for these four tools, and Backstage cache behavior, are UNVERIFIED.
- controller-runtime tracks informers by GVK in Structured, Unstructured and Metadata maps and maps to a GVR through the RESTMapper when it builds the ListWatch. client-go's typed factory keys by `reflect.Type` and its dynamic factory keys by `schema.GroupVersionResource`. VERIFIED. https://github.com/kubernetes-sigs/controller-runtime/blob/main/pkg/cache/internal/informers.go
- controller-runtime issue 3303 (closed 2026-05-14) reports that a recreated CRD with a changed scope under the same GVK is not picked up by the client or RESTMapper, and issue 2589 (closed 2024-04-22) reports that a controller started before its CRD existed did not recover until the cache sync timeout. SECONDARY-ONLY, as user reports. https://github.com/kubernetes-sigs/controller-runtime/issues/3303 and https://github.com/kubernetes-sigs/controller-runtime/issues/2589
- What a running informer does when its CRD is deleted or its served versions change is UNVERIFIED.
- The v0.3.0 release notes (2019-10-10) list "DynamicRESTMapper that reloads on REST cache miss (#554)", PR 554 rate limits the reload with a token bucket, and the v0.3.0 tag's `manager.go` returns `apiutil.NewDynamicRESTMapper(c)` as the default. VERIFIED. https://github.com/kubernetes-sigs/controller-runtime/releases/tag/v0.3.0
- PR 2296, "Use and provide a single dynamic rest mapper", merged 2023-05-04, and the current mapper holds a `discovery.AggregatedDiscoveryInterface` client. VERIFIED. https://github.com/kubernetes-sigs/controller-runtime/pull/2296
- KEP-3352 says per-group-version discovery "causes a storm of requests for clusters and is a source of latency and throttling", cites kubectl's 6-hour discovery cache as a freshness trade-off, and moved alpha v1.26, beta v1.27, stable v1.30. VERIFIED. https://github.com/kubernetes/enhancements/blob/master/keps/sig-api-machinery/3352-aggregated-discovery/README.md
- Which controller-runtime release adopted aggregated discovery is UNVERIFIED.
- Argo CD's tracking annotation carries group, kind, namespace and name with no version, the gitops-engine `ResourceKey` has exactly those four fields, the cluster cache indexes by GroupKind and watches preferred versions, and live objects are converted to the target manifest's version for comparison. VERIFIED. https://github.com/argoproj/argo-cd/blob/master/docs/user-guide/resource_tracking.md and https://github.com/argoproj/gitops-engine/blob/master/pkg/cache/cluster.go
- Config Connector registers one controller per CRD group and kind with the version taken from the CRD, ACK keys resource manager factories by `GroupKind` string, and Cluster API references carry `apiGroup` and `kind` with the version resolved from CRD contract labels. VERIFIED. https://github.com/aws-controllers-k8s/runtime/blob/main/pkg/runtime/service_controller.go and https://github.com/kubernetes-sigs/cluster-api/blob/main/internal/contract/version.go
- How these tools behave when a served CRD version is removed is UNVERIFIED.

## Not found or unread

- The guessed Crossplane performance URL returned an empty body, and the crossplane/docs tree has no performance guide.
- Cloud Native Infrastructure was not read, so the Beda attribution rests on the Hacker Noon post.
- The controller-runtime cache blog named in the original gap was not re-fetched, because the package source answers the question directly.
- The exact first use of the phrase "Level driven, not edge driven" in the guide was not established beyond the old-path history.

## Pages updated from this source

[concepts/informers-reflectors-and-workqueues](../concepts/informers-reflectors-and-workqueues.md), [concepts/level-triggered-vs-edge-triggered](../concepts/level-triggered-vs-edge-triggered.md), [concepts/gvk-and-gvr](../concepts/gvk-and-gvr.md), [concepts/api-discovery-and-restmapper](../concepts/api-discovery-and-restmapper.md), [comparisons/concurrency-and-cache-memory-controls-across-flux-argo-cd-and-crossplane](../comparisons/concurrency-and-cache-memory-controls-across-flux-argo-cd-and-crossplane.md), [comparisons/gvk-versus-gvr](../comparisons/gvk-versus-gvr.md), [comparisons/restmapper-strategies-static-deferred-and-dynamic](../comparisons/restmapper-strategies-static-deferred-and-dynamic.md), [decisions/keep-informer-resync-disabled-or-set-a-periodic-resync](../decisions/keep-informer-resync-disabled-or-set-a-periodic-resync.md), [entities/controller-runtime](../entities/controller-runtime.md), [entities/client-go](../entities/client-go.md), [entities/kro](../entities/kro.md), [entities/ack](../entities/ack.md), [entities/config-connector](../entities/config-connector.md), [entities/cluster-api](../entities/cluster-api.md), [entities/flux](../entities/flux.md), [entities/crossplane](../entities/crossplane.md), [entities/argo-cd](../entities/argo-cd.md), and the findings and examples that cite this page.

---
title: "Research dossier: Informers, Reflectors, and Workqueues"
type: source
status: active
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-informers-reflectors-and-workqueues
    hash: f9de5ca73ab6
    ingested: 2026-11-25
aliases: []
tags: [informers, reflectors, workqueue, client-go, controller-runtime, scale, research-dossier]
---

# Research dossier: Informers, Reflectors, and Workqueues

> [!NOTE]
> **Raw file:** `raw/research-informers-reflectors-and-workqueues.md` (sha256 prefix f9de5ca73ab6)<br>
> **Kind:** Research dossier summarizing 14 web pages, dated 2026-11-25<br>
> **Ingested:** 2026-11-25<br>
> **Caveat:** Pages were read through a model-condensed fetch. The Kubernetes controller page, the API concepts page, and the controller-runtime cache blog were read only through their first 100,000 characters, so later sections such as cache mitigations may be missing. Default numbers (limiter rate and burst, processor counts) come from condensed extraction and should be checked against current code before they are quoted as fact. Three further pages surfaced in search were not read.

## Summary

The dossier explains the layered caching machinery in client-go that lets a controller avoid asking the API server for every object on every loop. A Reflector performs an initial LIST to get a consistent snapshot and then opens a WATCH. Changes flow into a DeltaFIFO queue. The informer loop pops deltas, updates a thread-safe Indexer that serves as the local cache, and calls registered event handlers. Controllers read through read-only Listers that hit the local cache.

The workqueue is the last stage. Handlers do almost nothing except compute a key, usually `namespace/name`, and add it to a rate-limited queue. Workers then pull a key, read the current object from the cache, and reconcile. The queue deduplicates repeated events for one key, never processes one key concurrently, and retries failures with per-item exponential backoff plus an overall token bucket. This separation of "something changed" from "make it right" is why reconcilers are level-triggered.

The dossier treats the design as a scalability mechanism first, and it spends its second half on the places where the abstraction leaks: stale reads right after a write, memory that grows with the number of watched objects, relist storms after an expired cursor, retry synchronization, and external API pressure from high reconcile concurrency. It shows how Flux, Argo CD, and Crossplane expose worker counts, cache size, and rate caps as operator knobs, and it adds one public outage as evidence that many API clients can overload a control plane.

## Key claims

Each URL below is a page the dossier read. Only the pages that are rich enough are covered through other wiki pages, so the rest are cited here. See [[entities/client-go]] and [[entities/controller-runtime]].

### Pipeline internals

- The sample-controller "client-go under the hood" document (https://github.com/kubernetes/sample-controller/blob/master/docs/controller-client-go.md) names the Reflector (ListAndWatch, pushing into the DeltaFIFO), the Informer (whose process loop pops the DeltaFIFO and stores objects), and the Indexer (a thread-safe store keyed by `MetaNamespaceKeyFunc`, which yields `namespace/name`). It says resource event handlers should extract the delivered object's key and add it to the work queue, so delivery is decoupled from processing. The dossier's quotation of this sentence is a close paraphrase and not verified wording.
- The client-go ARCHITECTURE document (https://github.com/kubernetes/client-go/blob/master/ARCHITECTURE.md) describes LIST then WATCH for a consistent snapshot, the DeltaFIFO feeding the Indexer, read-only Listers, and `util/workqueue` as the boundary between event detection and reconciliation, so that failures retry with exponential backoff independent of the watch stream. It states "Informer event handlers only add an object's key to the work queue." It also covers watch bookmarks that refresh the resource version to recover from "too old" errors.
- The Kubernetes Controllers page (https://kubernetes.io/docs/concepts/architecture/controller/) defines controllers as control loops with a thermostat analogy and says "Each controller tries to move the current cluster state closer to the desired state." It separates controllers that act through the API server (the Job controller creating Pods) from controllers that act on external systems (the cluster autoscaler). See [[examples/job-controller-acts-through-the-api-server-while-the-cluster-autoscaler-acts-directly]].
- The Kubernetes API Concepts page (https://kubernetes.io/docs/reference/using-api/api-concepts/) specifies the server contract that reflectors rely on: `watch` as a streaming verb, the resource version as a resume cursor, 410 Gone when a version is too old so the client must relist, watch bookmarks as progress markers, streaming lists for large collections, and a watch cache for resuming from recent versions. See [[findings/an-expired-resourceversion-forces-a-relist-and-synchronized-relists-can-storm]].
- The workqueue package documentation (https://pkg.go.dev/k8s.io/client-go/util/workqueue) describes a base queue (Add, Get, Done, ShutDown), a delaying queue (`AddAfter`), and a rate-limiting queue (`AddRateLimited`, `Forget`), with generic typed variants. It guarantees fair FIFO ordering, deduplication of items added before processing, and that "a single item will not be processed multiple times concurrently." The default limiter combines a token bucket with per-item exponential backoff, and other limiters include fast/slow and max-wait. Authors must call `Done()` and `Forget()` or retry tracking persists. See [[findings/skipping-done-or-forget-on-the-workqueue-leaves-items-stuck-or-retrying]].
- The semicolony.dev explainer (https://semicolony.dev/codex/kubernetes/internals/informers/), a secondary source, walks the whole pipeline. It says the DeltaFIFO deduplicates consecutive identical deltas while keeping per-key order, the Indexer supports secondary indexes (namespace, labels, owner references, custom), and periodic resync is usually disabled and acts as a defense against reconciler bugs. It recommends jittered backoff to avoid relist storms. It summarizes the design as "One watch per resource type, one cache per process, one reconcile per key, one rate limiter per workqueue." Check specifics against the primary pages.

### Framework behavior and pitfalls

- The Kubebuilder CronJob implementation page (https://book.kubebuilder.io/cronjob-tutorial/controller-implementation) shows a reconciler that fetches the primary object, lists owned Jobs, updates status, prunes old Jobs, and returns `RequeueAfter`. `Owns(&Job{})` wires an informer on the children so child changes trigger a reconcile of the owner, and a field indexer on the owner reference avoids scanning every Job in the cache. See [[examples/kubebuilder-owns-and-a-field-indexer-wire-child-changes-to-the-owner]].
- Ahmet Alp Balkan's "So you wanna write Kubernetes controllers?" (https://ahmet.im/blog/controller-pitfalls/index.html) lists poor CRD API design, controllers with too many responsibilities, missing status and conditions, not tracking `observedGeneration`, surprise from reading informer caches, expensive reconciles that make needless API calls, misunderstanding resync and worker concurrency, and ignoring cache lag after writes (the expectations pattern). It warns that Reconcile is invoked every time an event source changes. See [[findings/heavy-event-handlers-and-expensive-reconciles-waste-api-calls]].
- The Kubernetes blog post "How the controller-runtime Cache Actually Works" (https://kubernetes.io/blog/2026/07/29/controller-runtime-cache-explained/, 2026-07-29) says the cache is an in-memory, watch-fed copy that the cache-backed client reads from. It covers stale reads after writes, memory growth proportional to watched objects with no eviction, the misconception that every client call is cached (writes and status updates go to the API server), and explicit uncached reads for authoritative data. Only about 100,000 of about 150,000 characters were read. See [[findings/informer-caches-hold-every-watched-object-and-memory-grows-with-cluster-size]] and [[findings/stale-cache-and-double-action]].
- Daniel Mangum's rate-limiting walkthrough (https://danielmangum.com/posts/controller-runtime-client-go-rate-limiting/) says the default workqueue limiter takes the maximum of a per-item exponential failure limiter (5 ms base, 1000 s cap) and an overall token bucket (10 queries per second, burst 100). Without the bucket, thousands of failing objects could produce tens of thousands of requeues per second, and synchronized backoff creates thundering herds. The default may not suit controllers that share an external API, and the workqueue limiter is distinct from client-level QPS and burst throttling. See [[findings/retry-storms-and-unbounded-retries]].

### Tool tuning and incident evidence

- The Flux vertical scaling page (https://fluxcd.io/flux/installation/configuration/vertical-scaling/) describes `--concurrent` flags that raise parallel reconciles, source-controller Helm index caching through `--helm-cache-max-size` and `--helm-cache-ttl`, persistent volumes in place of EmptyDir for artifacts, and a warning that "tmpfs will count against the controller's pod memory usage." See [[examples/flux-controllers-expose-worker-concurrency-and-helm-cache-size-as-tuning-knobs]].
- The Argo CD high availability page (https://argo-cd.readthedocs.io/en/stable/operator-manual/high_availability/) says the application controller uses watch APIs to maintain a lightweight cluster cache. It scales by sharding clusters across replicas (`legacy`, `round-robin`, `consistent-hashing`), by tuning `--status-processors` and `--operation-processors` (defaults 20 and 10, with higher values suggested for around 1000 applications), and by setting `GOMEMLIMIT` to 80 to 90 percent of the container limit. See [[examples/argo-cd-application-controller-shards-clusters-and-tunes-processor-counts]].
- Crossplane issue 2595 (https://github.com/crossplane/crossplane/issues/2595) argues that provider performance was governed by scattered knobs (`QPS`, `PollInterval`, `MaxConcurrentReconciles`, `RateLimiter`), none of which directly bounded external API calls. It proposes a single `--max-reconcile-rate` flag, merged for Crossplane 1.6 and adopted by providers, because "Reconcile rate in Crossplane is a good proxy for average external API call rate." See [[examples/crossplane-max-reconcile-rate-turns-reconcile-rate-into-an-api-call-budget]].
- Ahmet Alp Balkan's notes on the OpenAI Kubernetes outage (https://ahmet.im/blog/openai-kubernetes-incident/) analyze a public postmortem in which a new telemetry service issued expensive API calls from every node, overloading the API servers and blocking remediation, while DNS service discovery depended on the control plane. The lessons are slower staged rollouts, problems that appear only at large cluster size, API Priority and Fairness for admin access, and right-sizing control planes. The root cause was telemetry load, not an informer bug, and the primary postmortem was not read. See [[examples/an-openai-outage-shows-many-api-clients-can-overload-the-control-plane]] and [[findings/control-plane-overload-blocks-the-remediation-that-would-fix-it]].

## Open questions in the dossier

- No page covered kro, Config Connector, ACK, or Cluster API informer, cache, or rate-limit choices.
- Flux shared-cache internals and Crossplane's current performance guide were not read, because the guessed Crossplane guide URL returned 404.
- The controller-runtime cache blog was read only in part, so mitigations such as selectors, transforms, disabled caching for specific types, and metadata-only informers may be missing. See [[open-knowledge-gaps]].
- Resync is described as a defense against reconciler bugs that is usually disabled, yet the pitfalls blog lists misunderstanding it as a common error. Defaults differ by framework. See [[decisions/keep-informer-resync-disabled-or-set-a-periodic-resync]].
- The OpenAI evidence is indirect commentary, and the primary postmortem was not read.

## Pages this source informed

[[concepts/informers-reflectors-and-workqueues]], [[comparisons/concurrency-and-cache-memory-controls-across-flux-argo-cd-and-crossplane]], [[entities/flux]], [[entities/argo-cd]], [[entities/crossplane]], [[entities/controller-runtime]], [[entities/kubebuilder]], [[entities/client-go]]

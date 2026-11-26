# Research dossier: Informers, Reflectors, and Workqueues

Research date: 2026-11-25

Method note: pages were read through web_scrape or WebFetch. WebFetch returns a model-condensed extraction rather than raw text, and several long pages (Kubernetes controller page, API concepts, controller-runtime cache blog) were only read in their first ~100,000 characters. Treat summaries as accurate to the extraction, and verify details against the source before publishing exact numbers.

## Overview

Kubernetes controllers are non-terminating control loops. They compare the desired state in an object's `spec` with observed state and act to close the gap. A controller that asked the API server for every object on every loop would not scale, so client-go provides a layered caching machinery in `tools/cache`. A Reflector performs an initial LIST to get a consistent snapshot, then opens a WATCH and streams changes. Events go into a DeltaFIFO queue. The informer loop pops deltas, updates a thread-safe Indexer (the local cache, with optional secondary indexes), and calls registered event handlers. Controllers read through read-only Listers that hit the local cache, not the API server.

The workqueue is the last stage. Event handlers are supposed to do almost nothing except compute a key (usually `namespace/name`) and add it to a rate-limited workqueue. Worker goroutines pull keys, read the current object from the cache, and reconcile. The queue gives three properties: deduplication (many events for one object collapse to one key), no concurrent processing of the same key, and retry with per-item exponential backoff plus an overall token bucket. This separates "something changed" (informer) from "make it right" (reconciler), which is why reconcilers are level-triggered: they look at current state, not at the event that woke them.

The sources frame the design as a scalability mechanism first. The API server's watch cache, resourceVersion semantics, watch bookmarks, and 410 Gone responses let clients resume or relist without hammering etcd. Informers add one watch per resource type per process, shared by all consumers in that process. Higher-level frameworks (controller-runtime, kubebuilder) wrap this: `Owns()`/`Watches()` register informers and event mappings, and the manager's default client reads from the shared cache and writes directly to the API server.

The practical lessons are about the places this abstraction leaks. Cache reads can be stale right after a write. Caches consume memory proportional to the objects watched. Resync, concurrency, and rate limiting settings change load on both the API server and external systems. Tool stacks (Flux, Argo CD, Crossplane) expose these knobs differently, as the pitfalls section describes.

## Sources

### 1. client-go under the hood (sample-controller)
- URL: https://github.com/kubernetes/sample-controller/blob/master/docs/controller-client-go.md
- Title: controller-client-go.md ("client-go under the hood")
- Publisher: Kubernetes project (kubernetes/sample-controller)
- Kind: Official design/explainer doc in a reference repo
- Summary: The canonical diagram and component list linking client-go to custom controller code. It names the Reflector (ListAndWatch, pushes into DeltaFIFO via watchHandler), the Informer (the base controller's processLoop pops DeltaFIFO and stores objects), and the Indexer (thread-safe store with key function `MetaNamespaceKeyFunc` giving `namespace/name`). On the user side it lists the informer and indexer references, resource event handlers, the workqueue, and the process-item function. It says handlers should extract the key and enqueue it so delivery is decoupled from processing. Best first read for newcomers.
- Quote: "Resource event handler functions are written to extract the delivered object's key and add that to the work queue." (paraphrase-close; see source for exact wording)

### 2. client-go ARCHITECTURE.md
- URL: https://github.com/kubernetes/client-go/blob/master/ARCHITECTURE.md
- Title: client-go Architecture
- Publisher: Kubernetes project (kubernetes/client-go)
- Kind: Architecture doc
- Summary: Describes Reflector LIST then WATCH for a consistent snapshot, DeltaFIFO feeding the Indexer cache, read-only Listers for local queries, and `util/workqueue` as the boundary between event detection and reconciliation so failures retry with exponential backoff independent of the watch stream. Also covers watch bookmarks that refresh resourceVersion to recover from "too old" errors, and the relist/rewatch loop.
- Quote: "Informer event handlers only add an object's key to the work queue."

### 3. Controllers (Kubernetes concepts)
- URL: https://kubernetes.io/docs/concepts/architecture/controller/
- Title: Controllers
- Publisher: Kubernetes documentation (kubernetes.io)
- Kind: Official documentation
- Summary: Defines controllers as control loops, with the thermostat analogy. A controller tracks resources with a `spec`, observes current state, acts, and reports back. It distinguishes controllers that act via the API server (Job creating Pods) from ones that act on external systems (cluster autoscaler). It also stresses that the system is designed for constant change, so convergence rather than a stable snapshot is the goal. Gives the conceptual "why" before the client-go "how".
- Quote: "Each controller tries to move the current cluster state closer to the desired state."

### 4. Kubernetes API Concepts
- URL: https://kubernetes.io/docs/reference/using-api/api-concepts/
- Title: Kubernetes API Concepts
- Publisher: Kubernetes documentation
- Kind: Official API reference/concepts
- Summary: Specifies the server-side contract that reflectors rely on: `watch` as a streaming verb, resourceVersion as the resume cursor, 410 Gone when a version is too old (client must relist), watch bookmarks as progress markers, streaming lists for large collections, and the API server's watch cache for resuming from recent versions. Required reading to understand why a reflector relists and when. Only the first ~100k characters were read.
- Quote: "watch is a verb that is used to track changes to an object in Kubernetes as a stream."

### 5. client-go workqueue package
- URL: https://pkg.go.dev/k8s.io/client-go/util/workqueue
- Title: workqueue package
- Publisher: Kubernetes project (Go package docs)
- Kind: API reference
- Summary: Documents the queue interfaces: base (Add/Get/Done/ShutDown), delaying (`AddAfter`), and rate-limiting (`AddRateLimited`, `Forget`), with generic typed variants. Guarantees: fair FIFO ordering, deduplication of items added before processing, and no concurrent processing of one item. Default limiter combines a token bucket (overall) and per-item exponential backoff; other limiters include fast/slow and max-wait. Reminds authors to call `Done()` and `Forget()` or retry tracking persists.
- Quote: "Stingy: a single item will not be processed multiple times concurrently."

### 6. So you wanna write Kubernetes controllers?
- URL: https://ahmet.im/blog/controller-pitfalls/index.html
- Title: So you wanna write Kubernetes controllers?
- Publisher: Ahmet Alp Balkan (personal engineering blog)
- Kind: Experience-based blog / pitfalls list
- Summary: A practitioner list of mistakes: poor CRD API design, controllers with too many responsibilities, missing status/conditions, not tracking `observedGeneration`, surprise from reading informer caches, expensive reconciles that make needless API calls, misunderstanding resync and worker concurrency, and ignoring cache lag after writes (the expectations pattern). Very useful for the pitfalls section of tutorials.
- Quote: "Your Reconcile() function is invoked every time your event sources change"

### 7. How the controller-runtime Cache Actually Works
- URL: https://kubernetes.io/blog/2026/07/29/controller-runtime-cache-explained/
- Title: How the controller-runtime Cache Actually Works, and Why Your... (title truncated in search result)
- Publisher: Kubernetes blog (kubernetes.io)
- Kind: Official blog explainer, 2026-07-29
- Summary: Explains that the controller-runtime cache is an in-memory, watch-fed copy that the cache-backed client reads from. Covers stale reads after writes, memory growth proportional to watched objects with no eviction, the misconception that every client call is cached (writes and status updates go to the API server), and explicit uncached reads for authoritative data. Only the first ~100k of ~150k characters were read, so later sections (for example mitigation options) may be missing here.
- Quote: none retained verbatim beyond the page's own framing; see source.

### 8. Kubernetes Informers and the Cache
- URL: https://semicolony.dev/codex/kubernetes/internals/informers/
- Title: Kubernetes Informers and the Cache — watch, list, the work queue
- Publisher: semicolony.dev (third-party reference site)
- Kind: Tutorial/explainer (secondary source)
- Summary: Walks the pipeline: list/watch with relist on failure, DeltaFIFO deduplicating consecutive identical deltas while keeping per-key order, Indexer with secondary indexes (namespace, labels, owner refs, custom), the rate-limited workqueue, periodic resync (usually disabled) as a defense against reconciler bugs, and recovery using bookmarks, jittered backoff to avoid relist storms, and the watch cache to avoid "too old" errors. Secondary source, so check specifics against primaries.
- Quote: "One watch per resource type, one cache per process, one reconcile per key, one rate limiter per workqueue."

### 9. Kubebuilder book: CronJob controller implementation
- URL: https://book.kubebuilder.io/cronjob-tutorial/controller-implementation
- Title: Implementing a controller (CronJob tutorial)
- Publisher: Kubernetes SIGs (Kubebuilder)
- Kind: Official tutorial
- Summary: Shows a reconciler fetching the primary object, listing owned Jobs, updating status, pruning old Jobs, and returning `RequeueAfter` for the next schedule. `Owns(&Job{})` wires an informer on children so child changes trigger reconcile of the owner. A field indexer on owner reference avoids scanning all Jobs in the cache. Good bridge from client-go internals to the frameworks people actually use.
- Quote: "If something else changes in between... we might reconcile again sooner."

### 10. Rate Limiting in controller-runtime and client-go
- URL: https://danielmangum.com/posts/controller-runtime-client-go-rate-limiting/
- Title: Rate Limiting in controller-runtime and client-go
- Publisher: Daniel Mangum (personal engineering blog)
- Kind: Source-code walkthrough / blog
- Summary: Explains the default workqueue limiter: a MaxOf combination of per-item exponential failure limiter (5ms base, 1000s cap) and an overall token bucket (10 QPS, burst 100). Without the bucket, thousands of failing objects could produce tens of thousands of requeues per second, and synchronized backoff creates thundering herds. Notes the default may not fit controllers that share an external API. Distinguishes the workqueue limiter from client-level QPS/burst throttling.
- Quote: "the Limiter limits the rate to r tokens per second, with a maximum burst of b events."

### 11. Notes on OpenAI Kubernetes outage
- URL: https://ahmet.im/blog/openai-kubernetes-incident/
- Title: Notes on OpenAI Kubernetes outage
- Publisher: Ahmet Alp Balkan (commentary on a public incident)
- Kind: Postmortem commentary
- Summary: Analysis of a public postmortem: a new telemetry service issued expensive API calls from every node, overloading API servers and blocking remediation, and DNS service discovery depended on the control plane, so cached records expiring cascaded into data-plane failure. Lessons: slower staged rollouts, issues that appear only at large cluster size, API Priority and Fairness for admin access, and right-sizing control planes. Relevant because it shows how many list/watch clients can overwhelm the API server. It is not an informer bug per se.
- Quote: "Kubernetes API server is required for DNS resolution, which is a critical dependency for many services." (as extracted; verify against source)

### 12. Flux vertical scaling
- URL: https://fluxcd.io/flux/installation/configuration/vertical-scaling/
- Title: Flux vertical scaling
- Publisher: Flux project (fluxcd.io)
- Kind: Official documentation
- Summary: Describes tuning Flux controllers: `--concurrent` flags raise parallel reconciles (workqueue workers), source-controller Helm index caching via `--helm-cache-max-size` and `--helm-cache-ttl`, persistent volumes in place of EmptyDir for artifacts, and a warning that tmpfs counts against pod memory. Shows how a GitOps stack exposes worker concurrency and cache size as operator knobs.
- Quote: "tmpfs will count against the controller's pod memory usage"

### 13. Argo CD high availability and scaling
- URL: https://argo-cd.readthedocs.io/en/stable/operator-manual/high_availability/
- Title: High Availability (Operator Manual)
- Publisher: Argo Project
- Kind: Official documentation
- Summary: The application-controller keeps a lightweight cluster cache from watch APIs rather than repeated queries. It scales by sharding clusters across replicas (`legacy`, `round-robin`, `consistent-hashing`), by tuning `--status-processors` and `--operation-processors` (worker counts; defaults 20 and 10, higher values suggested for around 1000 apps), and by setting `GOMEMLIMIT` to 80 to 90 percent of the container limit to avoid OOM kills.
- Quote: "The controller uses Kubernetes watch APIs to maintain a lightweight Kubernetes cluster cache."

### 14. Crossplane --max-reconcile-rate proposal
- URL: https://github.com/crossplane/crossplane/issues/2595
- Title: Proposal: Add a `--max-reconcile-rate` flag to Crossplane and all providers
- Publisher: Crossplane project (GitHub issue)
- Kind: Design proposal / issue
- Summary: Argues that Crossplane provider performance was governed by scattered knobs (`QPS`, `PollInterval`, `MaxConcurrentReconciles`, `RateLimiter`), none of which directly bounded external API calls. Proposes one flag for a global reconciles-per-second cap that derives the rest and works with `--poll-interval`. Merged for Crossplane 1.6 and adopted by providers. Illustrates how workqueue concurrency and rate limits translate into cloud API load.
- Quote: "Reconcile rate in Crossplane is a good proxy for average external API call rate"

## Real-world use cases

Every built-in Kubernetes controller (Job, Deployment, node lifecycle) uses this informer, workqueue, reconcile structure; the Controllers concept page (https://kubernetes.io/docs/concepts/architecture/controller/) describes the Job controller creating Pods through the API server and the cluster autoscaler acting on external infrastructure. Custom controllers follow the same shape via sample-controller (https://github.com/kubernetes/sample-controller/blob/master/docs/controller-client-go.md) and Kubebuilder's CronJob example (https://book.kubebuilder.io/cronjob-tutorial/controller-implementation).

Argo CD's application-controller uses watch-fed cluster caches to compare live and desired state across many clusters and shards by cluster (https://argo-cd.readthedocs.io/en/stable/operator-manual/high_availability/). Flux's source, kustomize, and helm controllers are workqueue-driven reconcilers with tunable concurrency (https://fluxcd.io/flux/installation/configuration/vertical-scaling/). Crossplane providers reconcile external cloud resources at hundreds of thousands of objects in scale tests, so reconcile rate maps to cloud API call rate (https://github.com/crossplane/crossplane/issues/2595). OpenAI's public outage, discussed at https://ahmet.im/blog/openai-kubernetes-incident/, shows a large production fleet where many API clients stressed a control plane.

## Pitfalls and how tools address them

Stale cache reads: after a controller writes, the cache may not yet show the change, so an immediate read can see old data. Sources recommend the expectations pattern, using uncached reads only where authority is required, and understanding that the cache-backed client reads from cache while writes go to the API server (https://ahmet.im/blog/controller-pitfalls/index.html, https://kubernetes.io/blog/2026/07/29/controller-runtime-cache-explained/).

Memory growth: caches hold every watched object with no eviction, so large clusters can exhaust memory. Argo CD advises `GOMEMLIMIT` tuning and sharding across replicas (https://argo-cd.readthedocs.io/en/stable/operator-manual/high_availability/); Flux exposes cache size flags and warns about tmpfs memory (https://fluxcd.io/flux/installation/configuration/vertical-scaling/). Narrowing watches with field/label selectors or transforms is a common remedy; these sources did not cover it in detail (see open questions).

Retry storms and thundering herds: failing objects can requeue very fast and synchronize. The default controller limiter combines per-item exponential backoff with a token bucket to cap overall rate (https://danielmangum.com/posts/controller-runtime-client-go-rate-limiting/, https://pkg.go.dev/k8s.io/client-go/util/workqueue). Forgetting to call `Forget()` or `Done()` leaves retry tracking stuck.

External API pressure: reconcile concurrency and poll interval drive cloud API calls. Crossplane unified these under `--max-reconcile-rate` (https://github.com/crossplane/crossplane/issues/2595).

Relist storms and expired cursors: when a watch's resourceVersion is too old the server returns 410 Gone and the client relists. Bookmarks, the server watch cache, and jittered backoff reduce the cost (https://kubernetes.io/docs/reference/using-api/api-concepts/, https://semicolony.dev/codex/kubernetes/internals/informers/, https://github.com/kubernetes/client-go/blob/master/ARCHITECTURE.md).

Heavy handlers and reconciles: handlers should only enqueue keys; reconcilers should avoid unnecessary API calls and handle missing `observedGeneration` or status (https://ahmet.im/blog/controller-pitfalls/index.html). Field indexers avoid cache scans (https://book.kubebuilder.io/cronjob-tutorial/controller-implementation).

Control plane overload: many clients can overload API servers; API Priority and Fairness helps admins keep access (https://ahmet.im/blog/openai-kubernetes-incident/).

## Tutorial and explainer links

- https://github.com/kubernetes/sample-controller/blob/master/docs/controller-client-go.md: the best one-page diagram of reflector, informer, indexer, and workqueue.
- https://github.com/kubernetes/client-go/blob/master/ARCHITECTURE.md: concise official architecture summary.
- https://kubernetes.io/docs/concepts/architecture/controller/: gentle conceptual start for controllers.
- https://book.kubebuilder.io/cronjob-tutorial/controller-implementation: framework-level worked example.
- https://kubernetes.io/blog/2026/07/29/controller-runtime-cache-explained/: why cache behavior surprises people.
- https://ahmet.im/blog/controller-pitfalls/index.html: checklist of common mistakes.
- https://danielmangum.com/posts/controller-runtime-client-go-rate-limiting/: how the default limiters behave.
- https://semicolony.dev/codex/kubernetes/internals/informers/: end-to-end secondary explainer.
- Search results also surfaced (not read): https://dev.to/jamesli/client-go-deep-dive-controller-the-central-hub-that-wires-the-informer-framework-together-1p1d, https://deepwiki.com/iximiuz/client-go-examples/3.4-workqueues, https://chishengliu.com/posts/kubernetes-operator-sample-controller/.

## Open questions

- Coverage gap: no source read covered kro, Config Connector, ACK, or Cluster API specifically. Their informer, cache, and rate-limit choices are not documented in this dossier.
- Flux and Argo CD pages describe tuning but not the exact informer implementation; Flux's internals around shared caches and Crossplane's current (v2) performance guide were not read (the guessed Crossplane guide URL returned 404).
- The controller-runtime cache blog was only read in part; mitigations (cache selectors, transforms, disabling cache for specific types, metadata-only informers) may be in the unread portion.
- Resync: the sources disagree in emphasis. One calls it a defense against reconciler bugs and usually disabled; the pitfalls blog lists misunderstanding it as a common error. Defaults differ by framework and need checking.
- The OpenAI source is commentary on a postmortem, and the root cause was telemetry load rather than informers, so its relevance is indirect. The primary postmortem was not read.
- Exact default numbers (limiter QPS and burst, processor counts) come from condensed extraction and should be verified against current code and docs before they are stated as fact in tutorials. Quotes are as returned by the extraction and could differ slightly from page text.

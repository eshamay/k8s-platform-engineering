# Research dossier: Scale and sharding

Research date: 2026-11-25

Reading note: several pages were too large for the scrape tool and were read through WebFetch, which returns a model-generated digest of the page rather than the raw text. Those entries are marked "(digest)". Quotes from digests should be re-checked against the page before being published.

## Overview

Scale in Kubernetes platform engineering is a set of separate limits, not a single number. The API server and etcd have a "scalability envelope" (nodes, pods, namespaces, object sizes, object counts) in which the dimensions trade off against each other. Controllers add their own limits. Each controller holds an informer cache in memory (so memory grows with watched objects), drains a workqueue with a fixed number of workers (so slow reconciles back up the queue), and talks to the API server through a client-side rate limiter (QPS and burst). Server-side, API Priority and Fairness (APF) decides which requests wait or are rejected under overload.

Platform tools put extra pressure on these limits. Crossplane providers install hundreds of CRDs, and each CRD adds server memory, discovery requests and OpenAPI work. GitOps controllers such as Flux and Argo CD reconcile thousands of objects, so CPU, memory and Git/Helm/OCI fetches dominate. Infrastructure controllers (Crossplane, Config Connector, ACK) also face cloud API rate limits that the Kubernetes machinery does not see. The sources frame the problem as "find which resource saturates first, then either raise it (vertical scaling, concurrency flags) or split the work (sharding, smaller providers, more clusters)".

The tools split work in different ways. Flux shards by a label (`sharding.fluxcd.io/key`) matched by a `--watch-label-selector` on each controller deployment. Argo CD shards clusters across application-controller replicas, with several assignment algorithms. Crossplane shrinks the per-cluster footprint by breaking big providers into "provider families" so fewer CRDs and controllers load. Upstream Kubernetes made CRD-heavy clusters cheaper through fixes such as lazy OpenAPI computation and higher client discovery limits. The common design idea is that a controller's work should be partitionable by a stable key (label, cluster, API group). Leader election makes replicas of the same controller single-writer, so more replicas alone do not add throughput.

## Sources

### 1. Flux sharding and horizontal scaling
- URL: https://fluxcd.io/flux/installation/configuration/sharding/
- Title: Flux sharding and horizontal scaling
- Publisher: Flux project (CNCF)
- Kind: Official documentation (digest)
- Summary: Explains how to run several instances of source-controller, kustomize-controller and helm-controller. Each instance is started with a `--watch-label-selector`. Objects are assigned to a shard by the label `sharding.fluxcd.io/key`. The default instance excludes labelled objects with a negated selector, and shard instances select a specific value. Shards are created with Kustomize overlays that add a name suffix and patch the arguments. Dependent source kinds (a HelmChart pointing at a HelmRepository) must carry the same label. Labels can be applied in bulk through a Kustomization's `commonMetadata` and patches. Notification-controller and source-watcher cannot be sharded and stay singletons. Useful as the canonical mechanical description of label-based sharding.
- Quote: "Source object kinds which have a dependency on another kind (i.e. HelmChart on a HelmRepository) need to have the same labels applied."

### 2. How to configure vertical scaling for Flux controllers
- URL: https://fluxcd.io/flux/installation/configuration/vertical-scaling/
- Title: How to configure vertical scaling for Flux controllers
- Publisher: Flux project
- Kind: Official documentation (digest)
- Summary: The vertical counterpart to sharding. Raise `--concurrent` (suggested range 10 to 20) and the CPU and memory limits for the kustomize, helm and source controllers. Put `/tmp` on a memory-backed `emptyDir` to speed up Kustomize builds, at the cost of pod memory. Tune the Helm index cache flags in source-controller to limit memory when repositories host many charts. Use PersistentVolumeClaims instead of `emptyDir` so artifacts survive restarts, and pin controllers to dedicated nodes. Shows that the first step in Flux is to raise worker count and resources, with sharding next.
- Quote: "Increase the number of reconciliations that can be performed in parallel and to bump the resources limits"

### 3. API Priority and Fairness
- URL: https://kubernetes.io/docs/concepts/cluster-administration/flow-control/
- Title: API Priority and Fairness
- Publisher: Kubernetes project
- Kind: Official documentation (digest; the last ~39K characters of the page were not read)
- Summary: Describes APF, the server-side mechanism that replaced coarse max-in-flight limits. Requests are classified by FlowSchema (user, namespace, verb, resource) into a PriorityLevelConfiguration, each with its own concurrency share measured in seats. Within a level, requests queue using fair queuing with shuffle sharding so one noisy flow cannot fill all queues. Levels can borrow idle capacity. Long-running requests such as exec and logs are exempt, and watches are accounted for specially. Rejected requests get HTTP 429 and clients are expected to back off. Metrics such as `apiserver_flowcontrol_rejected_requests_total` and queue-length gauges show whether a controller is being throttled. Essential for understanding why a misbehaving controller no longer takes down the whole cluster.
- Quote: "a poorly-behaved controller need not starve others (even at the same priority level)"

### 4. KEP-1040 API Priority and Fairness
- URL: https://github.com/kubernetes/enhancements/tree/master/keps/sig-api-machinery/1040-priority-and-fairness
- Title: KEP-1040: Priority and Fairness for API Server Requests
- Publisher: Kubernetes SIG API Machinery
- Kind: KEP / design doc (digest; the last ~69K characters were not read)
- Summary: The design rationale. The old max-in-flight handler could not distinguish request types, so one subset of load (a thundering herd, a buggy controller) crowded out the rest, including requests needed for the cluster to repair itself. Goals include protecting system maintenance traffic, avoiding priority inversion, guaranteeing capacity to lower-priority users and containing individual buggy components. The design uses priority levels with concurrency allocations, fair queuing within each, and limited borrowing. Good for the "why" behind the feature page.
- Quote: "One subset of the request load crowds out other parts of the request load" (paraphrased by the digest; verify against the KEP before quoting).

### 5. client-go ARCHITECTURE.md
- URL: https://github.com/kubernetes/client-go/blob/master/ARCHITECTURE.md
- Title: client-go Architecture
- Publisher: Kubernetes (client-go maintainers)
- Kind: Architecture doc, read in full via scrape
- Summary: Walks through the machinery every Go controller rides on: rest.Config and transports, content negotiation (including metadata-only `PartialObjectMetadata` requests that cut memory and bandwidth), list pagination and watch bookmarks, the Reflector to DeltaFIFO to Indexer to event handler to workqueue pipeline, and leader election via a Lease. It states that QPS and Burst in `rest.Config` are the client's half of the contract with APF, that the client honours 429 `Retry-After`, and that the workqueue separates event detection from reconciliation so retries with exponential backoff do not block the watch stream. It also notes dynamic clients depend on discovery and OpenAPI, which is where CRD count hurts. Best single primer for informer memory and client-side throttling.
- Quote: "The `QPS` and `Burst` settings in `rest.Config` are the client's half of the contract with the server's API Priority and Fairness system."

### 6. client-go util/workqueue package
- URL: https://pkg.go.dev/k8s.io/client-go/util/workqueue
- Title: workqueue package
- Publisher: Kubernetes (Go package docs)
- Kind: API reference (digest)
- Summary: Documents the queue types controllers use. The queue deduplicates keys, never processes one key concurrently, and re-queues keys added during processing. The rate-limiting queue adds delayed adds, and the default controller rate limiter combines per-item exponential backoff with an overall token bucket. This explains why a failing object backs off while healthy ones proceed, and why the number of workers (not the number of objects) bounds throughput.
- Quote: "a single item will not be processed multiple times concurrently, and if an item is added multiple times before it can be processed, it will only be processed once"

### 7. So you wanna write Kubernetes controllers?
- URL: https://ahmet.im/blog/controller-pitfalls/
- Title: So you wanna write Kubernetes controllers?
- Publisher: Ahmet Alp Balkan (personal engineering blog)
- Kind: Engineering blog / pitfalls explainer (digest)
- Summary: A practitioner list of controller mistakes. Scale-relevant ones: reading from a stale informer cache, flooding the workqueue on startup or resync because every cached object is enqueued, making external or API calls on every reconcile even when nothing changed (which causes cascading failures in outages), and misusing `Requeue: true` and `RequeueAfter` instead of relying on built-in backoff. Slow reconcile logic hogs workers and deepens the queue. Useful to ground tutorials in concrete anti-patterns.
- Quote: "Logic that takes long to execute in a reconciliation loop will hog the worker goroutine, and cause workqueue depth to increase."

### 8. Solving the Crossplane Provider CRD Scaling Problem with Provider Families
- URL: https://blog.crossplane.io/crd-scaling-provider-families/
- Title: Solving the Crossplane Provider CRD Scaling Problem with Provider Families
- Publisher: Jared Watts, Crossplane blog (13 Jun 2023)
- Kind: Project engineering blog, read in full via scrape
- Summary: Explains why Crossplane strains the control plane: most add-ons install tens of CRDs, while Crossplane providers install hundreds or thousands (Upbound's provider-aws installed more than 900). Installing them could leave the API unresponsive for up to an hour. CRD count was never an official Kubernetes scaling threshold. Upstream fixes helped but code-generated providers outgrew them. The community chose "Provider Families", splitting big providers into service-scoped providers, over CRD filtering or lazy loading, because it needs no new concepts and gives a non-disruptive migration. Upbound's official providers shipped as families first.
- Quote: "Most Kubernetes add-ons install no more than tens of CRDs."

### 9. Scaling Kubernetes to Thousands of CRDs
- URL: https://www.upbound.io/blog/scaling-kubernetes-to-thousands-of-crds
- Title: Scaling Kubernetes to Thousands of CRDs
- Publisher: Upbound
- Kind: Engineering blog / performance investigation (digest)
- Summary: Details what broke when thousands of CRDs were installed. Client side: discovery needed around 300 HTTP requests and hit client-side throttling, and the kubectl disk cache was slow because of fsync use. Server side: OpenAPI computation burned CPU, memory use reached several MiB per CRD (causing OOM kills on hosted control planes), and redundant etcd clients and loggers added overhead. Fixes included higher kubectl discovery limits, checksum-based caching, lazy OpenAPI computation (Kubernetes 1.23) and shared loggers. The numbers are from the digest and should be verified before being quoted.
- Quote: "Waited for 1.033772408s due to client-side throttling, not priority and fairness, request" (log line from the post).

### 10. Crossplane design doc: smaller providers
- URL: https://github.com/crossplane/crossplane/blob/main/design/design-doc-smaller-providers.md
- Title: Design doc: Smaller Providers
- Publisher: Crossplane project (Nic Cope et al.)
- Kind: Design doc (digest)
- Summary: The decision record behind provider families. It lists CRD counts at the time (provider-aws 872, provider-azure 692, provider-gcp 325), says problems appear around 500 CRDs, and estimates a typical user would drop from 900+ to about 176 CRDs while running about 9 provider pods instead of 2. It notes memory cost for Upjet-based providers (about 600 MB baseline plus about 300 MB per Terraform provider process). Alternatives rejected: allow-list filtering of CRDs and lazy-loading CRDs. Shows the tradeoff of fewer CRDs versus more pods.
- Quote: "Installing a single large provider can break a cluster."

### 11. Argo CD High Availability / application controller sharding
- URL: https://argo-cd.readthedocs.io/en/stable/operator-manual/high_availability/
- Title: Overview (High Availability), Argo CD operator manual
- Publisher: Argo project (CNCF)
- Kind: Official documentation (digest)
- Summary: Argo CD shards by cluster. The application-controller StatefulSet runs several replicas, `ARGOCD_CONTROLLER_REPLICAS` tells each replica the total, and the algorithm is selectable: legacy (UID-based, uneven), round-robin and consistent-hashing (both described as experimental in the digest). Clusters can be pinned to a shard through a field on the cluster secret. Separate knobs, `--status-processors` and `--operation-processors`, size the two internal queues (reconcile versus sync); the doc suggests larger values for around 1,000 apps. Contrasts with Flux, which shards by label on objects rather than by destination cluster.
- Quote: "Each controller replica uses two separate queues to process application reconciliation (milliseconds) and app syncing (seconds)."

### 12. Kubernetes scalability thresholds
- URL: https://github.com/kubernetes/community/blob/main/sig-scalability/configs-and-limits/thresholds.md
- Title: Scalability thresholds
- Publisher: Kubernetes SIG Scalability
- Kind: Community reference (digest)
- Summary: Defines the "scalability envelope" and lists tested limits: about 5,000 nodes, 150,000 pods, 10,000 namespaces, 10,000 services, per-namespace limits, and a 1.5 MB object size cap. The envelope is not a cube because dimensions interact, so pushing one reduces headroom in others. Limits for smaller clusters are proportionally lower. CRD count is not among the tested dimensions (the Crossplane blog says so), which is the gap that platform tools fell into.
- Quote: "Many of the thresholds (for cluster scope) are given for the largest possible cluster. For smaller clusters, the limits are proportionally lower."

### 13. Scalability of Gardener Managed Kubernetes Clusters
- URL: https://gardener.cloud/docs/guides/administer-shoots/scalability/
- Title: Scalability of Gardener Managed Kubernetes Clusters
- Publisher: Gardener project
- Kind: Operator guidance from a managed-Kubernetes project (digest)
- Summary: Practical sizing advice from people who run many clusters: etcd is practically limited around 8 GB, healthy clusters stay under about 3 GB and under about 100k objects (excluding events); an API server pod is safe up to about 3 cores and 16 GB; most clusters should stay below 500 nodes; webhooks are a bottleneck risk, and conversion webhooks are especially dangerous because outages block garbage collection. Useful as a counterweight to the 5,000-node headline number and for CRD and webhook caveats.
- Quote: "If you promise to correctly configure your cluster, use extensibility features 'reasonably,' [and] keep the load in the cluster within recommended limits..." (from the digest; verify).

## Real-world use cases

Crossplane at hyperscale-provider size is the best-documented case. Upbound's official AWS, Azure and GCP providers generated hundreds of CRDs each, and users on hosted Kubernetes services saw API servers become unresponsive for long periods; the fix was provider families, shipped for the Upbound official providers in 2023 (https://blog.crossplane.io/crd-scaling-provider-families/, https://github.com/crossplane/crossplane/blob/main/design/design-doc-smaller-providers.md). Upbound also upstreamed Kubernetes and kubectl fixes while testing a multi-cloud control plane with roughly 2,000 managed resources (https://www.upbound.io/blog/scaling-kubernetes-to-thousands-of-crds).

Flux multi-tenant platforms are the typical sharding scenario: a platform team runs the default controllers for system workloads and extra shards for tenants or noisy namespaces, labelling each tenant's sources and Kustomizations in bulk with `commonMetadata` (https://fluxcd.io/flux/installation/configuration/sharding/). Before sharding, the documented route for "hundreds of applications deployed many times a day" is raising `--concurrent` and resources (https://fluxcd.io/flux/installation/configuration/vertical-scaling/). The sources do not name specific organizations running Flux shards.

Argo CD hub-and-spoke setups, where one control plane manages many destination clusters, shard by cluster across application-controller replicas and tune processor counts for around a thousand applications (https://argo-cd.readthedocs.io/en/stable/operator-manual/high_availability/).

Managed Kubernetes operators such as Gardener run many clusters and advise staying under about 500 nodes and controlling webhooks and object counts (https://gardener.cloud/docs/guides/administer-shoots/scalability/). Large single clusters use the SIG Scalability envelope as a design reference (https://github.com/kubernetes/community/blob/main/sig-scalability/configs-and-limits/thresholds.md).

## Pitfalls and how tools address them

CRD count pressure. Hundreds of CRDs slow discovery, inflate API server memory and can cause OOM kills or long unresponsive periods when installed. Crossplane responded by splitting providers into families (default: fewer CRDs, more provider pods) rather than filtering or lazy-loading CRDs, which the design doc rejected. Upstream mitigations (lazy OpenAPI, bigger discovery limits) help but did not keep up with generated providers (https://blog.crossplane.io/crd-scaling-provider-families/, https://www.upbound.io/blog/scaling-kubernetes-to-thousands-of-crds). The cost of the family approach is more pods and more per-provider memory (the design doc cites about 600 MB baseline for Upjet providers).

Informer memory and resync storms. Each informer caches every watched object, and a restart or resync enqueues all of them at once. Mitigations visible in the sources: metadata-only watches via `PartialObjectMetadata` content negotiation, pagination and watch bookmarks for cheaper relists (https://github.com/kubernetes/client-go/blob/master/ARCHITECTURE.md), and avoiding work when nothing changed (https://ahmet.im/blog/controller-pitfalls/). Flux sharding also reduces per-instance cache size because each shard watches only its labelled subset.

Workqueue and worker limits. Throughput is bounded by worker count and reconcile duration, and a slow reconcile hogs a worker. The workqueue deduplicates keys and applies per-item exponential backoff plus an overall token bucket (https://pkg.go.dev/k8s.io/client-go/util/workqueue). Flux and Argo CD expose worker knobs (`--concurrent`, status and operation processors) as the first lever before sharding.

Client-side throttling versus server-side APF. Two layers throttle a controller: the client's QPS/Burst limiter and the server's APF. The Upbound log line shows a case of client-side throttling that was not APF. APF protects the cluster from a misbehaving controller (it isolates flows and returns 429), and clients must back off; custom clients with poor backoff are a named risk (https://kubernetes.io/docs/concepts/cluster-administration/flow-control/, https://github.com/kubernetes/enhancements/tree/master/keps/sig-api-machinery/1040-priority-and-fairness).

Sharding limits. Flux shards only three controllers, dependent sources need matching labels, and notification-controller stays a singleton (https://fluxcd.io/flux/installation/configuration/sharding/). Argo CD's cluster-based sharding can be uneven with the legacy algorithm, and the other algorithms were labelled experimental in the digest (https://argo-cd.readthedocs.io/en/stable/operator-manual/high_availability/). Because of leader election, adding replicas of an unsharded controller adds availability, not throughput (client-go architecture doc).

Webhooks and etcd. Conversion webhooks that go down block garbage collection, and etcd size limits cap total object count (https://gardener.cloud/docs/guides/administer-shoots/scalability/).

Cloud API rate limits. None of the fetched sources covered cloud provider throttling (AWS, Azure, GCP) for Crossplane, Config Connector or ACK. The only related point is the controller-pitfalls advice to avoid external calls on every reconcile. See Open questions.

## Tutorial and explainer links

- https://github.com/kubernetes/client-go/blob/master/ARCHITECTURE.md: the best compact walk-through of informers, workqueues and client-side throttling.
- https://ahmet.im/blog/controller-pitfalls/: readable list of controller mistakes that cause load problems.
- https://kubernetes.io/docs/concepts/cluster-administration/flow-control/: the official APF explainer with metrics to watch.
- https://fluxcd.io/flux/installation/configuration/sharding/: step-by-step Flux sharding setup.
- https://fluxcd.io/flux/installation/configuration/vertical-scaling/: what to tune before sharding Flux.
- https://blog.crossplane.io/crd-scaling-provider-families/: a plain-language story of CRD pressure and its fix.
- https://argo-cd.readthedocs.io/en/stable/operator-manual/high_availability/: sharding and processor tuning for Argo CD.
- https://github.com/kubernetes/community/blob/main/sig-scalability/configs-and-limits/thresholds.md: the reference table of tested limits.

## Open questions

- Cloud API rate limits (AWS, Azure, GCP throttling, poll intervals, `max-reconcile-rate` tuning in Crossplane providers) were not covered by a fetched source; the search for Crossplane tuning docs failed with a 503. Needs a follow-up pass, ideally docs.crossplane.io and provider repositories.
- kro, ACK, Cluster API and Config Connector scaling behaviour is not covered. The Config Connector fetch was redirected and not retried.
- Current Crossplane v2 scaling guidance (post-2023) is unverified; the provider-family sources date from 2023.
- Argo CD sharding algorithm maturity ("experimental" per the digest) may have changed in current releases; confirm on the page.
- Several numbers (Upbound CRD memory per CRD, Gardener limits, Argo processor sizes) come from model digests, not raw page text, and need a check before use. The APF page and KEP were only partly read.
- The SIG Scalability thresholds page is a 'tested' envelope; sources disagree in spirit with it (Gardener recommends under 500 nodes for most clusters versus 5,000 tested). This reflects different goals (tested maximum versus operational advice), but the sources do not reconcile them.
- No named case studies for Flux sharding adopters or for Kubernetes APF incidents or postmortems were found.

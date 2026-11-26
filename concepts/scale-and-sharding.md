---
title: Scale and sharding
type: concept
status: active
created: 2026-11-25
updated: 2026-11-26
sources:
  - id: research-scale-and-sharding
    hash: d082d1d36d7e
    ingested: 2026-11-25
  - id: research-gap-g3-crossplane-v2
    hash: 073a1fe74dec
    ingested: 2026-11-26
  - id: research-gap-g3-argocd-capi
    hash: c3d485fa58ae
    ingested: 2026-11-26
  - id: research-gap-g3-scale-recheck
    hash: d9bd6911bff7
    ingested: 2026-11-26
aliases: [sharding, controller scale, scalability envelope]
tags: [scale, sharding, apf, informers, workqueue, crd-count, leader-election]
---

# Scale and sharding

## What the concept covers

Scale in Kubernetes platform engineering is a set of separate limits and not a single number. The cluster has an envelope of tested sizes, each controller has its own memory and concurrency limits, and infrastructure controllers also face cloud API limits that Kubernetes cannot see. The practical method the sources describe is to find which resource saturates first and then either raise it or split the work. [[sources/research-scale-and-sharding]]

## Limits at the cluster level

SIG Scalability publishes a tested envelope of about 5,000 nodes, 150,000 pods, 10,000 namespaces, 10,000 services, and a 1.5 MB object size cap. The envelope is not a cube, because the dimensions interact and pushing one reduces headroom in the others, and limits for smaller clusters are proportionally lower. The page is explicitly scoped to "builtin resource types", states that the thresholds "are NOT hard limits - crossing the limit results in degraded performance", and ties them to a test setup (release-blocking scale tests have run on kops since December 2025). It also gives 150,000 non-event objects per resource type and 3 GB total size, and namespace-scope limits of 3,000 pods and 5,000 services. CRD count is not one of the tested dimensions, which is the gap that platform tools fell into, and the Crossplane project says it was "never officially included as a Kubernetes scaling threshold". These figures were rechecked against the raw page on 2026-11-26. [[sources/research-gap-g3-scale-recheck]] https://github.com/kubernetes/community/blob/main/sig-scalability/configs-and-limits/thresholds.md Operators of many clusters give tighter advice, see [[examples/gardener-advises-keeping-most-clusters-under-about-500-nodes-and-controlling-webhooks-and-object-counts]] and [[findings/tested-scalability-maximums-and-operator-advice-differ-by-an-order-of-magnitude]]. The shared store has its own ceiling, see [[findings/etcd-scale-limits-of-the-shared-store]].

## Limits inside a controller

A controller built on client-go has four distinct constraints. The informer cache holds every watched object, so memory grows with what the controller watches, see [[findings/informer-caches-hold-every-watched-object-and-memory-grows-with-cluster-size]]. The workqueue deduplicates keys and never processes one key concurrently, so throughput is bounded by the worker count and the time each reconcile takes, and not by the number of objects. A slow reconcile hogs a worker and deepens the queue. The client-side rate limiter, set by QPS and burst in `rest.Config`, throttles requests before they reach the server. Leader election through a Lease means only one replica of a controller reconciles, so extra replicas add availability and not throughput, see [[findings/extra-replicas-of-a-flux-controller-add-failover-not-capacity]]. The pipeline itself is explained in [[concepts/informers-reflectors-and-workqueues]]. Cheaper informers are possible: client-go supports metadata-only requests through `PartialObjectMetadata`, list pagination, and watch bookmarks. https://github.com/kubernetes/client-go/blob/master/ARCHITECTURE.md

## Server-side protection

API Priority and Fairness replaced the coarse max-in-flight limits. Requests are classified by FlowSchema into a priority level whose nominal concurrency is set in shares that the server converts into seats, queued with shuffle sharding within the level, and rejected with HTTP 429 when the level is saturated, so a badly behaved controller need not starve others. Clients are expected to back off. https://kubernetes.io/docs/concepts/cluster-administration/flow-control/ The design rationale in KEP-1040 is stated in its Motivation section: "there can be undesirable scenarios where one subset of the request load crowds out other parts of the request load." The KEP names self-maintenance traffic as a crowded-out case: "In an overload scenario today there is no assurance of priority for these self-maintenance requests." Its status is implemented, with alpha in v1.18, beta in v1.20, and stable in v1.29. The two throttling layers are easy to confuse, see [[findings/client-side-throttling-and-server-side-apf-are-separate-layers]], and the failure it protects against is shown in [[examples/an-openai-outage-shows-many-api-clients-can-overload-the-control-plane]].

## The two levers: raise or split

The first lever is vertical. Flux documents raising `--concurrent` to a range of 10 to 20 and raising CPU and memory limits, and Argo CD sizes its reconcile and sync queues with `--status-processors` and `--operation-processors`, see [[comparisons/concurrency-and-cache-memory-controls-across-flux-argo-cd-and-crossplane]]. The second lever is to split the work along a stable key so that each instance handles a subset.

| Tool | Partition key | Mechanism |
|---|---|---|
| Flux | Object label `sharding.fluxcd.io/key` | Several instances of source, kustomize, and helm controllers, each with a `--watch-label-selector` |
| Argo CD | Destination cluster | Application-controller replicas told the replica total, with legacy, round-robin, or consistent-hashing assignment |
| Crossplane | API group or cloud service | Provider families install only the scoped providers a user needs, so fewer CRDs and controllers load |

The comparison is worked through in [[comparisons/flux-label-sharding-versus-argo-cd-cluster-sharding]]. The limits of sharding are that Flux shards only three controllers and leaves the notification controller as a singleton, dependent sources must carry matching labels, and Argo CD's legacy algorithm can distribute clusters unevenly. Correction 2026-11-26: the round-robin and consistent-hashing algorithms are still labelled experimental (Alpha) in the Argo CD v3.6.3 docs, so that label is current. See [[findings/sharded-flux-dependents-must-carry-the-same-shard-label-as-their-parents]] and [[findings/argo-cd-legacy-sharding-can-be-uneven-and-the-other-algorithms-were-labelled-experimental]]. Whether to tune or shard first is framed in [[decisions/shard-flux-controllers-or-tune-intervals-and-concurrency-first]].

## CRD count as a scaling dimension

Crossplane providers installed hundreds of CRDs where most add-ons install tens, and installing them could leave an API unresponsive for up to an hour. Each CRD costs server memory, discovery requests, and OpenAPI work. Upstream fixes such as lazy OpenAPI computation in Kubernetes 1.23 and higher client discovery limits helped but did not keep pace with code-generated providers, so Crossplane split providers into families. See [[findings/one-crd-per-external-resource-type-overloads-api-server-discovery-and-openapi-computation]], [[decisions/split-a-large-provider-into-families-or-filter-or-lazy-load-its-crds]], and [[findings/splitting-a-provider-into-a-family-trades-fewer-crds-for-more-pods-and-memory]].

## Extension points that limit scale

Webhooks are a bottleneck risk, and conversion webhooks are especially dangerous because an outage blocks garbage collection, see [[findings/a-down-conversion-webhook-can-stall-garbage-collection]] and [[findings/admission-webhook-outages-are-a-recurring-failure-class]].

## What is not yet known

The wiki has no sourced data on how cloud provider API limits constrain Crossplane, Config Connector, or ACK, no scaling data for kro, ACK, Cluster API, or Config Connector controllers, and no current Crossplane v2 scaling guidance. Those questions are tracked in [[open-knowledge-gaps]].

## Related pages

[[concepts/reconciliation-loop]], [[concepts/custom-resource-definition]], [[entities/flux]], [[entities/argo-cd]], [[entities/crossplane]], [[entities/client-go]], [[entities/gardener]].

## Update from the v2.5 verification pass (2026-11-26)

Crossplane v2 scaling guidance is spread across the Pods guide (default polling of one minute, hourly full re-check, `--max-reconcile-rate`), the v2.1.0 release (custom client-side rate limiting replaced by API Priority and Fairness, an XR circuit breaker, and `--max-concurrent-reconciles`), and design docs. No numeric limits for XRs or composed resources per controller are documented. The CRD-count problem is now addressed on both sides: alpha activation policies reduce served CRDs, and v2.4 and v2.5 cut provider and core memory, with figures that are self-reported. [[sources/research-gap-g3-crossplane-v2]] See [[examples/crossplane-v2-4-and-v2-5-cut-memory-on-clusters-with-hundreds-to-two-thousand-crds]] and [[findings/the-default-crossplane-helm-install-activates-every-managed-resource-so-activation-policies-need-the-default-turned-off]].

## Argo CD sharding maturity, rechecked at v3.6.3

The 2026-11-26 dossier confirmed from the v3.6.3 docs that round-robin (Alpha since v2.8.0) and consistent-hashing (Alpha since v2.12.0) remain experimental, with the same warning as at v2.14.0 and v3.0.0. See [[entities/argo-cd]], [[findings/argo-cd-legacy-sharding-can-be-uneven-and-the-other-algorithms-were-labelled-experimental]], and [[sources/research-gap-g3-argocd-capi]].

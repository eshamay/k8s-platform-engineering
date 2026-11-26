---
title: Scale and sharding
type: concept
status: active
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-scale-and-sharding
    hash: d082d1d36d7e
    ingested: 2026-11-25
aliases: [sharding, controller scale, scalability envelope]
tags: [scale, sharding, apf, informers, workqueue, crd-count, leader-election]
---

# Scale and sharding

## What the concept covers

Scale in Kubernetes platform engineering is a set of separate limits and not a single number. The cluster has an envelope of tested sizes, each controller has its own memory and concurrency limits, and infrastructure controllers also face cloud API limits that Kubernetes cannot see. The practical method the sources describe is to find which resource saturates first and then either raise it or split the work. [[sources/research-scale-and-sharding]]

## Limits at the cluster level

SIG Scalability publishes a tested envelope of about 5,000 nodes, 150,000 pods, 10,000 namespaces, 10,000 services, and a 1.5 MB object size cap. The envelope is not a cube, because the dimensions interact and pushing one reduces headroom in the others, and limits for smaller clusters are proportionally lower. CRD count is not one of the tested dimensions, which is the gap that platform tools fell into. https://github.com/kubernetes/community/blob/main/sig-scalability/configs-and-limits/thresholds.md Operators of many clusters give tighter advice, see [[examples/gardener-advises-keeping-most-clusters-under-about-500-nodes-and-controlling-webhooks-and-object-counts]] and [[findings/tested-scalability-maximums-and-operator-advice-differ-by-an-order-of-magnitude]]. The shared store has its own ceiling, see [[findings/etcd-scale-limits-of-the-shared-store]].

## Limits inside a controller

A controller built on client-go has four distinct constraints. The informer cache holds every watched object, so memory grows with what the controller watches, see [[findings/informer-caches-hold-every-watched-object-and-memory-grows-with-cluster-size]]. The workqueue deduplicates keys and never processes one key concurrently, so throughput is bounded by the worker count and the time each reconcile takes, and not by the number of objects. A slow reconcile hogs a worker and deepens the queue. The client-side rate limiter, set by QPS and burst in `rest.Config`, throttles requests before they reach the server. Leader election through a Lease means only one replica of a controller reconciles, so extra replicas add availability and not throughput, see [[findings/extra-replicas-of-a-flux-controller-add-failover-not-capacity]]. The pipeline itself is explained in [[concepts/informers-reflectors-and-workqueues]]. Cheaper informers are possible: client-go supports metadata-only requests through `PartialObjectMetadata`, list pagination, and watch bookmarks. https://github.com/kubernetes/client-go/blob/master/ARCHITECTURE.md

## Server-side protection

API Priority and Fairness replaced the coarse max-in-flight limits. Requests are classified by FlowSchema into a priority level with its own concurrency share measured in seats, queued with shuffle sharding within the level, and rejected with HTTP 429 when the level is saturated, so a badly behaved controller need not starve others. Clients are expected to back off. https://kubernetes.io/docs/concepts/cluster-administration/flow-control/ The design rationale in KEP-1040 is that one subset of load, such as a thundering herd, should not crowd out requests the cluster needs to repair itself. The two throttling layers are easy to confuse, see [[findings/client-side-throttling-and-server-side-apf-are-separate-layers]], and the failure it protects against is shown in [[examples/an-openai-outage-shows-many-api-clients-can-overload-the-control-plane]].

## The two levers: raise or split

The first lever is vertical. Flux documents raising `--concurrent` to a range of 10 to 20 and raising CPU and memory limits, and Argo CD sizes its reconcile and sync queues with `--status-processors` and `--operation-processors`, see [[comparisons/concurrency-and-cache-memory-controls-across-flux-argo-cd-and-crossplane]]. The second lever is to split the work along a stable key so that each instance handles a subset.

| Tool | Partition key | Mechanism |
|---|---|---|
| Flux | Object label `sharding.fluxcd.io/key` | Several instances of source, kustomize, and helm controllers, each with a `--watch-label-selector` |
| Argo CD | Destination cluster | Application-controller replicas told the replica total, with legacy, round-robin, or consistent-hashing assignment |
| Crossplane | API group or cloud service | Provider families install only the scoped providers a user needs, so fewer CRDs and controllers load |

The comparison is worked through in [[comparisons/flux-label-sharding-versus-argo-cd-cluster-sharding]]. The limits of sharding are that Flux shards only three controllers and leaves the notification controller as a singleton, dependent sources must carry matching labels, and Argo CD's legacy algorithm can distribute clusters unevenly. See [[findings/sharded-flux-dependents-must-carry-the-same-shard-label-as-their-parents]] and [[findings/argo-cd-legacy-sharding-can-be-uneven-and-the-other-algorithms-were-labelled-experimental]]. Whether to tune or shard first is framed in [[decisions/shard-flux-controllers-or-tune-intervals-and-concurrency-first]].

## CRD count as a scaling dimension

Crossplane providers installed hundreds of CRDs where most add-ons install tens, and installing them could leave an API unresponsive for up to an hour. Each CRD costs server memory, discovery requests, and OpenAPI work. Upstream fixes such as lazy OpenAPI computation in Kubernetes 1.23 and higher client discovery limits helped but did not keep pace with code-generated providers, so Crossplane split providers into families. See [[findings/one-crd-per-external-resource-type-overloads-api-server-discovery-and-openapi-computation]], [[decisions/split-a-large-provider-into-families-or-filter-or-lazy-load-its-crds]], and [[findings/splitting-a-provider-into-a-family-trades-fewer-crds-for-more-pods-and-memory]].

## Extension points that limit scale

Webhooks are a bottleneck risk, and conversion webhooks are especially dangerous because an outage blocks garbage collection, see [[findings/a-down-conversion-webhook-can-stall-garbage-collection]] and [[findings/admission-webhook-outages-are-a-recurring-failure-class]].

## What is not yet known

The wiki has no sourced data on how cloud provider API limits constrain Crossplane, Config Connector, or ACK, no scaling data for kro, ACK, Cluster API, or Config Connector controllers, and no current Crossplane v2 scaling guidance. Those questions are tracked in [[open-knowledge-gaps]].

## Related pages

[[concepts/reconciliation-loop]], [[concepts/custom-resource-definition]], [[entities/flux]], [[entities/argo-cd]], [[entities/crossplane]], [[entities/client-go]], [[entities/gardener]].

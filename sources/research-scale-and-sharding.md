---
title: "Research dossier: Scale and sharding"
type: source
status: active
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-scale-and-sharding
    hash: d082d1d36d7e
    ingested: 2026-11-25
aliases: []
tags: [scale, sharding, apf, informers, workqueue, crd-count, flux, argo-cd, crossplane, research-dossier]
---

# Research dossier: Scale and sharding

> [!NOTE]
> **Raw file:** `raw/research-scale-and-sharding.md` (sha256 prefix d082d1d36d7e)<br>
> **Kind:** Research dossier summarizing 13 web pages, dated 2026-11-25<br>
> **Ingested:** 2026-11-25<br>
> **Caveat:** Eleven of the thirteen pages were read through a summarizing fetch tool, and two of those (the API Priority and Fairness page and KEP-1040) were only partly read. Only the client-go architecture document and the Crossplane provider-families blog were read in full. Numbers and quotes from digests should be re-checked against the pages before they are published.

## Summary

The dossier treats scale in Kubernetes platform engineering as a set of separate limits and not as one number. The API server and etcd have a scalability envelope in which nodes, pods, namespaces, and object counts trade off against each other. Each controller adds its own limits: an informer cache whose memory grows with the objects it watches, a workqueue drained by a fixed number of workers, and a client-side rate limiter set by QPS and burst. On the server side, API Priority and Fairness decides which requests wait or are rejected during overload. The sources frame the practical task as finding which resource saturates first and then either raising it with vertical scaling and concurrency flags, or splitting the work by sharding, smaller providers, or more clusters.

The tools split work in different ways. Flux shards by an object label, Argo CD shards by destination cluster, and Crossplane shrinks the per-cluster footprint by splitting large providers into families. Leader election means extra replicas of an unsharded controller add availability and not throughput. The concept page [concepts/scale-and-sharding](../concepts/scale-and-sharding.md) consolidates these ideas.

## Key claims

The claims below carry the URL of the page they come from. Pages marked "digest" were read through a summarizing fetch.

- Flux shards `source-controller`, `kustomize-controller`, and `helm-controller` by starting several instances with a `--watch-label-selector`, and objects are assigned to a shard by the label `sharding.fluxcd.io/key` (digest). https://fluxcd.io/flux/installation/configuration/sharding/
- The default Flux instance excludes labelled objects with a negated selector, and each shard instance selects one label value (digest). https://fluxcd.io/flux/installation/configuration/sharding/
- Quote: "Source object kinds which have a dependency on another kind (i.e. HelmChart on a HelmRepository) need to have the same labels applied." https://fluxcd.io/flux/installation/configuration/sharding/ See [findings/sharded-flux-dependents-must-carry-the-same-shard-label-as-their-parents](../findings/sharded-flux-dependents-must-carry-the-same-shard-label-as-their-parents.md).
- `notification-controller` and `source-watcher` cannot be sharded and stay singletons (digest). https://fluxcd.io/flux/installation/configuration/sharding/
- Labels can be applied in bulk through a Kustomization's `commonMetadata` and patches (digest). https://fluxcd.io/flux/installation/configuration/sharding/
- The vertical scaling step for Flux is to raise `--concurrent` (a suggested range of 10 to 20) and the CPU and memory limits, and the quoted purpose is "Increase the number of reconciliations that can be performed in parallel and to bump the resources limits" (digest). https://fluxcd.io/flux/installation/configuration/vertical-scaling/
- Putting `/tmp` on a memory-backed `emptyDir` speeds up Kustomize builds at the cost of pod memory, and persistent volumes keep artifacts across restarts (digest). https://fluxcd.io/flux/installation/configuration/vertical-scaling/
- API Priority and Fairness classifies requests with FlowSchemas into PriorityLevelConfigurations, each with a concurrency share measured in seats, queues requests within a level with shuffle sharding, and returns HTTP 429 to rejected requests (digest, partly read). Quote: "a poorly-behaved controller need not starve others (even at the same priority level)". https://kubernetes.io/docs/concepts/cluster-administration/flow-control/
- KEP-1040 records that the older max-in-flight handler could not tell request types apart, so one subset of load could crowd out the rest, including traffic the cluster needs to repair itself (digest, partly read). https://github.com/kubernetes/enhancements/tree/master/keps/sig-api-machinery/1040-priority-and-fairness
- Quote from the client-go architecture document: "The `QPS` and `Burst` settings in `rest.Config` are the client's half of the contract with the server's API Priority and Fairness system." The same document describes metadata-only `PartialObjectMetadata` requests, list pagination, watch bookmarks, and leader election through a Lease. https://github.com/kubernetes/client-go/blob/master/ARCHITECTURE.md See [findings/client-side-throttling-and-server-side-apf-are-separate-layers](../findings/client-side-throttling-and-server-side-apf-are-separate-layers.md).
- The workqueue deduplicates keys, never processes one key concurrently, and combines per-item exponential backoff with an overall token bucket, so worker count and not object count bounds throughput (digest). https://pkg.go.dev/k8s.io/client-go/util/workqueue
- Controller authors commonly flood the workqueue on startup or resync, call external APIs on every reconcile, and let slow reconcile logic hog workers. Quote: "Logic that takes long to execute in a reconciliation loop will hog the worker goroutine, and cause workqueue depth to increase." (digest). https://ahmet.im/blog/controller-pitfalls/
- Most Kubernetes add-ons install tens of CRDs, while Crossplane providers installed hundreds or thousands, and Upbound's provider-aws installed more than 900. Installing them could leave the API unresponsive for up to an hour. https://blog.crossplane.io/crd-scaling-provider-families/ See [decisions/split-a-large-provider-into-families-or-filter-or-lazy-load-its-crds](../decisions/split-a-large-provider-into-families-or-filter-or-lazy-load-its-crds.md).
- Discovery for thousands of CRDs needed about 300 HTTP requests and hit client-side throttling, server memory reached several MiB per CRD, and fixes included higher kubectl discovery limits, checksum-based caching, and lazy OpenAPI computation in Kubernetes 1.23 (digest). https://www.upbound.io/blog/scaling-kubernetes-to-thousands-of-crds
- The Crossplane smaller-providers design doc lists provider-aws at 872 CRDs, provider-azure at 692, and provider-gcp at 325, says problems appear around 500 CRDs, and estimates a typical user would drop from 900-plus CRDs to about 176 while running about 9 provider pods instead of 2 (digest). Upjet-based providers need about 600 MB baseline plus about 300 MB per Terraform provider process. Quote: "Installing a single large provider can break a cluster." https://github.com/crossplane/crossplane/blob/main/design/design-doc-smaller-providers.md See [findings/splitting-a-provider-into-a-family-trades-fewer-crds-for-more-pods-and-memory](../findings/splitting-a-provider-into-a-family-trades-fewer-crds-for-more-pods-and-memory.md).
- Argo CD shards by cluster across application-controller replicas through `ARGOCD_CONTROLLER_REPLICAS`, with legacy, round-robin, and consistent-hashing algorithms, and the digest described the latter two as experimental (digest). `--status-processors` and `--operation-processors` size the reconcile and sync queues, with larger values suggested for around 1,000 applications. https://argo-cd.readthedocs.io/en/stable/operator-manual/high_availability/ See [findings/argo-cd-legacy-sharding-can-be-uneven-and-the-other-algorithms-were-labelled-experimental](../findings/argo-cd-legacy-sharding-can-be-uneven-and-the-other-algorithms-were-labelled-experimental.md).
- SIG Scalability's tested envelope lists about 5,000 nodes, 150,000 pods, 10,000 namespaces, 10,000 services, and a 1.5 MB object size cap, notes that dimensions interact, and does not include CRD count (digest). Quote: "Many of the thresholds (for cluster scope) are given for the largest possible cluster. For smaller clusters, the limits are proportionally lower." https://github.com/kubernetes/community/blob/main/sig-scalability/configs-and-limits/thresholds.md
- Gardener advises that etcd is practically limited around 8 GB, that healthy clusters stay under about 3 GB and about 100,000 objects excluding events, that an API server pod is safe up to about 3 cores and 16 GB, that most clusters stay below 500 nodes, and that conversion webhooks are especially dangerous because outages block garbage collection (digest). https://gardener.cloud/docs/guides/administer-shoots/scalability/ See [examples/gardener-advises-keeping-most-clusters-under-about-500-nodes-and-controlling-webhooks-and-object-counts](../examples/gardener-advises-keeping-most-clusters-under-about-500-nodes-and-controlling-webhooks-and-object-counts.md) and [findings/tested-scalability-maximums-and-operator-advice-differ-by-an-order-of-magnitude](../findings/tested-scalability-maximums-and-operator-advice-differ-by-an-order-of-magnitude.md).

## Use cases named by the dossier

The best documented case is Crossplane at hyperscale-provider size, covered in [examples/crossplane-provider-families-let-operators-install-only-the-cloud-services-they-use](../examples/crossplane-provider-families-let-operators-install-only-the-cloud-services-they-use.md) and [examples/upbound-tested-a-multi-cloud-control-plane-of-about-2000-managed-resources-and-upstreamed-kubernetes-fixes](../examples/upbound-tested-a-multi-cloud-control-plane-of-about-2000-managed-resources-and-upstreamed-kubernetes-fixes.md). Flux multi-tenant platforms are the typical sharding scenario, see [examples/flux-sharding-splits-reconciliation-across-label-selected-controller-instances](../examples/flux-sharding-splits-reconciliation-across-label-selected-controller-instances.md). Argo CD hub-and-spoke setups are covered in [examples/argo-cd-application-controller-shards-clusters-and-tunes-processor-counts](../examples/argo-cd-application-controller-shards-clusters-and-tunes-processor-counts.md). The dossier names no specific organization running Flux shards.

## Open questions raised by the dossier

The dossier did not cover cloud API rate limits, kro, ACK, Cluster API, or Config Connector scaling, current Crossplane v2 guidance, or current Argo CD sharding algorithm maturity, and it found no named Flux sharding adopters or APF incident postmortems. These are tracked as gaps in [open-knowledge-gaps](../open-knowledge-gaps.md).

## Source quality

The reliance on summarizing fetches is recorded in [findings/the-scale-dossier-relies-on-model-digests-for-most-numbers-so-limits-need-rechecking](../findings/the-scale-dossier-relies-on-model-digests-for-most-numbers-so-limits-need-rechecking.md).

## Related pages

[concepts/scale-and-sharding](../concepts/scale-and-sharding.md), [concepts/informers-reflectors-and-workqueues](../concepts/informers-reflectors-and-workqueues.md), [comparisons/flux-label-sharding-versus-argo-cd-cluster-sharding](../comparisons/flux-label-sharding-versus-argo-cd-cluster-sharding.md), [entities/gardener](../entities/gardener.md), [entities/flux](../entities/flux.md), [entities/argo-cd](../entities/argo-cd.md), [entities/crossplane](../entities/crossplane.md), [entities/client-go](../entities/client-go.md).

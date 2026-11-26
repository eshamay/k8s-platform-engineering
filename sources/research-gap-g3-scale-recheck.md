---
title: "Research dossier: scale figures recheck (g3-scale-recheck)"
type: source
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-g3-scale-recheck
    hash: d9bd6911bff7
    ingested: 2026-11-26
aliases: []
tags: [scale, source-quality, sig-scalability, gardener, upbound, argo-cd, crossplane, apf, research-dossier, gap-closing, targeted-pass]
---

# Research dossier: scale figures recheck (g3-scale-recheck)

> [!NOTE]
> **Raw file:** `raw/research-gap-g3-scale-recheck.md` (sha256 prefix d9bd6911bff7)<br>
> **Kind:** Verified research dossier for gap cluster g3-scale-recheck, dated 2026-11-26<br>
> **Ingested:** 2026-11-26 as a targeted pass over existing scale, sharding, etcd, and provider-family pages<br>
> **Caveat:** Raw text came from full-page scrapes and raw GitHub files, with no model digest. The KEP-1040 README was fetched in full but read closely only in part, and the Gardener page carries no date.

## Summary

The dossier rechecked the scale figures that the wiki had taken from model digests and found every quoted figure confirmed against raw text, with no numeric correction. Three wordings were tightened. The Upbound figure is "a little over 4MiB" of resident memory per CRD and not "several MiB". Argo CD defaults are 20 status and 10 operation processors, with 50 and 25 used for 1,000 applications. The Crossplane memory figures are design-doc targets and not measurements.

It also records version sensitivity. The SIG Scalability thresholds are scoped to built-in resource types and tied to a kops test setup. Argo CD v3.6.3 and master still label round-robin and consistent-hashing experimental. The client-go default workqueue limiter has an overall token bucket that controller-runtime does not use when its priority queue is on, which is the default.

## Key claims

- SIG Scalability lists 5000 nodes, 10000 namespaces, 150000 pods, and 10000 services at cluster scope, plus 1.5MB per object, 150,000 non-event objects per type, and 3GB total. "thresholds are NOT hard limits - crossing the limit results in degraded performance". URL: https://raw.githubusercontent.com/kubernetes/community/master/sig-scalability/configs-and-limits/thresholds.md.
- The table is for "builtin resource types" and has no CRD count. The Crossplane blog says CRD count was "never officially included as a Kubernetes scaling threshold". URL: https://blog.crossplane.io/crd-scaling-provider-families/ (13 Jun 2023).
- Gardener: "ETCD has a practical space limit of 8 GB."; healthy DB "less than 3 GB"; object count "should not exceed 100k for most use cases"; 3 cores and 16 GB per kube-apiserver pod is safe; most clusters under 500 nodes; assumes nodes with "8 vCPU and 32GB memory at least". URL: https://gardener.cloud/docs/guides/administer-shoots/scalability/ (undated, read 2026-11-26).
- Gardener: "If a conversion webhook is unavailable, the garbage collector fails to list all resources and does not perform any cleanup."
- Upbound (Aug 9, 2022, self-reported): "a little over 4MiB" RSS per CRD; about 300 HTTP requests for discovery; lazy OpenAPI in v1.23.0, backported to v1.20.13, v1.21.7, v1.22.4; 25 percent lower peak RSS from GC tuning on an idle API server with about 2,000 CRDs. URL: https://www.upbound.io/blog/scaling-kubernetes-to-thousands-of-crds.
- Argo CD v3.6.3 and master: `--status-processors` 20 and `--operation-processors` 10 by default; "For 1000 applications, we use 50 ... and 25"; legacy sharding is "uid based distribution (non-uniform)"; round-robin and consistent-hashing are "an experimental feature". URL: https://raw.githubusercontent.com/argoproj/argo-cd/v3.6.3/docs/operator-manual/high_availability.md.
- Crossplane smaller-providers design doc (Draft, last commit 2023-04-25): provider-aws v0.30.0 at 872 CRDs, provider-azure v0.28.0 at 692, provider-gcp v0.28.0 at 325; problems start "very approximately" over 500 CRDs; about 176 CRDs and about 9 pods against over 900 and about 2. The 600MB and 300MB memory figures are targets ("we suspect we can get providers down to at least"). URL: https://github.com/crossplane/crossplane/blob/main/design/design-doc-smaller-providers.md.
- APF is stable since v1.29. Reject levels return HTTP 429, Queue levels use shuffle sharding and fair queuing, and limits are set in "nominal concurrency shares" converted to seats. KEP-1040 is implemented (alpha v1.18, beta v1.20, stable v1.29) and says "there can be undesirable scenarios where one subset of the request load crowds out other parts of the request load." URLs: the Kubernetes website flow-control page and https://github.com/kubernetes/enhancements/blob/master/keps/sig-api-machinery/1040-priority-and-fairness/README.md.
- client-go `DefaultTypedControllerRateLimiter` is the max of a 5 ms to 1000 s exponential limiter and a 10 qps, burst 100 bucket. controller-runtime main uses only the exponential limiter when the priority queue is on (default), and defaults `MaxConcurrentReconciles` to 1. The file is `pkg/controller/controller.go`.
- Not found or not checked: a Gardener revision date, a formal OOM test in the Upbound post, APF default seat tables, the unread parts of KEP-1040, the Argo CD "stable" URL itself, and any Crossplane v2 provider CRD guidance.

## Pages touched

[[concepts/scale-and-sharding]], [[findings/the-scale-dossier-relies-on-model-digests-for-most-numbers-so-limits-need-rechecking]], [[findings/tested-scalability-maximums-and-operator-advice-differ-by-an-order-of-magnitude]], [[findings/etcd-scale-limits-of-the-shared-store]], [[findings/one-crd-per-external-resource-type-overloads-api-server-discovery-and-openapi-computation]], [[findings/client-side-throttling-and-server-side-apf-are-separate-layers]], [[findings/splitting-a-provider-into-a-family-trades-fewer-crds-for-more-pods-and-memory]], [[decisions/split-a-large-provider-into-families-or-filter-or-lazy-load-its-crds]], [[examples/upbound-tested-a-multi-cloud-control-plane-of-about-2000-managed-resources-and-upstreamed-kubernetes-fixes]], [[examples/gardener-advises-keeping-most-clusters-under-about-500-nodes-and-controlling-webhooks-and-object-counts]], [[examples/argo-cd-application-controller-shards-clusters-and-tunes-processor-counts]], [[entities/controller-runtime]]

## Pages created from this source

[[findings/crossplane-provider-memory-figures-are-design-doc-targets-not-measurements]], [[findings/the-sig-scalability-thresholds-cover-built-in-types-only-and-are-not-hard-limits]], [[findings/the-default-workqueue-rate-limiter-differs-between-client-go-and-controller-runtime]]

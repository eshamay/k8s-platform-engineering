---
title: One CRD per external resource type overloads API server discovery and OpenAPI computation
type: finding
status: active
created: 2026-11-25
updated: 2026-11-26
sources:
  - id: research-managed-resource
    hash: 09ca2f9dcdc6
    ingested: 2026-11-25
  - id: research-crossplane-deep-dive
    hash: 44034359219f
    ingested: 2026-11-25
  - id: research-scale-and-sharding
    hash: d082d1d36d7e
    ingested: 2026-11-25
  - id: research-gap-g3-scale-recheck
    hash: d9bd6911bff7
    ingested: 2026-11-26
aliases: []
tags: [pitfall, scale, crd, crossplane, api-server, discovery]
---

# One CRD per external resource type overloads API server discovery and OpenAPI computation

## Observation

Crossplane's model gives every external resource type its own CRD, so a multi-cloud provider set implies thousands of them. Upbound estimates roughly 2,000 CRDs for AWS, Azure, and GCP together, with "a little over 4MiB" of API server resident memory per CRD (an Upbound self-report, measured with 780 CRDs) and about 300 API group-versions needing discovery requests. A GitHub issue reports that installing 100-plus CRD Terrajet-based providers made API servers slow. The root causes were OpenAPI recomputation each time a CRD was registered and client discovery rate limits of about 20 requests per second with a 30 burst. Reported outcomes include GKE control planes unresponsive at about 680 CRDs, `kubectl` taking more than 14 seconds, Rancher slowness, and a second large provider taking about 70 minutes to install against 20 for the first. URLs: https://github.com/crossplane/crossplane/issues/2649, https://www.upbound.io/blog/scaling-kubernetes-to-thousands-of-crds. [[sources/research-managed-resource]]

## Why it matters

The cost lands on the shared control plane and on every client, not only on Crossplane. Upstream Kubernetes raised discovery limits, but the issue thread did not consider that sufficient at the time. Upbound's list of upstream fixes includes higher discovery limits (Kubernetes 1.22 and later), a checksum-based client cache instead of fsync, lazy OpenAPI computation (1.23 and later), and consolidated etcd client logging (1.25 and later). The same pressure explains why the observe-only design rejected a separate data-source type, since it would have doubled CRD counts.

## Mitigations

Crossplane v2 activates only needed types through ManagedResourceDefinitions and activation policies, see [[examples/crossplane-managed-resource-activation-policies-install-only-the-resource-types-a-cluster-needs]]. GitOps clients may need a higher client QPS, see [[examples/crossplane-resources-hosted-by-argo-cd]]. For the general API machinery view see [[concepts/custom-resource-definition]], [[concepts/api-discovery-and-restmapper]], and [[findings/etcd-scale-limits-of-the-shared-store]].

## Upbound explanation of the mechanism

The Upbound engineering post gives the mechanism in plain terms. Clients make hundreds of discovery requests and get throttled, the API server does increasingly expensive serialization work each time a CRD is added or updated, and memory reaches a little over 4 MiB per CRD. The Upbound post also reports a logger fix expected to cut memory by about 20 percent in Kubernetes 1.25 and a garbage-collection tuning experiment that lowered peak resident memory by 25 percent on an idle API server with about 2,000 CRDs. Both are Upbound self-reports, verified against the post text on 2026-11-26 in [[sources/research-gap-g3-scale-recheck]]. Upstream mitigations include higher kubectl discovery rate limits, cheaper client caching, lazy OpenAPI computation, and shared etcd clients and loggers. The post covers upstream fixes and does not itself detail managed resource activation policies. [[sources/research-crossplane-deep-dive]] See [[entities/crossplane]] and [[decisions/run-one-crossplane-control-plane-or-several-domain-scoped-ones]].

## Additional evidence from the scale dossier

The scale dossier adds that CRD count was never an official Kubernetes scaling threshold, that SIG Scalability's tested envelope does not include it, and that the Crossplane design doc puts the onset of problems around 500 CRDs. The fix chosen was provider families. See [[decisions/split-a-large-provider-into-families-or-filter-or-lazy-load-its-crds]], [[examples/upbound-tested-a-multi-cloud-control-plane-of-about-2000-managed-resources-and-upstreamed-kubernetes-fixes]], [[concepts/scale-and-sharding]], and [[sources/research-scale-and-sharding]].

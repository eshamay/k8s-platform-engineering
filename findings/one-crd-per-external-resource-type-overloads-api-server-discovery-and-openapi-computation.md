---
title: One CRD per external resource type overloads API server discovery and OpenAPI computation
type: finding
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-managed-resource
    hash: 09ca2f9dcdc6
    ingested: 2026-11-25
aliases: []
tags: [pitfall, scale, crd, crossplane, api-server, discovery]
---

# One CRD per external resource type overloads API server discovery and OpenAPI computation

## Observation

Crossplane's model gives every external resource type its own CRD, so a multi-cloud provider set implies thousands of them. Upbound estimates roughly 2,000 CRDs for AWS, Azure, and GCP together, with more than 4 MiB of API server memory per CRD and about 300 API group-versions needing discovery requests. A GitHub issue reports that installing 100-plus CRD Terrajet-based providers made API servers slow. The root causes were OpenAPI recomputation each time a CRD was registered and client discovery rate limits of about 20 requests per second with a 30 burst. Reported outcomes include GKE control planes unresponsive at about 680 CRDs, `kubectl` taking more than 14 seconds, Rancher slowness, and a second large provider taking about 70 minutes to install against 20 for the first. URLs: https://github.com/crossplane/crossplane/issues/2649, https://www.upbound.io/blog/scaling-kubernetes-to-thousands-of-crds. [[sources/research-managed-resource]]

## Why it matters

The cost lands on the shared control plane and on every client, not only on Crossplane. Upstream Kubernetes raised discovery limits, but the issue thread did not consider that sufficient at the time. Upbound's list of upstream fixes includes higher discovery limits (Kubernetes 1.22 and later), a checksum-based client cache instead of fsync, lazy OpenAPI computation (1.23 and later), and consolidated etcd client logging (1.25 and later). The same pressure explains why the observe-only design rejected a separate data-source type, since it would have doubled CRD counts.

## Mitigations

Crossplane v2 activates only needed types through ManagedResourceDefinitions and activation policies, see [[examples/crossplane-managed-resource-activation-policies-install-only-the-resource-types-a-cluster-needs]]. GitOps clients may need a higher client QPS, see [[examples/crossplane-resources-hosted-by-argo-cd]]. For the general API machinery view see [[concepts/custom-resource-definition]], [[concepts/api-discovery-and-restmapper]], and [[findings/etcd-scale-limits-of-the-shared-store]].

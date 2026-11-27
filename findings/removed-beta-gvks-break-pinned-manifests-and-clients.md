---
title: Removed beta GVKs break pinned manifests and clients
type: finding
status: draft
created: 2026-11-25
updated: 2026-11-26
sources:
  - id: research-gvk-and-gvr
    hash: 5c56bb1e05a8
    ingested: 2026-11-25
  - id: research-gap-g3-crossplane-v2
    hash: 073a1fe74dec
    ingested: 2026-11-26
  - id: research-gap-m5-informers-caches
    hash: 1a6a4969c0c2
    ingested: 2026-11-26
aliases: []
tags: [pitfall, deprecation, upgrade]
---

# Removed beta GVKs break pinned manifests and clients

## Observation

Upstream Kubernetes removes beta GVKs on a published schedule: PodSecurityPolicy `policy/v1beta1` in 1.25, and HPA `autoscaling/v2beta2` and `flowcontrol.apiserver.k8s.io/v1beta1` in 1.26. Manifests, charts, and clients pinned to those GVKs break once the cluster is upgraded. URL: https://kubernetes.io/blog/2022/11/18/upcoming-changes-in-kubernetes-1-26/. [sources/research-gvk-and-gvr](../sources/research-gvk-and-gvr.md)

## Mitigation

The sources advise moving to GA versions before the upgrade. Deprecation-scanning tools such as pluto and kubent appeared only in search results and were not read, so their behavior is not established here. See [examples/cluster-upgrades-remove-beta-gvks-in-1-25-and-1-26](../examples/cluster-upgrades-remove-beta-gvks-in-1-25-and-1-26.md), [concepts/gvk-and-gvr](../concepts/gvk-and-gvr.md), and [open-knowledge-gaps](../open-knowledge-gaps.md).

## Update from the v2.5 verification pass (2026-11-26)

Deprecated-API scanners do not cover Crossplane out of the box. Pluto's bundled rules hold 86 `k8s`, 24 `cert-manager`, and 2 `istio` entries, and kubent ships Rego rules for core Kubernetes only, so a deprecated or removed Crossplane GVK (such as the v1 XRD or the old `apiextensions` Usage) needs a custom entry in either tool. [sources/research-gap-g3-crossplane-v2](../sources/research-gap-g3-crossplane-v2.md) See [findings/pluto-and-kubent-ship-no-crossplane-rules-so-deprecated-crossplane-gvks-pass-unflagged](pluto-and-kubent-ship-no-crossplane-rules-so-deprecated-crossplane-gvks-pass-unflagged.md).

## Version handling in four tools (m5 dossier)

Argo CD keys resources by group, kind, namespace and name with no version, ACK and Config Connector key controllers by group and kind, and Cluster API resolves the version from CRD contract labels, so an API version change alone does not change a resource's identity in these tools. What happens when a served CRD version is removed is not documented in any source read. See [findings/argo-cd-ack-config-connector-and-cluster-api-identify-resources-by-group-and-kind-and-resolve-the-version-separately](argo-cd-ack-config-connector-and-cluster-api-identify-resources-by-group-and-kind-and-resolve-the-version-separately.md). [sources/research-gap-m5-informers-caches](../sources/research-gap-m5-informers-caches.md)

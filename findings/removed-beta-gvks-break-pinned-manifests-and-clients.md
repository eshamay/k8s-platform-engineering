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
aliases: []
tags: [pitfall, deprecation, upgrade]
---

# Removed beta GVKs break pinned manifests and clients

## Observation

Upstream Kubernetes removes beta GVKs on a published schedule: PodSecurityPolicy `policy/v1beta1` in 1.25, and HPA `autoscaling/v2beta2` and `flowcontrol.apiserver.k8s.io/v1beta1` in 1.26. Manifests, charts, and clients pinned to those GVKs break once the cluster is upgraded. URL: https://kubernetes.io/blog/2022/11/18/upcoming-changes-in-kubernetes-1-26/. [[sources/research-gvk-and-gvr]]

## Mitigation

The sources advise moving to GA versions before the upgrade. Deprecation-scanning tools such as pluto and kubent appeared only in search results and were not read, so their behavior is not established here. See [[examples/cluster-upgrades-remove-beta-gvks-in-1-25-and-1-26]], [[concepts/gvk-and-gvr]], and [[open-knowledge-gaps]].

## Update from the v2.5 verification pass (2026-11-26)

Deprecated-API scanners do not cover Crossplane out of the box. Pluto's bundled rules hold 86 `k8s`, 24 `cert-manager`, and 2 `istio` entries, and kubent ships Rego rules for core Kubernetes only, so a deprecated or removed Crossplane GVK (such as the v1 XRD or the old `apiextensions` Usage) needs a custom entry in either tool. [[sources/research-gap-g3-crossplane-v2]] See [[findings/pluto-and-kubent-ship-no-crossplane-rules-so-deprecated-crossplane-gvks-pass-unflagged]].

---
title: Cluster upgrades across 1.25 and 1.26 remove beta GVKs
type: example
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-gvk-and-gvr
    hash: 5c56bb1e05a8
    ingested: 2026-11-25
aliases: []
tags: [gvk, deprecation, upgrade]
---

# Cluster upgrades across 1.25 and 1.26 remove beta GVKs

## Scenario

Teams upgrading across Kubernetes 1.25 and 1.26 had to migrate manifests off GVKs that the API server stopped serving. [[sources/research-gvk-and-gvr]]

## What was removed

PodSecurityPolicy (`policy/v1beta1`) was deprecated in 1.21 and removed in 1.25, replaced by Pod Security Admission. This was a whole resource being retired, not only a version. URL: https://kubernetes.io/blog/2021/04/06/podsecuritypolicy-deprecation-past-present-and-future/. Kubernetes 1.26 removed `flowcontrol.apiserver.k8s.io/v1beta1` and `autoscaling/v2beta2` (the HPA beta), with advice to move manifests and clients to GA versions. URL: https://kubernetes.io/blog/2022/11/18/upcoming-changes-in-kubernetes-1-26/.

## Lesson

A GVK can disappear from a cluster on a published schedule, and manifests, charts, and clients pinned to the old GVK break. The mitigation named in the sources is moving to GA versions ahead of the upgrade. See [[findings/removed-beta-gvks-break-pinned-manifests-and-clients]] and [[concepts/gvk-and-gvr]].

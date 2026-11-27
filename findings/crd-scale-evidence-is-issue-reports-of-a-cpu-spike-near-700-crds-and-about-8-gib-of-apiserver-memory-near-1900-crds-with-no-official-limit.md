---
title: "CRD scale evidence is issue reports of a CPU spike near 700 CRDs and about 8 GiB of apiserver memory near 1,900 CRDs, with no official limit"
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-m6-admission-crds
    hash: 7cac38f11490
    ingested: 2026-11-26
aliases: []
tags: [crd, scale, apiserver, openapi, verified]
---

# CRD scale evidence is issue reports of a CPU spike near 700 CRDs and about 8 GiB of apiserver memory near 1,900 CRDs, with no official limit

## Observation

No official limit on the number of CRDs per cluster, custom resources per type, or apiserver memory per CRD was found. The SIG Scalability thresholds document is "Thresholds related to API server and etcd storage for **builtin resource types**" and a full-text search found no CRD figure. The evidence is issue reports of measured behavior, not benchmarks: a CPU spike when just over 700 CRDs were posted at once ([examples/kubernetes-issue-105932-posting-just-over-700-crds-at-once-spiked-kube-apiserver-cpu-in-openapi-publishing](../examples/kubernetes-issue-105932-posting-just-over-700-crds-at-once-spiked-kube-apiserver-cpu-in-openapi-publishing.md)), about 8 GiB of apiserver RSS near 1,900 CRDs ([examples/kubernetes-issue-111476-about-1-900-crds-pushed-apiserver-memory-to-about-8-gib](../examples/kubernetes-issue-111476-about-1-900-crds-pushed-apiserver-memory-to-about-8-gib.md)), one etcd client per CRD ([examples/kubernetes-issue-111622-the-api-server-creates-one-etcd-client-per-crd-and-the-issue-is-open](../examples/kubernetes-issue-111622-the-api-server-creates-one-etcd-client-per-crd-and-the-issue-is-open.md)), and CRD size trouble ([examples/kubernetes-issue-82292-crd-size-trouble-includes-a-5-519-crd-size-distribution-and-a-1-23-mb-strimzi-crd](../examples/kubernetes-issue-82292-crd-size-trouble-includes-a-5-519-crd-size-distribution-and-a-1-23-mb-strimzi-crd.md)). https://raw.githubusercontent.com/kubernetes/community/master/sig-scalability/configs-and-limits/thresholds.md, read 2026-11-26. [sources/research-gap-m6-admission-crds](../sources/research-gap-m6-admission-crds.md)

## Limits of the evidence

The figures are reporter measurements in particular environments. The two earlier reports were closed, in 2021 and 2022, and the one-client-per-CRD issue is still open at the read date. An official CRD-count limit and an official memory-per-CRD figure are UNVERIFIED and stay open.

## Related

[findings/the-sig-scalability-thresholds-cover-built-in-types-only-and-are-not-hard-limits](the-sig-scalability-thresholds-cover-built-in-types-only-and-are-not-hard-limits.md), [findings/one-crd-per-external-resource-type-overloads-api-server-discovery-and-openapi-computation](one-crd-per-external-resource-type-overloads-api-server-discovery-and-openapi-computation.md), and [concepts/scale-and-sharding](../concepts/scale-and-sharding.md).

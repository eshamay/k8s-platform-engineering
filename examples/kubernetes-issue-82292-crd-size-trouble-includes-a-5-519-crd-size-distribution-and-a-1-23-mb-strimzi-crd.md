---
title: "Kubernetes issue 82292, CRD size trouble includes a 5,519-CRD size distribution and a 1.23 MB Strimzi CRD"
type: example
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-m6-admission-crds
    hash: 7cac38f11490
    ingested: 2026-11-26
aliases: []
tags: [crd, size, client-side-apply, strimzi, issue, verified]
---

# Kubernetes issue 82292, CRD size trouble includes a 5,519-CRD size distribution and a 1.23 MB Strimzi CRD

## Scenario

Issue 82292, still OPEN at read, collects CRD size problems: the 262144-byte last-applied annotation, a 700 KB single-version CRD, a size distribution over 5,519 CRDs (99th percentile 27,617 bytes, maximum 171,823 bytes), and Strimzi's Kafka CRD, which the issue says "as of 0.22.1 ... is 1,231,093 bytes." https://github.com/kubernetes/kubernetes/issues/82292 [[sources/research-gap-m6-admission-crds]]

## Reliability

VERIFIED as reported. The distribution and sizes are the reporters' data and were not recomputed.

## Related

[[findings/large-crds-exceed-the-client-side-apply-annotation-limit]], [[examples/argo-cd-applicationsets-crd-too-large-for-client-side-apply]], and [[findings/config-connector-ships-883-crd-files-and-the-largest-is-579-kb-because-it-has-one-crd-per-google-cloud-resource-kind]].

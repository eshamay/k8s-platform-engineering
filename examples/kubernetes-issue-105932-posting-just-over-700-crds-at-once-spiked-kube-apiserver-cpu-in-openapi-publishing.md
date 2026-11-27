---
title: "Kubernetes issue 105932, posting just over 700 CRDs at once spiked kube-apiserver CPU in OpenAPI publishing"
type: example
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-m6-admission-crds
    hash: 7cac38f11490
    ingested: 2026-11-26
aliases: []
tags: [crd, scale, openapi, apiserver, issue, verified]
---

# Kubernetes issue 105932, posting just over 700 CRDs at once spiked kube-apiserver CPU in OpenAPI publishing

## Scenario

Crossplane reported in kubernetes/kubernetes issue 105932, opened 2021-10-27 and closed 2021-11-10, that "simultaneously posting just over 700 CRDs results in a CPU-utilization spike in kube-apiserver", caused by the background OpenAPI publishing job, with instability on GKE at 685 CRDs. Commenters said kube-openapi PR 251 would likely fix or alleviate it. https://github.com/kubernetes/kubernetes/issues/105932 [sources/research-gap-m6-admission-crds](../sources/research-gap-m6-admission-crds.md)

## Reliability

The figures are the reporter's own kind-cluster test, VERIFIED as reported and not a benchmark. The issue is closed, so the current behavior was not measured.

## Related

[findings/crd-scale-evidence-is-issue-reports-of-a-cpu-spike-near-700-crds-and-about-8-gib-of-apiserver-memory-near-1900-crds-with-no-official-limit](../findings/crd-scale-evidence-is-issue-reports-of-a-cpu-spike-near-700-crds-and-about-8-gib-of-apiserver-memory-near-1900-crds-with-no-official-limit.md) and [findings/one-crd-per-external-resource-type-overloads-api-server-discovery-and-openapi-computation](../findings/one-crd-per-external-resource-type-overloads-api-server-discovery-and-openapi-computation.md).

---
title: "Kubernetes issue 111476, about 1,900 CRDs pushed apiserver memory to about 8 GiB"
type: example
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-m6-admission-crds
    hash: 7cac38f11490
    ingested: 2026-11-26
aliases: []
tags: [crd, scale, memory, etcd, issue, verified]
---

# Kubernetes issue 111476, about 1,900 CRDs pushed apiserver memory to about 8 GiB

## Scenario

Crossplane reported in kubernetes/kubernetes issue 111476, opened 2022-07-27 and closed 2022-08-01, that "with ~1,900 CRDs we see the API server using up to ~8Gi RSS", with about 1.5 GiB of that from the etcd client logger. https://github.com/kubernetes/kubernetes/issues/111476 [[sources/research-gap-m6-admission-crds]]

## Reliability

VERIFIED as reported. The figure is one reporter's environment, and the issue is closed, so no current number follows from it.

## Related

[[examples/kubernetes-issue-111622-the-api-server-creates-one-etcd-client-per-crd-and-the-issue-is-open]], [[findings/crd-scale-evidence-is-issue-reports-of-a-cpu-spike-near-700-crds-and-about-8-gib-of-apiserver-memory-near-1900-crds-with-no-official-limit]], and [[examples/crossplane-v2-4-and-v2-5-cut-memory-on-clusters-with-hundreds-to-two-thousand-crds]].

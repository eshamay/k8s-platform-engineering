---
title: "etcd limits requests to 1.5 MiB and storage to 2 GiB by default, and 8 GiB is a suggested maximum, not the default"
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-m6-admission-crds
    hash: 7cac38f11490
    ingested: 2026-11-26
aliases: []
tags: [etcd, limits, object-size, correction, verified]
---

# etcd limits requests to 1.5 MiB and storage to 2 GiB by default, and 8 GiB is a suggested maximum, not the default

## Observation

The etcd limits page (breadcrumb v3.7, read 2026-11-26) says "By default, the maximum size of any request is 1.5 MiB", configurable with `--max-request-bytes`. The default storage limit is 2 GiB and "8 GiB is a suggested maximum size for normal environments". The kube-apiserver default `MaxRequestBodyBytes` is 3 MiB, above the etcd default, so the etcd limit binds first unless etcd is reconfigured. The roughly 1.5 MB object figure from a secondary source and the SIG Scalability "1.5MB per object" are therefore consistent with the etcd 1.5 MiB request limit. https://etcd.io/docs/latest/dev-guide/limit/ and https://raw.githubusercontent.com/kubernetes/kubernetes/master/staging/src/k8s.io/apiserver/pkg/server/config.go [[sources/research-gap-m6-admission-crds]]

## Correction

A secondary explainer cited elsewhere in this wiki describes etcd as "a single bbolt file with an 8 GB default cap". The etcd documentation says the default is 2 GiB and 8 GiB is the suggested maximum. See the correction in [[findings/etcd-scale-limits-of-the-shared-store]].

## Related

[[concepts/custom-resource-definition]], [[concepts/scale-and-sharding]], and [[findings/crd-scale-evidence-is-issue-reports-of-a-cpu-spike-near-700-crds-and-about-8-gib-of-apiserver-memory-near-1900-crds-with-no-official-limit]].

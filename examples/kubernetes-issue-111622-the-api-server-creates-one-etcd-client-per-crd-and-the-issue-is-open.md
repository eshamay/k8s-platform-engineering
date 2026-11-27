---
title: "Kubernetes issue 111622, the API server creates one etcd client per CRD and the issue is open"
type: example
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-m6-admission-crds
    hash: 7cac38f11490
    ingested: 2026-11-26
aliases: []
tags: [crd, etcd, apiserver, scale, issue, verified]
---

# Kubernetes issue 111622, the API server creates one etcd client per CRD and the issue is open

## Scenario

Issue 111622, opened 2022-08-02, records that "Currently the API server is creating one etcd client per CRD", which costs memory and TCP connections. The state was OPEN at the 2026-11-26 read. https://github.com/kubernetes/kubernetes/issues/111622 [sources/research-gap-m6-admission-crds](../sources/research-gap-m6-admission-crds.md)

## Reliability

VERIFIED. No fix or maintainer plan was read, so whether newer releases changed this is not established.

## Related

[examples/kubernetes-issue-111476-about-1-900-crds-pushed-apiserver-memory-to-about-8-gib](kubernetes-issue-111476-about-1-900-crds-pushed-apiserver-memory-to-about-8-gib.md) and [findings/etcd-scale-limits-of-the-shared-store](../findings/etcd-scale-limits-of-the-shared-store.md).

---
title: kcp
type: entity
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-universal-control-plane
    hash: 037575049a4c
    ingested: 2026-11-25
aliases: [kcp.io]
tags: [tool, multi-tenancy, api-server]
---

# kcp

kcp is a CNCF Sandbox project described as a horizontally scalable control plane for Kubernetes APIs. It hosts many isolated Kubernetes-like API endpoints, called workspaces, without nodes, which separates the API machinery from container orchestration. [[sources/research-universal-control-plane]]

## How it works

A provider offers an API to many tenants through APIExport and APIBinding. The project aims at SaaS-style platforms built with technology that platform engineers already know. Its stated ambition is about a million workspaces across 10,000 shards, which the dossier is careful to call a goal and not a measured result.

## Trade-offs

kcp isolates only the API, so it provides no compute and its tooling is less mature than that of namespaces or vcluster. It is still Sandbox maturity. See [[comparisons/tenancy-models-namespaces-vcluster-kcp]], [[examples/multi-tenant-api-hosting-with-kcp]], and [[findings/immature-abstractions-in-the-control-plane-ecosystem]].

## Related

[[concepts/universal-control-plane]], [[findings/etcd-scale-limits-of-the-shared-store]]

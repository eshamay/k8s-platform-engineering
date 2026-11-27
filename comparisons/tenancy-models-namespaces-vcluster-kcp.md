---
title: "Tenancy models: namespaces, vcluster, and kcp"
type: comparison
status: draft
created: 2026-11-25
updated: 2026-11-26
sources:
  - id: kcp-kubecon-talk
    hash: d7a7a3fee0ab
    ingested: 2026-11-26
  - id: research-universal-control-plane
    hash: 037575049a4c
    ingested: 2026-11-25
aliases: []
tags: [multi-tenancy, kcp, vcluster, scale]
---

# Tenancy models: namespaces, vcluster, and kcp

This comparison follows Kubermatic's vendor explainer and the vCluster blog, so all numbers are the vendors' claims. [[sources/research-universal-control-plane]]

| Model | Isolation | Cost and scale | Main limit |
|---|---|---|---|
| Namespaces | Weak; CRDs are shared | Cheapest; works when teams trust each other and tenant count is low | Noisy neighbors and shared CRDs |
| vcluster | Strong; each tenant gets a virtual API server | Per-tenant API server cost; about 100 tenants | Cost per tenant |
| [[entities/kcp]] workspaces | API-only isolation | 1000+ tenants; stated goal of about a million workspaces | No compute; less mature tooling |

## Reading the comparison

Kubermatic's advice is to pick namespaces for simplicity when teams trust each other. vCluster argues that a single etcd cannot be sharded for one logical keyspace, so per-tenant virtual control planes are the way to scale. See [[findings/etcd-scale-limits-of-the-shared-store]] and [[examples/multi-tenant-api-hosting-with-kcp]]. Independent benchmarks are missing, so the figures should be treated as indicative.

## A speaker's timing claim for kcp workspaces

A KubeCon speaker on kcp says a namespace is quick, a managed full cluster takes half an hour to an hour, and a kcp workspace appears in about a second. This is a spoken estimate from a promotional talk and not a benchmark, so it joins the vendor figures above and does not replace them, and the table's tenant counts are unchanged. See [[examples/a-kcp-speaker-says-a-workspace-takes-about-a-second-to-create-where-a-managed-cluster-takes-half-an-hour-to-an-hour]]. [[sources/kcp-kubecon-talk]]

---
title: Multi-tenant API hosting with kcp
type: example
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-universal-control-plane
    hash: 037575049a4c
    ingested: 2026-11-25
aliases: []
tags: [use-case, kcp, multi-tenancy, saas]
---

# Multi-tenant API hosting with kcp

## Scenario

A SaaS provider wants to serve a Kubernetes-style API to many tenants without giving each tenant a full cluster. [[entities/kcp]] hosts each tenant as an isolated workspace with no nodes, and the provider publishes its API to tenants through APIExport and APIBinding. [[sources/research-universal-control-plane]]

## Why it fits

Namespaces are cheap but share CRDs and suffer noisy neighbors, and per-tenant virtual clusters carry an API server cost per tenant. kcp trades compute for API-only isolation, which Kubermatic's explainer says supports 1000+ tenants. See [[comparisons/tenancy-models-namespaces-vcluster-kcp]]. It also reduces pressure on a single etcd, as discussed in [[findings/etcd-scale-limits-of-the-shared-store]].

## Evidence quality

The tenant counts come from vendors, and the million-workspace target is a goal. No named production deployment appears in the dossier.

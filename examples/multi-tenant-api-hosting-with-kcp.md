---
title: Multi-tenant API hosting with kcp
type: example
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
tags: [use-case, kcp, multi-tenancy, saas]
---

# Multi-tenant API hosting with kcp

## Scenario

A SaaS provider wants to serve a Kubernetes-style API to many tenants without giving each tenant a full cluster. [entities/kcp](../entities/kcp.md) hosts each tenant as an isolated workspace with no nodes, and the provider publishes its API to tenants through APIExport and APIBinding. [sources/research-universal-control-plane](../sources/research-universal-control-plane.md)

## Why it fits

Namespaces are cheap but share CRDs and suffer noisy neighbors, and per-tenant virtual clusters carry an API server cost per tenant. kcp trades compute for API-only isolation, which Kubermatic's explainer says supports 1000+ tenants. See [comparisons/tenancy-models-namespaces-vcluster-kcp](../comparisons/tenancy-models-namespaces-vcluster-kcp.md). It also reduces pressure on a single etcd, as discussed in [findings/etcd-scale-limits-of-the-shared-store](../findings/etcd-scale-limits-of-the-shared-store.md).

## Evidence quality

The tenant counts come from vendors, and the million-workspace target is a goal. No named production deployment appears in the dossier.

## A speaker's description of workspaces

A kcp speaker at KubeCon describes a workspace as an isolated Kubernetes API where the tenant is cluster admin and which is created in about a second, usable with kubectl, Helm, and other client-go tools. This repeats the scenario above in the speaker's words and adds no measurement. See [examples/a-kcp-speaker-says-a-workspace-takes-about-a-second-to-create-where-a-managed-cluster-takes-half-an-hour-to-an-hour](a-kcp-speaker-says-a-workspace-takes-about-a-second-to-create-where-a-managed-cluster-takes-half-an-hour-to-an-hour.md). [sources/kcp-kubecon-talk](../sources/kcp-kubecon-talk.md)

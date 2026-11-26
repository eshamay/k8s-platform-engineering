---
title: kcp
type: entity
status: active
created: 2026-11-25
updated: 2026-11-26
sources:
  - id: research-universal-control-plane
    hash: 037575049a4c
    ingested: 2026-11-25
  - id: research-gap-g1-named-adopters
    hash: 9f6a50098233
    ingested: 2026-11-26
  - id: research-gap-o5-kro-ecosystem
    hash: 7905031da128
    ingested: 2026-11-26
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

## Adopters

The kcp ADOPTERS file marks Upbound "Production" and SAP, SNCF Group, Kubermatic, Faros.sh, and KubeStellar "Development", all self-reported. See [[examples/upbound-is-the-only-kcp-adopter-marked-production-in-the-adopters-file]]. [[sources/research-gap-g1-named-adopters]]

## Update from the o5 dossier: CNCF status and generic-controlplane

Update 2026-11-26: cncf.io says kcp was accepted at the Sandbox maturity on 2023-09-19. The latest release read was v0.33.6 (2026-11-04). The kcp-dev/generic-controlplane repository says it is "not yet ready for production use" and aims at a control plane usable without Kubernetes, see [[examples/kcp-generic-controlplane-aims-at-an-api-server-without-kubernetes-and-says-it-is-not-ready-for-production]]. The kcp homepage links a KubeCon EU 2024 talk that was not read. See [[findings/no-sig-charter-or-kep-adopts-a-kubernetes-distribution-model-and-the-only-direct-source-is-aenix-s-own-post]]. [[sources/research-gap-o5-kro-ecosystem]]

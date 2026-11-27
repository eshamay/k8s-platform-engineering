---
title: kcp
type: entity
status: active
created: 2026-11-25
updated: 2026-11-26
sources:
  - id: kcp-kubecon-talk
    hash: d7a7a3fee0ab
    ingested: 2026-11-26
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

kcp is a CNCF Sandbox project described as a horizontally scalable control plane for Kubernetes APIs. It hosts many isolated Kubernetes-like API endpoints, called workspaces, without nodes, which separates the API machinery from container orchestration. [sources/research-universal-control-plane](../sources/research-universal-control-plane.md)

## How it works

A provider offers an API to many tenants through APIExport and APIBinding. The project aims at SaaS-style platforms built with technology that platform engineers already know. Its stated ambition is about a million workspaces across 10,000 shards, which the dossier is careful to call a goal and not a measured result.

## Trade-offs

kcp isolates only the API, so it provides no compute and its tooling is less mature than that of namespaces or vcluster. It is still Sandbox maturity. See [comparisons/tenancy-models-namespaces-vcluster-kcp](../comparisons/tenancy-models-namespaces-vcluster-kcp.md), [examples/multi-tenant-api-hosting-with-kcp](../examples/multi-tenant-api-hosting-with-kcp.md), and [findings/immature-abstractions-in-the-control-plane-ecosystem](../findings/immature-abstractions-in-the-control-plane-ecosystem.md).

## Related

[concepts/universal-control-plane](../concepts/universal-control-plane.md), [findings/etcd-scale-limits-of-the-shared-store](../findings/etcd-scale-limits-of-the-shared-store.md)

## Adopters

The kcp ADOPTERS file marks Upbound "Production" and SAP, SNCF Group, Kubermatic, Faros.sh, and KubeStellar "Development", all self-reported. See [examples/upbound-is-the-only-kcp-adopter-marked-production-in-the-adopters-file](../examples/upbound-is-the-only-kcp-adopter-marked-production-in-the-adopters-file.md). [sources/research-gap-g1-named-adopters](../sources/research-gap-g1-named-adopters.md)

## Update from the o5 dossier: CNCF status and generic-controlplane

Update 2026-11-26: cncf.io says kcp was accepted at the Sandbox maturity on 2023-09-19. The latest release read was v0.33.6 (2026-11-04). The kcp-dev/generic-controlplane repository says it is "not yet ready for production use" and aims at a control plane usable without Kubernetes, see [examples/kcp-generic-controlplane-aims-at-an-api-server-without-kubernetes-and-says-it-is-not-ready-for-production](../examples/kcp-generic-controlplane-aims-at-an-api-server-without-kubernetes-and-says-it-is-not-ready-for-production.md). The kcp homepage links a KubeCon EU 2024 talk that was not read. See [findings/no-sig-charter-or-kep-adopts-a-kubernetes-distribution-model-and-the-only-direct-source-is-aenix-s-own-post](../findings/no-sig-charter-or-kep-adopts-a-kubernetes-distribution-model-and-the-only-direct-source-is-aenix-s-own-post.md). [sources/research-gap-o5-kro-ecosystem](../sources/research-gap-o5-kro-ecosystem.md)

## The KubeCon talk transcript (speaker's account)

The KubeCon talk linked from kcp.io, which the o5 update above recorded as not read, is now ingested from an auto-generated transcript. The speaker, Yan Vegas, who says he works for Accenture, describes a workspace as a full Kubernetes API without nodes, pods, or deployments, with the user as cluster admin, created in about a second, against half an hour to an hour for a managed cluster. He says kcp is a single Go binary, can run as a multi-region global control plane with caching layers and aggregated APIs, and lets `v1alpha1` and `v1alpha2` of a CRD be served by different controllers. These are one speaker's spoken claims with no measurement, no tenant count, and no adopter, and the transcript has recognition errors. See [examples/a-kcp-speaker-says-a-workspace-takes-about-a-second-to-create-where-a-managed-cluster-takes-half-an-hour-to-an-hour](../examples/a-kcp-speaker-says-a-workspace-takes-about-a-second-to-create-where-a-managed-cluster-takes-half-an-hour-to-an-hour.md). [sources/kcp-kubecon-talk](../sources/kcp-kubecon-talk.md)

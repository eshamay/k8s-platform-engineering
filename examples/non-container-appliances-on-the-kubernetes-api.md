---
title: Non-container appliances on the Kubernetes API
type: example
status: draft
created: 2026-11-25
updated: 2026-11-26
sources:
  - id: research-universal-control-plane
    hash: 037575049a4c
    ingested: 2026-11-25
  - id: research-gap-o5-kro-ecosystem
    hash: 7905031da128
    ingested: 2026-11-26
aliases: []
tags: [use-case, aenix, distributions, vision]
---

# Non-container appliances on the Kubernetes API

## Scenario

Ænix argues, in an October 2026 opinion post titled "Kubernetes as the Linux kernel", that Kubernetes should be a stable core with purpose-built distributions on top. Its examples do not run containers as their purpose: a router and firewall appliance, a KVM hypervisor, an AI platform, a real-time industrial controller, an IoT gateway speaking Modbus and MQTT, an observability cluster, and a workstation. [sources/research-universal-control-plane](../sources/research-universal-control-plane.md)

## Why it matters

This is the most explicit statement of the [concepts/universal-control-plane](../concepts/universal-control-plane.md) idea, because it treats the API server and controller convention as the product and the container scheduler as optional. The post's reasoning is that complexity which machine learning, network appliances, or industrial controllers need must live somewhere if it does not fit the core project's budget.

## Evidence quality

The dossier calls this a vision with limited production evidence. Ænix lists its own risks: a single small maintaining team, limited production testing, new patching processes, a fleet center that is a single point of failure, and no shell for debugging at 3 a.m. It is unclear whether the model reflects community direction, since no SIG or KEP source was read. See [findings/blast-radius-and-privilege-centralization](../findings/blast-radius-and-privilege-centralization.md).

## Update from the o5 dossier: community direction

Update 2026-11-26: a targeted search found no SIG charter, KEP, or talk adopting a distribution model, so the Aenix view remains one vendor's proposal, see [findings/no-sig-charter-or-kep-adopts-a-kubernetes-distribution-model-and-the-only-direct-source-is-aenix-s-own-post](../findings/no-sig-charter-or-kep-adopts-a-kubernetes-distribution-model-and-the-only-direct-source-is-aenix-s-own-post.md) and [examples/aenix-describes-kuberoot-as-a-small-lab-tested-distribution-positioned-against-k3s-and-k0s](aenix-describes-kuberoot-as-a-small-lab-tested-distribution-positioned-against-k3s-and-k0s.md). [sources/research-gap-o5-kro-ecosystem](../sources/research-gap-o5-kro-ecosystem.md)

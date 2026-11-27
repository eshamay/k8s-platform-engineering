---
title: "Cozystack"
type: entity
status: draft
created: 2026-11-25
updated: 2026-11-26
sources:
  - id: research-landscape
    hash: d28204a90545
    ingested: 2026-11-25
  - id: research-gap-o2-flux-internals
    hash: 866650ffd3aa
    ingested: 2026-11-26
  - id: research-gap-o5-kro-ecosystem
    hash: 7905031da128
    ingested: 2026-11-26
aliases: []
tags: [tool, paas, bare-metal, talos]
---

# Cozystack

Cozystack is a free PaaS framework that turns commodity servers into a cloud offering Kubernetes clusters, databases, and VMs through an API. Its tagline is "Free PaaS platform and framework for building clouds" (https://cozystack.io/docs/). [sources/research-landscape](../sources/research-landscape.md)

## What it is built from

The documentation lists Talos Linux, Kubernetes, KubeVirt, LINSTOR and DRBD, and Kube-OVN as the underlying parts. It targets organizations that want to build their own cloud or cheap development environments. It is not a delivery tool, a provisioning controller for external clouds, or a portal. It is a packaged distribution that includes its own substrate, which is why the dossier calls it a distinct kind of thing. See [examples/cozystack-turns-commodity-servers-into-a-cloud-with-kubernetes-databases-and-vms](../examples/cozystack-turns-commodity-servers-into-a-cloud-with-kubernetes-databases-and-vms.md).

## Related

[concepts/tooling-landscape](../concepts/tooling-landscape.md), [entities/cluster-api](cluster-api.md)

## Flux sharding operator

Cozystack's repository ships a `flux-shard-operator` that creates label-selected helm-controller shards at about 100 HelmReleases per shard. See [examples/cozystack-s-flux-shard-operator-creates-helm-controller-shards-at-about-100-helmreleases-per-shard](../examples/cozystack-s-flux-shard-operator-creates-helm-controller-shards-at-about-100-helmreleases-per-shard.md). [sources/research-gap-o2-flux-internals](../sources/research-gap-o2-flux-internals.md)

## Update from the o5 dossier: Sandbox application closed

Update 2026-11-26: Cozystack's CNCF Sandbox application (cncf/sandbox issue 87) was closed on 2024-08-20, see [examples/the-cozystack-cncf-sandbox-application-issue-87-was-closed-on-2024-08-20-over-governance-and-adopter-concerns](../examples/the-cozystack-cncf-sandbox-application-issue-87-was-closed-on-2024-08-20-over-governance-and-adopter-concerns.md). Cozystack is Aenix's own project, and Aenix's kuberoot proposal is described in [examples/aenix-describes-kuberoot-as-a-small-lab-tested-distribution-positioned-against-k3s-and-k0s](../examples/aenix-describes-kuberoot-as-a-small-lab-tested-distribution-positioned-against-k3s-and-k0s.md). [sources/research-gap-o5-kro-ecosystem](../sources/research-gap-o5-kro-ecosystem.md)

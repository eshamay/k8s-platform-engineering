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
aliases: []
tags: [tool, paas, bare-metal, talos]
---

# Cozystack

Cozystack is a free PaaS framework that turns commodity servers into a cloud offering Kubernetes clusters, databases, and VMs through an API. Its tagline is "Free PaaS platform and framework for building clouds" (https://cozystack.io/docs/). [[sources/research-landscape]]

## What it is built from

The documentation lists Talos Linux, Kubernetes, KubeVirt, LINSTOR and DRBD, and Kube-OVN as the underlying parts. It targets organizations that want to build their own cloud or cheap development environments. It is not a delivery tool, a provisioning controller for external clouds, or a portal. It is a packaged distribution that includes its own substrate, which is why the dossier calls it a distinct kind of thing. See [[examples/cozystack-turns-commodity-servers-into-a-cloud-with-kubernetes-databases-and-vms]].

## Related

[[concepts/tooling-landscape]], [[entities/cluster-api]]

## Flux sharding operator

Cozystack's repository ships a `flux-shard-operator` that creates label-selected helm-controller shards at about 100 HelmReleases per shard. See [[examples/cozystack-s-flux-shard-operator-creates-helm-controller-shards-at-about-100-helmreleases-per-shard]]. [[sources/research-gap-o2-flux-internals]]

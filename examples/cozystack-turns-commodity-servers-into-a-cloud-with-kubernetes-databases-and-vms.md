---
title: "Cozystack turns commodity servers into a cloud with Kubernetes, databases, and VMs"
type: example
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-landscape
    hash: d28204a90545
    ingested: 2026-11-25
aliases: []
tags: [use-case, cozystack, bare-metal, paas]
---

# Cozystack turns commodity servers into a cloud with Kubernetes, databases, and VMs

## Scenario

An organization wants to build its own cloud on commodity hardware, or cheap development environments, and offer Kubernetes clusters, databases, and VMs through an API. [sources/research-landscape](../sources/research-landscape.md)

## How it works

Cozystack packages Talos Linux, Kubernetes, KubeVirt, LINSTOR and DRBD, and Kube-OVN into a free PaaS framework (https://cozystack.io/docs/). Unlike the delivery, provisioning, and portal tools in [concepts/tooling-landscape](../concepts/tooling-landscape.md), it brings its own substrate. The dossier gives no adopter names or measurements for it.

## Related

[entities/cozystack](../entities/cozystack.md), [entities/cluster-api](../entities/cluster-api.md), [examples/cluster-fleet-lifecycle-with-cluster-api](cluster-fleet-lifecycle-with-cluster-api.md)

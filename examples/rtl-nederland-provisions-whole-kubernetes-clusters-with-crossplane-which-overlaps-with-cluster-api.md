---
title: "RTL Nederland provisions whole Kubernetes clusters with Crossplane, which overlaps with Cluster API"
type: example
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-landscape
    hash: d28204a90545
    ingested: 2026-11-25
aliases: []
tags: [use-case, crossplane, cluster-api, adopter, self-reported]
---

# RTL Nederland provisions whole Kubernetes clusters with Crossplane, which overlaps with Cluster API

## Scenario

The Crossplane adopters list says RTL Nederland provisions whole Kubernetes clusters on Azure and AWS with Crossplane. The entry is self-reported and unverified (https://github.com/crossplane/crossplane/blob/main/ADOPTERS.md). [[sources/research-landscape]]

## Why it matters

Cluster provisioning is the home territory of [[entities/cluster-api]], where a management cluster reconciles Cluster and Machine objects through infrastructure, bootstrap, and control-plane providers (https://cluster-api.sigs.k8s.io/user/concepts). RTL's use shows that the provisioning layer has no hard border. A general framework such as [[entities/crossplane]] can create clusters as managed resources, while Cluster API offers cluster-specific kinds such as MachineHealthCheck. The wiki compares the two provider models in [[comparisons/crossplane-providers-versus-cluster-api-providers]].

## Related

[[examples/crossplane-adopters-build-self-service-platforms-and-service-catalogs-on-composite-resources]], [[examples/cluster-fleet-lifecycle-with-cluster-api]], [[concepts/tooling-landscape]]

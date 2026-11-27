---
title: "Crossplane providers versus Cluster API providers"
type: comparison
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-provider
    hash: 7e43edcd71be
    ingested: 2026-11-25
aliases: []
tags: [comparison, crossplane, cluster-api, provider, contract]
---

# Crossplane providers versus Cluster API providers

The word provider means two different things in these tools, and the difference matters when reading documentation. [sources/research-provider](../sources/research-provider.md)

| Aspect | [entities/crossplane](../entities/crossplane.md) provider | [entities/cluster-api](../entities/cluster-api.md) provider |
|---|---|---|
| Purpose | Expose a catalog of external resources as Kubernetes APIs | Implement a contract so the core can build and manage whole clusters |
| Shape | An installable package with CRDs, a controller, and a `ProviderConfig` | Infrastructure, bootstrap, control plane, IPAM, and addon providers |
| Core coupling | The framework supplies a shared managed reconciler | Core controllers stay generic and rely on agreed CRD fields and behaviors |
| Size of the interface | One CRD per external resource type, often hundreds | A small interface for cluster building |
| Typical use | Self-service cloud resources behind a platform API | Lifecycle of Kubernetes clusters on AWS, Azure, vSphere, and other substrates |

## Reading the comparison

The Cluster API documentation says its contract "defines a set of rules a provider is expected to comply with in order to interact with Cluster API." The contract is a narrow interface, whereas a Crossplane provider is a wide catalog. Both still follow the controller pattern, see [concepts/operator-pattern](../concepts/operator-pattern.md), and Cluster API's split between core and provider controllers is described in [comparisons/how-flux-ack-and-cluster-api-split-controllers](how-flux-ack-and-cluster-api-split-controllers.md) and [examples/cluster-api-keeps-core-controllers-generic-with-provider-controllers](../examples/cluster-api-keeps-core-controllers-generic-with-provider-controllers.md). See [concepts/provider](../concepts/provider.md). [sources/research-provider](../sources/research-provider.md)

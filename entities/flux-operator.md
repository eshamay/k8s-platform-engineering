---
title: Flux Operator
type: entity
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-flux-deep-dive
    hash: e640ec8046bc
    ingested: 2026-11-25
aliases: [ControlPlane Flux Operator]
tags: [tool, gitops, flux]
---

# Flux Operator

## What it is

The Flux Operator is a ControlPlane project that installs and manages Flux through a `FluxInstance` resource, so the Flux controllers themselves become declaratively managed objects. The dossier cites its sharding documentation as the example of operator-managed installs versus manual ones. [sources/research-flux-deep-dive](../sources/research-flux-deep-dive.md)

## Sharding

The Flux Operator documentation says it supports "sharding the workload across multiple instances of Flux controllers allowing you to horizontally scale the reconciliation of resources." Shards are declared in the `FluxInstance` spec, and the operator creates the additional controller sets and label selectors that a manual setup would have to build by hand. The labels on the managed objects still have to match.

## Related to this wiki

The ControlPlane D2 reference architecture, which also uses a `FluxInstance`, is described in [examples/flux-d2-gitless-gitops-fleet-with-signed-oci-artifacts](../examples/flux-d2-gitless-gitops-fleet-with-signed-oci-artifacts.md). The dossier also notes that third-party UIs and the Flux Operator weaken the older claim that Flux has no UI, but it did not read a source on that.

## Related

[entities/flux](flux.md), [examples/flux-sharding-splits-reconciliation-across-label-selected-controller-instances](../examples/flux-sharding-splits-reconciliation-across-label-selected-controller-instances.md), [findings/sharded-flux-dependents-must-carry-the-same-shard-label-as-their-parents](../findings/sharded-flux-dependents-must-carry-the-same-shard-label-as-their-parents.md), [comparisons/flux-scaling-options-intervals-concurrency-sharding-and-source-choice](../comparisons/flux-scaling-options-intervals-concurrency-sharding-and-source-choice.md)

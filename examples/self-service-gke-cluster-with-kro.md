---
title: Self-service GKE cluster API with kro
type: example
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-universal-control-plane
    hash: 037575049a4c
    ingested: 2026-11-25
aliases: []
tags: [use-case, kro, platform-api, gcp]
---

# Self-service GKE cluster API with kro

## Scenario

A platform team wants developers to request a GKE cluster without learning the surrounding Google Cloud details. Google's kro announcement describes such an API: the user supplies a name, a node pool, a maximum node count, and a location, while the cluster, node pools, IAM, policies, and service activation stay hidden behind those few parameters. The underlying resources are created through [entities/config-connector](../entities/config-connector.md). [sources/research-universal-control-plane](../sources/research-universal-control-plane.md)

## How it works

A kro ResourceGraphDefinition expands one end-user CRD into a graph of Kubernetes and cloud resources, which kro reconciles as a single unit (see [entities/kro](../entities/kro.md)). The announcement gives a second example, a WebApp API that bundles a deployment, a service, monitoring, and a storage bucket.

## Evidence quality

The source is a vendor announcement from 2025-01-30, and it stated that kro was not production-ready. Crossplane promotes the same self-service pattern for any cloud, but its home page names no customers. No named adopter is documented. See [findings/immature-abstractions-in-the-control-plane-ecosystem](../findings/immature-abstractions-in-the-control-plane-ecosystem.md) and [concepts/composite-resource](../concepts/composite-resource.md).

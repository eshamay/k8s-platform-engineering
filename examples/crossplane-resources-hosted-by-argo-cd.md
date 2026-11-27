---
title: Crossplane resources hosted by Argo CD
type: example
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-gitops-pull-based-delivery
    hash: 335ba8f50b2b
    ingested: 2026-11-25
aliases: []
tags: [gitops, argo-cd, crossplane, cloud-infrastructure]
---

# Crossplane resources hosted by Argo CD

## Scenario

A team keeps databases, buckets, and IAM definitions in Git next to application manifests. Argo CD applies the Crossplane custom resources, and Crossplane's provider controllers call the cloud APIs. This is the clearest documented example of the two-layer loop, in which the GitOps agent reconciles Git into the Kubernetes API and the domain controllers reconcile the API into reality. [sources/research-gitops-pull-based-delivery](../sources/research-gitops-pull-based-delivery.md)

## What the Argo CD side must be told

The Crossplane documentation lists four pieces of configuration for Argo CD. First, Argo CD must use annotation-based resource tracking, so that it recognizes which composed resources it owns. Second, it needs custom Lua health checks for `crossplane.io` and `upbound.io` resources that read the Ready and Synced conditions and async operation status. Third, noisy `ProviderConfigUsage` objects should be excluded, since end users of Crossplane do not need to interact with them. Fourth, the Kubernetes client QPS should be raised to 300 because Crossplane installs many CRDs.

## Why it matters

A generic GitOps agent does not understand custom-resource health or ownership unless it is configured to. Without the health checks the agent reports Healthy while a database is still provisioning, which weakens any sync-wave ordering built on health. See [findings/generic-gitops-agents-cannot-judge-custom-resource-health](../findings/generic-gitops-agents-cannot-judge-custom-resource-health.md), [examples/crossplane-database-claim-reports-synced-and-ready](crossplane-database-claim-reports-synced-and-ready.md), and [entities/crossplane](../entities/crossplane.md).

## Related

[entities/argo-cd](../entities/argo-cd.md), [concepts/gitops-pull-based-delivery](../concepts/gitops-pull-based-delivery.md), [examples/cloud-services-as-kubernetes-objects](cloud-services-as-kubernetes-objects.md)

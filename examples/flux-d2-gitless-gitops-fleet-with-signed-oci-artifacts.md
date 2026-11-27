---
title: Flux D2 gitless GitOps fleet with signed OCI artifacts
type: example
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-gitops-pull-based-delivery
    hash: 335ba8f50b2b
    ingested: 2026-11-25
aliases: []
tags: [gitops, flux, oci, supply-chain, fleet]
---

# Flux D2 gitless GitOps fleet with signed OCI artifacts

## Scenario

ControlPlane's Flux D2 reference architecture targets regulated, multi-tenant fleets that cannot allow clusters to connect directly to a Git host. Instead of pulling from Git, each cluster pulls signed OCI artifacts from a registry. [sources/research-gitops-pull-based-delivery](../sources/research-gitops-pull-based-delivery.md)

## How it works

The fleet is split across three repositories: fleet, infrastructure, and applications. CI builds and signs each of them and pushes them to a registry as OCI artifacts. Each cluster runs a FluxInstance resource provided by the Flux Operator, and ResourceSet templates generate per-tenant resources. The design adds keyless signing, registry RBAC, and admission policy so that the cluster only accepts artifacts it can verify. ControlPlane summarizes the effect as having "decoupled source control from deployment control, while improving auditability and reducing risk."

## What to take from it

The example shows where the pull model is heading for supply-chain-sensitive organizations: the agent still pulls and reconciles, but the thing it pulls from changes from a mutable Git branch to an immutable, signed artifact. The source is a vendor write-up, so the claims about reduced risk are the vendor's own and were not independently verified. See [decisions/git-versus-oci-as-the-canonical-source](../decisions/git-versus-oci-as-the-canonical-source.md) for the trade-off and [entities/flux](../entities/flux.md) for the tool.

## Related

[concepts/gitops-pull-based-delivery](../concepts/gitops-pull-based-delivery.md), [comparisons/push-versus-pull-delivery](../comparisons/push-versus-pull-delivery.md)

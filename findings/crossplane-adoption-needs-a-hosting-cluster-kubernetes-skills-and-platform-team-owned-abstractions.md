---
title: Crossplane adoption needs a hosting cluster, Kubernetes skills, and platform-team-owned abstractions
type: finding
status: draft
created: 2026-11-25
updated: 2026-11-26
sources:
  - id: medium-terraform-opentofu-crossplane
    hash: 13ec64862460
    ingested: 2026-11-26
  - id: research-crossplane-deep-dive
    hash: 44034359219f
    ingested: 2026-11-25
aliases: []
tags: [pitfall, crossplane, adoption, cost, terraform]
---

# Crossplane adoption needs a hosting cluster, Kubernetes skills, and platform-team-owned abstractions

## Observation

Three independent sources in the dossier name the same cost of adopting Crossplane. Encore, a competitor, writes that "Crossplane needs a running Kubernetes cluster as its control plane, even when the resources it provisions have nothing to do with Kubernetes." The Crossplane project's own comparison with Terraform concedes that Terraform is simpler and more familiar and that Crossplane requires Kubernetes expertise. SuperOrbital's 2022 evaluation concludes that the effort is large and needs deep Kubernetes skill, and says the platform team must own the abstractions, the observability, and the troubleshooting across layers. [[sources/research-crossplane-deep-dive]]

## Why it matters

A team that does not already run Kubernetes pays for a cluster, its upgrades, and its on-call burden before provisioning a single bucket. A team that does run Kubernetes still has to write and maintain Compositions, which are a product the platform team supports. The always-on reconciliation that gives Crossplane its drift correction (see [[concepts/self-healing-and-drift-detection]]) is the same property that makes the control plane a production dependency.

## Mitigations and caveats

The Encore source sells a competing product, and the Crossplane blog is advocacy, so the cost is best read as a point on which the critic and the project agree. For teams that already operate Kubernetes, the cost is mostly authoring effort, which functions and the guidance in [[findings/oversized-compositions-and-cloud-shaped-apis-make-platform-apis-hard-to-use]] address. The single-cloud operators in [[comparisons/crossplane-versus-cloud-vendor-add-ons-ack-config-connector-and-aso]] still need a cluster but avoid the authoring layer. See also [[comparisons/crossplane-versus-terraform-reconciliation-versus-plan-and-apply]] and [[findings/immature-abstractions-in-the-control-plane-ecosystem]].

## A Terraform user's view of the same costs (secondary)

A Medium post by Gavin Yap (2025-01-10) describes the same costs from a non-user's side: a Kubernetes cluster with its Day 2 work, a portal such as Backstage for self-service, and several days of setup against under an hour for Terraform or OpenTofu. The estimates are his own and untested, and the post says its author has not used Crossplane extensively. [[sources/medium-terraform-opentofu-crossplane]]

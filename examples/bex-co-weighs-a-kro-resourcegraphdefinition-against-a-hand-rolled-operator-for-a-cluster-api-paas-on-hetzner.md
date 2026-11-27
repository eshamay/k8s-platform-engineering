---
title: bex.co weighs a kro ResourceGraphDefinition against a hand-rolled operator for a Cluster API PaaS on Hetzner
type: example
status: draft
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: bex-co-kro-radar-post
    hash: 748c0bc7495e
    ingested: 2026-11-26
aliases: []
tags: [kro, cluster-api, hetzner, paas, build-versus-compose, secondary-source]
---

# bex.co weighs a kro ResourceGraphDefinition against a hand-rolled operator for a Cluster API PaaS on Hetzner

> [!NOTE]
> **Evidence grade:** Secondary and an evaluation, not an adoption. The source is a 2026-07-29 company blog post by Dora Noda, https://bex.co/blog/2026/07/29/kro-kube-resource-orchestrator-cncf-radar-adopt. The post does not say bex runs kro.

## Scenario

bex.co describes itself in the post as a git-push platform as a service built on Cluster API, with Hetzner bare metal as the substrate (the post names the Cluster API providers CAPH for Hetzner and CAPMox for Proxmox). Such a platform needs a tenant-facing "deploy this app" API that expands into a Deployment, a Service, an Ingress or Gateway route, TLS material, and other objects. The post asks what it would cost to build that API as a kro ResourceGraphDefinition instead of a hand-rolled controller. [[sources/bex-co-kro-radar-post]]

## What the author concludes

The author says an RGD would replace hundreds of lines of Go reconcile logic with a schema and templates, and that kro would infer ordering from the CEL references. The author then lists the gaps that keep the decision open. The API is `v1alpha1` with no stability promise. kro does not create clusters, so Cluster API still supplies them. There is no built-in model for per-tenant TLS or custom domains, so the platform must write that logic in its RGD. kro's portability across GKE, EKS, and AKS is wasted on a single-substrate fleet. kro's type check covers only schemas it can see, so platform-specific CRD fields need their own validation. The recommendation is to start with a non-critical abstraction, watch how the alpha API evolves, and keep a hand-rolled controller as the fallback for the TLS and domain parts. [[sources/bex-co-kro-radar-post]]

## How it fits the wiki

This is a worked statement of the build-or-compose choice in [[decisions/build-a-custom-operator-or-compose-existing-resources]] and [[comparisons/hand-written-operator-versus-crossplane-composition-versus-kro]], told by a team that has not yet chosen. It matches the layering in [[entities/cluster-api]] and [[entities/kro]], where kro composes objects on a cluster that something else created. Because it is an opinion from one company that sells a platform, it is a view of the trade-offs and not a measurement, and it should not be cited as an adopter of kro.

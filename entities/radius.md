---
title: Radius
type: entity
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-kro-and-abstraction-models
    hash: d43d3775cbbd
    ingested: 2026-11-25
aliases: [Radius application platform]
tags: [tool, application-platform, recipes, abstraction]
---

# Radius

Radius is an application-definition platform in which developers describe an application and its backing resources, and platform engineers decide through Recipes what each resource type becomes in each environment. Everything in this page is secondary evidence. [[sources/research-kro-and-abstraction-models]]

## What the source says

A third-party review (https://devopsboys.com/blog/radius-application-platform-kubernetes-review-2026) describes Radius as originating at Microsoft and being a CNCF Sandbox project since 2024. Developers describe containers, databases, and connections between them, and they ask for "a Redis cache" without saying how it is built. Platform engineers supply Recipes that map that request to a concrete implementation per environment. The review lists these strengths: the connection model, development and production parity, and a dependency graph. It lists these limits: a dependency on Bicep, an Azure lean, its own control plane, and early maturity. [[sources/research-kro-and-abstraction-models]]

## Position among abstraction models

Radius is server-side, like Crossplane and kro, but it sits higher in the stack: its user-facing vocabulary is an application and its connections and not a platform-defined CRD. That makes it closest in intent to Score, with the difference that Score generates manifests and Radius runs a control plane. See [[comparisons/score-versus-radius-as-developer-facing-workload-abstractions]] and [[comparisons/render-time-versus-controller-driven-abstraction-helm-kustomize-kpt-score-crossplane-kro-and-radius]].

## Evidence caveat

The primary Radius documentation could not be read in the research run (an empty scrape, then a 404 on retry), so the CNCF status, maturity, and Azure lean are all unverified. See [[findings/radius-maturity-and-governance-claims-rest-on-a-single-third-party-blog]] and [[open-knowledge-gaps]].

## Related

[[entities/score]], [[entities/crossplane]], [[entities/kro]]

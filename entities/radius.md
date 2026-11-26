---
title: Radius
type: entity
status: active
created: 2026-11-25
updated: 2026-11-26
sources:
  - id: research-kro-and-abstraction-models
    hash: d43d3775cbbd
    ingested: 2026-11-25
  - id: research-gap-o6-platform-landscape
    hash: caa824f6fb9e
    ingested: 2026-11-26
aliases: [Radius application platform]
tags: [tool, application-platform, recipes, abstraction]
---

# Radius

Radius is an application-definition platform in which developers describe an application and its backing resources, and platform engineers decide through Recipes what each resource type becomes in each environment. The first sections of this page rest on a third-party review, and the primary-source section below adds repository and CNCF listing evidence. [[sources/research-kro-and-abstraction-models]]

## What the source says

A third-party review (https://devopsboys.com/blog/radius-application-platform-kubernetes-review-2026) describes Radius as originating at Microsoft and being a CNCF Sandbox project since 2024. Developers describe containers, databases, and connections between them, and they ask for "a Redis cache" without saying how it is built. Platform engineers supply Recipes that map that request to a concrete implementation per environment. The review lists these strengths: the connection model, development and production parity, and a dependency graph. It lists these limits: a dependency on Bicep, an Azure lean, its own control plane, and early maturity. [[sources/research-kro-and-abstraction-models]]

## Position among abstraction models

Radius is server-side, like Crossplane and kro, but it sits higher in the stack: its user-facing vocabulary is an application and its connections and not a platform-defined CRD. That makes it closest in intent to Score, with the difference that Score generates manifests and Radius runs a control plane. See [[comparisons/score-versus-radius-as-developer-facing-workload-abstractions]] and [[comparisons/render-time-versus-controller-driven-abstraction-helm-kustomize-kpt-score-crossplane-kro-and-radius]].

## Evidence caveat

The primary Radius documentation site (radapp.io) could not be read in the first research run and was not read in the later one either. The CNCF status is now verified from primary listings, see below. The Bicep dependency and the Azure lean remain the third-party review's claims. [[findings/radius-maturity-and-governance-claims-rest-on-a-single-third-party-blog]] is marked contradicted for the status claims, and [[open-knowledge-gaps]] tracks the rest.

## Related

[[entities/score]], [[entities/crossplane]], [[entities/kro]]

## Primary-source status (o6 dossier)

Radius is a CNCF Sandbox project, accepted 2024-04-16 per the CNCF landscape file, and the sandbox issue passed its vote, see [[findings/radius-and-score-are-both-cncf-sandbox-projects-per-the-landscape-file-and-both-passed-sandbox-votes]]. Its four listed maintainers are all Microsoft employees, the main repository's GOVERNANCE.md holds only a code-of-conduct pointer, and only the newest minor channel is supported, see [[findings/all-four-radius-maintainers-are-microsoft-employees-and-only-the-newest-minor-channel-is-supported]] and [[examples/radius-v0-62-0-was-released-on-2026-10-27-with-breaking-changes-and-one-supported-channel]]. The README says Radius "runs on Kubernetes and deploys applications across local, private cloud, Microsoft Azure, and Amazon Web Services environments". Correction note: the earlier "Azure lean" wording is the review's, and the README names both Azure and AWS as targets. [[sources/research-gap-o6-platform-landscape]]

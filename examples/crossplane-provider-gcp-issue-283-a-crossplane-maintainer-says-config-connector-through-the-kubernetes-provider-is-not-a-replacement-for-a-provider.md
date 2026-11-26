---
title: "Crossplane provider-gcp issue 283 a Crossplane maintainer says Config Connector through the Kubernetes provider is not a replacement for a provider"
type: example
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-o4-config-connector-ack
    hash: c0d708f1d445
    ingested: 2026-11-26
aliases: [provider-gcp issue 283]
tags: [crossplane, config-connector, provider-gcp, vendor-position, issue]
---

# Crossplane provider-gcp issue 283 a Crossplane maintainer says Config Connector through the Kubernetes provider is not a replacement for a provider

## Scenario

Issue 283 in `crossplane-contrib/provider-gcp` was opened on 2020-12-02 and was still open when read on 2026-11-26. It is the longest direct exchange the dossier found between the two projects. URL: https://github.com/crossplane-contrib/provider-gcp/issues/283 [[sources/research-gap-o4-config-connector-ack]]

Crossplane's lead maintainer (association member) wrote: "we feel that a purpose built Crossplane provider offers a better experience for our community", citing consistency of the Crossplane resource model across providers. In a comment dated 2022-06-24 he accepted that Config Connector can be used through the Kubernetes provider but said "I don't think it's sufficient as a replacement for a \"true\" Crossplane provider." (The dossier's verification pass corrected the date from 2021 to 2022-06-24.)

The same issue's author, a commenter with association none, said on the same date that Config Connector is open source, partly built on a DCL and the Terraform provider, and that "I assume we could use Config Connector resources in Crossplane compositions using the Kubernetes provider." That statement is SECONDARY-ONLY, an assumption restated from repositories.

## Evidence strength

One side is a vendor-maintainer opinion, not a neutral assessment, and the other is a commenter's assumption. Neither measured anything. See [[findings/no-neutral-comparison-of-config-connector-and-crossplane-was-found-so-the-evidence-is-two-vendor-positions]].

## Lesson

The disagreement is about where the abstraction boundary sits, not about a defect. The options it implies are laid out in [[decisions/use-config-connector-directly-wrap-it-in-crossplane-through-the-kubernetes-provider-or-use-a-crossplane-gcp-provider]].

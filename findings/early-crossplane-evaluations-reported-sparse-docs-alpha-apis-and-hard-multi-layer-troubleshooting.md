---
title: Early Crossplane evaluations reported sparse docs, alpha APIs, and hard multi-layer troubleshooting
type: finding
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-crossplane-deep-dive
    hash: 44034359219f
    ingested: 2026-11-25
aliases: []
tags: [pitfall, crossplane, maturity, historical, troubleshooting]
---

# Early Crossplane evaluations reported sparse docs, alpha APIs, and hard multi-layer troubleshooting

> [!NOTE]
> The evidence is a 2022 consultancy evaluation. Several of its gaps have since been addressed, so read this page as historical context and not as the current state.

## Observation

SuperOrbital's 2022 case study, written by Sean Kane, evaluated an early Crossplane and found sparse documentation, uneven provider coverage between native providers and Terrajet-generated ones, mostly alpha or beta APIs, no dry run, and hard troubleshooting across the layers from composite resource to managed resource to cloud API. Its summary line was "Adopting it today is similar to adopting Docker in 2013." [[sources/research-crossplane-deep-dive]]

## What has changed since

The dossier points to composition functions and CNCF graduation as the main responses. The project's graduation post and InfoQ present graduation as a maturity signal, with a security audit and vendor-neutral governance required, and the wiki notes the self-reported adopter counts in [[examples/crossplane-adopters-report-managed-resource-counts-from-thousands-to-two-hundred-thousand]]. Generated providers are now covered by [[entities/upjet]], and the shared-behavior risk is recorded in [[findings/generated-provider-catalogs-inherit-the-behavior-and-bugs-of-their-generator]].

## What may still apply

The dossier cannot confirm that dry run, documentation depth, or multi-layer troubleshooting are solved. Provider management policies are still beta in the documentation read. The broader pattern of pre-1.0 and Sandbox tools is in [[findings/immature-abstractions-in-the-control-plane-ecosystem]], and layered status that hides failures is in [[findings/two-reconcile-loops-hide-status-and-drift-at-two-layers]]. A current evaluation would be needed to retire this finding.

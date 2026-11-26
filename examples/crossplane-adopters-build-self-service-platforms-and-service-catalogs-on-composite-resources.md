---
title: Crossplane adopters build self-service platforms and service catalogs on composite resources
type: example
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-composite-resource
    hash: 8640896d06b9
    ingested: 2026-11-25
aliases: []
tags: [crossplane, adopters, self-service, internal-developer-platform, service-catalog]
---

# Crossplane adopters build self-service platforms and service catalogs on composite resources

## Scenario

Self-service infrastructure APIs are the dominant use case that the dossier found for composite resources. The Crossplane adopters list names organizations that put composite resources between application teams and raw cloud resources. [[sources/research-composite-resource]]

## What the adopters report

Renault lists XRDs and compositions as an abstraction layer for Kubernetes platform services. Wellhub, Wildlife Studios, Splash, and Millennium bcp offer self-service provisioning to engineers, and the Millennium bcp entry reads "Self-service platform for end-to-end application (and dependant resources) lifecycle." Grafana Labs and Consensys run internal developer platforms, and Autodesk uses declarative API abstractions for a unified control plane. Deutsche Kreditbank reports managing more than 10 EKS clusters with Crossplane. Continental provides self-service ephemeral vclusters to developers.

A second pattern treats each composite kind as a product. VSHN's AppCat is listed as a cloud-native marketplace powered by Crossplane, and Syntasso lists Crossplane as an optional subcomponent of Kratix. In both cases the platform team publishes a catalog of composite kinds and other teams consume them. URL: https://github.com/crossplane/crossplane/blob/main/ADOPTERS.md.

## Limits of the evidence

The entries are short, self-reported, and unaudited. They show what organizations are building, not how it performed, and none gives object counts for composites specifically. For the managed-resource layer under these platforms, and for the larger counts that adopters report, see [[examples/crossplane-adopters-report-managed-resource-counts-from-thousands-to-two-hundred-thousand]]. The wiki still lacks named postmortems or case studies, as tracked in [[open-knowledge-gaps]]. See also [[examples/platform-team-self-service-apis-with-crossplane-and-kro]] and [[concepts/composite-resource]].

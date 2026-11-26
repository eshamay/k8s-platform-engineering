---
title: "Kratix Promises scatter workloads across standard, PCI, and Terraform destinations"
type: example
status: draft
created: 2026-11-25
updated: 2026-11-26
sources:
  - id: research-landscape
    hash: d28204a90545
    ingested: 2026-11-25
  - id: research-gap-o6-platform-landscape
    hash: caa824f6fb9e
    ingested: 2026-11-26
aliases: []
tags: [use-case, kratix, multi-cluster, pci, vendor-claim]
---

# Kratix Promises scatter workloads across standard, PCI, and Terraform destinations

## Scenario

A financial-services style organization needs multi-cluster segmentation, where regulated workloads such as PCI DSS ones run on a separate cluster from ordinary workloads. This is Syntasso's own example, so it is a vendor illustration and not an independent case study. [[sources/research-landscape]]

## How it works

A Promise exposes one self-service API to application teams. Using Destinations, Kratix schedules the resulting workloads across a standard cluster, a PCI DSS cluster, and a Terraform destination, so the requester does not choose the target (https://www.syntasso.io/post/kratix-backstage-upgrade-your-portal-to-a-platform). Syntasso claims progressive disclosure keeps cognitive load low, and it links NatWest, The Access Group, and Veeam as case studies that the dossier did not read. How Destinations and the GitStateStore work is described in the section below.

## Related

[[entities/kratix]], [[entities/backstage]], [[comparisons/backstage-versus-port-versus-kratix-as-portal-and-orchestration-layers]]

## How the routing works (o6 dossier)

The vendor's illustration is consistent with the documented rules. Destinations carry labels, a Promise's `spec.destinationSelectors` match them in the first stage, and a Destination with `strictMatchLabels: true` accepts only Promises whose selectors match its labels, which is the documented way to keep ordinary workloads off a PCI cluster. In the second stage a Resource workflow's output goes to a matching Destination, chosen at random if several match, unless a `destination-selectors.yaml` file narrows it, with precedence Promise selectors, Promise workflow, then Resource workflow. The Terraform destination works because a Destination is any system an external tool reconciles from the state store. See [[findings/kratix-schedules-in-two-stages-by-label-matching-and-picks-a-destination-at-random-when-several-match]] and [[findings/a-kratix-destination-writes-dependencies-and-resources-directories-and-its-filepath-mode-is-immutable]]. The example remains a vendor illustration, and the scheduler code was not read. [[sources/research-gap-o6-platform-landscape]]

---
title: "Kratix Promises scatter workloads across standard, PCI, and Terraform destinations"
type: example
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-landscape
    hash: d28204a90545
    ingested: 2026-11-25
aliases: []
tags: [use-case, kratix, multi-cluster, pci, vendor-claim]
---

# Kratix Promises scatter workloads across standard, PCI, and Terraform destinations

## Scenario

A financial-services style organization needs multi-cluster segmentation, where regulated workloads such as PCI DSS ones run on a separate cluster from ordinary workloads. This is Syntasso's own example, so it is a vendor illustration and not an independent case study. [[sources/research-landscape]]

## How it works

A Promise exposes one self-service API to application teams. Using Destinations, Kratix schedules the resulting workloads across a standard cluster, a PCI DSS cluster, and a Terraform destination, so the requester does not choose the target (https://www.syntasso.io/post/kratix-backstage-upgrade-your-portal-to-a-platform). Syntasso claims progressive disclosure keeps cognitive load low, and it links NatWest, The Access Group, and Veeam as case studies that the dossier did not read. How Destinations and the GitStateStore actually work was not retrieved.

## Related

[[entities/kratix]], [[entities/backstage]], [[comparisons/backstage-versus-port-versus-kratix-as-portal-and-orchestration-layers]]

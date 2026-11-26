---
title: "Kratix"
type: entity
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-landscape
    hash: d28204a90545
    ingested: 2026-11-25
aliases: []
tags: [tool, platform-framework, promise, syntasso]
---

# Kratix

Kratix is an orchestration framework from Syntasso that sits behind a developer portal. Its central object is the Promise, a contract between platform and application teams that bundles a self-service API, embedded workflows, and fleet management. [[sources/research-landscape]]

## Mechanics as documented

The documentation says Kratix "lets you offer everything as-a-service via clear APIs, which can easily be exposed through developer portals like Backstage" (https://docs.kratix.io/). Pipelines combine provisioning, deployments, and compliance steps. The Destination and GitStateStore concepts that decide where output is written were not in the fetched excerpt, so the wiki does not describe them.

## Vendor claims

Syntasso's blog argues that a portal gives only visibility and that Kratix adds Promises and workflows so developers stop waiting on tickets, and it claims progressive disclosure limits cognitive load. It mentions NatWest, The Access Group, and Veeam as case studies by link only. The source is a vendor blog, so these are attributed claims. See [[examples/kratix-promises-scatter-workloads-across-standard-pci-and-terraform-destinations]].

## Related

[[concepts/tooling-landscape]], [[entities/backstage]], [[concepts/composite-resource]], [[comparisons/backstage-versus-port-versus-kratix-as-portal-and-orchestration-layers]]

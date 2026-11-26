---
title: "Kratix"
type: entity
status: active
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
tags: [tool, platform-framework, promise, syntasso]
---

# Kratix

Kratix is an orchestration framework from Syntasso that sits behind a developer portal. Its central object is the Promise, a contract between platform and application teams that bundles a self-service API, embedded workflows, and fleet management. [[sources/research-landscape]]

## Mechanics as documented

The documentation says Kratix "lets you offer everything as-a-service via clear APIs, which can easily be exposed through developer portals like Backstage" (https://docs.kratix.io/). Pipelines combine provisioning, deployments, and compliance steps. The Destination and GitStateStore concepts that decide where output is written were not in the first fetched excerpt, and the section below now describes them from the Kratix reference documentation.

## Vendor claims

Syntasso's blog argues that a portal gives only visibility and that Kratix adds Promises and workflows so developers stop waiting on tickets, and it claims progressive disclosure limits cognitive load. It mentions NatWest, The Access Group, and Veeam as case studies by link only. The source is a vendor blog, so these are attributed claims. See [[examples/kratix-promises-scatter-workloads-across-standard-pci-and-terraform-destinations]].

## Related

[[concepts/tooling-landscape]], [[entities/backstage]], [[concepts/composite-resource]], [[comparisons/backstage-versus-port-versus-kratix-as-portal-and-orchestration-layers]]

## Destinations and GitStateStores (o6 dossier)

A Destination is a cluster-scoped record of "a system that Kratix can write documents to", and an external tool such as Flux or Argo CD reconciles what Kratix writes, see [[findings/a-kratix-destination-writes-dependencies-and-resources-directories-and-its-filepath-mode-is-immutable]]. A GitStateStore or BucketStateStore holds the location and credentials. Scheduling is label matching in two stages, with random selection among several matching Destinations, see [[findings/kratix-schedules-in-two-stages-by-label-matching-and-picks-a-destination-at-random-when-several-match]]. The GitStateStore Go type says its `insecure` field defaults to true when unset, see [[findings/the-kratix-gitstatestore-insecure-field-defaults-to-true-when-unset-in-the-go-type]]. The scheduler source code was not read. [[sources/research-gap-o6-platform-landscape]]

---
title: "The TeraSky Kubernetes Ingestor ingests Crossplane claims and kro instances into the Backstage catalog"
type: example
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-o6-platform-landscape
    hash: caa824f6fb9e
    ingested: 2026-11-26
aliases: [TeraSky Backstage plugins]
tags: [backstage, terasky, crossplane, kro, catalog, community-plugin, secondary-only]
---

# The TeraSky Kubernetes Ingestor ingests Crossplane claims and kro instances into the Backstage catalog

## Scenario

A platform team publishes APIs as Crossplane XRDs and kro ResourceGraphDefinitions and wants the instances to appear in a Backstage catalog without hand-written entity files. [[sources/research-gap-o6-platform-landscape]]

## How it works

The `TeraSky-OSS/backstage-plugins` repository (https://github.com/TeraSky-OSS/backstage-plugins, read 2026-11-26) holds 53 plugins, built and tested against Backstage 1.56.0, with a last push on 2026-11-20. One of them, the Kubernetes Ingestor, is described as "a catalog entity provider which creates catalog entities directly from kubernetes resources". It can "auto-ingest all crossplane claims and KRO instances automatically as components" and can generate Backstage templates for every XRD's claim type. Crossplane and kro resource plugins exist alongside it. This is a controller-like sync loop in the Backstage backend, running from cluster to catalog. The evidence is SECONDARY-ONLY because it is the plugin's own README, maintained by a vendor community and not by the Backstage project. The upstream `backstage/community-plugins` repository has no workspace named crossplane or kro. [[sources/research-gap-o6-platform-landscape]]

## Related

[[entities/backstage]], [[findings/the-backstage-scaffolder-is-a-one-shot-task-runner-and-the-nearest-operator-style-integration-is-a-third-party-plugin]], [[entities/crossplane]], [[entities/kro]]

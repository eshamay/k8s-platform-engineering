---
title: "Backstage"
type: entity
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-landscape
    hash: d28204a90545
    ingested: 2026-11-25
aliases: []
tags: [tool, portal, catalog, cncf]
---

# Backstage

Backstage is a developer portal framework from Spotify and a CNCF incubating project. It provides a software catalog, software templates (the scaffolder), TechDocs, and a plugin ecosystem. [[sources/research-landscape]]

## What it does and does not do

Backstage is a user interface and metadata layer, not a provisioner. Real provisioning happens in whatever the templates call, such as a GitOps repository, a pipeline, or a Kubernetes API served by [[entities/crossplane]] or [[entities/kratix]]. The source quotes its mission as "Backstage restores order to your microservices and infrastructure and enables your product teams to ship high-quality code quickly" (https://backstage.io/docs/overview/what-is-backstage).

## Pitfall

A portal alone leaves a gap between seeing and doing. Syntasso argues that developers still wait on tickets unless a provisioning layer sits behind the portal, which is a vendor claim, see [[findings/a-portal-alone-gives-visibility-but-not-provisioning-so-ticket-queues-can-persist-according-to-a-kratix-vendor]].

## Open points

How Backstage consumes custom resources and CRDs is not covered by this dossier, see [[open-knowledge-gaps]].

## Related

[[concepts/tooling-landscape]], [[entities/port]], [[comparisons/backstage-versus-port-versus-kratix-as-portal-and-orchestration-layers]]

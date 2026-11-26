---
title: "Backstage versus Port versus Kratix as portal and orchestration layers"
type: comparison
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-landscape
    hash: d28204a90545
    ingested: 2026-11-25
aliases: []
tags: [comparison, portal, backstage, port, kratix, vendor-claim]
---

# Backstage versus Port versus Kratix as portal and orchestration layers

Backstage and Port are portals, and Kratix is an orchestration framework that sits behind one. The Port and Kratix pages are vendor sources, so their comparative statements are attributed claims. [[sources/research-landscape]]

| Aspect | [[entities/backstage]] | [[entities/port]] | [[entities/kratix]] |
|---|---|---|---|
| Kind | Open-source portal framework, CNCF incubating, from Spotify | Commercial SaaS portal | Orchestration framework from Syntasso |
| Core model | Software catalog, templates (scaffolder), TechDocs, plugins | Blueprints, entities, self-service actions | Promises with an API, workflows, and fleet scheduling |
| Provisions resources | No, calls whatever the templates call | Through integrations and actions | Yes, through pipelines and Destinations |
| Positioning claim | Restores order to microservices and infrastructure | More automation and AI-agent oriented than Backstage | A portal alone leaves tickets, so add Promises behind it |

## Reading the comparison

The Kratix documentation explicitly expects Backstage in front of it, so the two are complementary and not rivals. Port and Backstage compete directly, and the only comparison in the dossier is Port's own. No independent comparison was found, see [[findings/landscape-comparisons-of-argo-cd-flux-port-and-kratix-come-from-vendors-with-no-independent-benchmarks]] and [[findings/a-portal-alone-gives-visibility-but-not-provisioning-so-ticket-queues-can-persist-according-to-a-kratix-vendor]].

## Related

[[concepts/tooling-landscape]], [[comparisons/delivery-versus-provisioning-versus-platform-layers-in-the-kubernetes-tooling-landscape]]

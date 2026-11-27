---
title: "Backstage versus Port versus Kratix as portal and orchestration layers"
type: comparison
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
tags: [comparison, portal, backstage, port, kratix, vendor-claim]
---

# Backstage versus Port versus Kratix as portal and orchestration layers

Backstage and Port are portals, and Kratix is an orchestration framework that sits behind one. The Port and Kratix pages are vendor sources, so their comparative statements are attributed claims. [sources/research-landscape](../sources/research-landscape.md)

| Aspect | [entities/backstage](../entities/backstage.md) | [entities/port](../entities/port.md) | [entities/kratix](../entities/kratix.md) |
|---|---|---|---|
| Kind | Open-source portal framework, CNCF incubating, from Spotify | Commercial SaaS portal | Orchestration framework from Syntasso |
| Core model | Software catalog, templates (scaffolder), TechDocs, plugins | Blueprints, entities, self-service actions | Promises with an API, workflows, and fleet scheduling |
| Provisions resources | No, calls whatever the templates call | Through integrations and actions | Yes, through pipelines and Destinations |
| Positioning claim | Restores order to microservices and infrastructure | More automation and AI-agent oriented than Backstage | A portal alone leaves tickets, so add Promises behind it |

## Reading the comparison

The Kratix documentation explicitly expects Backstage in front of it, so the two are complementary and not rivals. Port and Backstage compete directly, and the only comparison in the dossier is Port's own. No independent comparison was found, see [findings/landscape-comparisons-of-argo-cd-flux-port-and-kratix-come-from-vendors-with-no-independent-benchmarks](../findings/landscape-comparisons-of-argo-cd-flux-port-and-kratix-come-from-vendors-with-no-independent-benchmarks.md) and [findings/a-portal-alone-gives-visibility-but-not-provisioning-so-ticket-queues-can-persist-according-to-a-kratix-vendor](../findings/a-portal-alone-gives-visibility-but-not-provisioning-so-ticket-queues-can-persist-according-to-a-kratix-vendor.md).

## Related

[concepts/tooling-landscape](../concepts/tooling-landscape.md), [comparisons/delivery-versus-provisioning-versus-platform-layers-in-the-kubernetes-tooling-landscape](delivery-versus-provisioning-versus-platform-layers-in-the-kubernetes-tooling-landscape.md)

## Integration shapes (o6 dossier)

Two documented shapes connect these tools. Kratix's Destination documentation names a Backstage catalog filled from a Git repository as a use case, so Git is the hand-off, see [findings/a-kratix-destination-writes-dependencies-and-resources-directories-and-its-filepath-mode-is-immutable](../findings/a-kratix-destination-writes-dependencies-and-resources-directories-and-its-filepath-mode-is-immutable.md). The third-party TeraSky Kubernetes Ingestor instead syncs Crossplane claims and kro instances from the cluster into the Backstage catalog, see [examples/the-terasky-kubernetes-ingestor-ingests-crossplane-claims-and-kro-instances-into-the-backstage-catalog](../examples/the-terasky-kubernetes-ingestor-ingests-crossplane-claims-and-kro-instances-into-the-backstage-catalog.md). The Backstage Scaffolder is a run-once task runner, see [findings/the-backstage-scaffolder-is-a-one-shot-task-runner-and-the-nearest-operator-style-integration-is-a-third-party-plugin](../findings/the-backstage-scaffolder-is-a-one-shot-task-runner-and-the-nearest-operator-style-integration-is-a-third-party-plugin.md). [sources/research-gap-o6-platform-landscape](../sources/research-gap-o6-platform-landscape.md)

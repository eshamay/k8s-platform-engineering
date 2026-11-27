---
title: Hand-written operator versus Crossplane composition versus kro
type: comparison
status: draft
created: 2026-11-25
updated: 2026-11-26
sources:
  - id: bex-co-kro-radar-post
    hash: 748c0bc7495e
    ingested: 2026-11-26
  - id: research-operator-pattern
    hash: eab72eca2e1b
    ingested: 2026-11-25
  - id: research-composite-resource
    hash: 8640896d06b9
    ingested: 2026-11-25
aliases: []
tags: [operators, crossplane, kro, abstraction]
---

# Hand-written operator versus Crossplane composition versus kro

| Dimension | Hand-written operator | Crossplane Composition | kro ResourceGraphDefinition |
|---|---|---|---|
| Where the logic lives | Go or another language, scaffolded with Kubebuilder or Operator SDK | A pipeline of functions configured in a Composition | CEL expressions in a declarative graph |
| API definition | CRD authored with the controller | XRD for a composite resource | Schema in the definition, with a CRD generated at runtime |
| Controller code to maintain | All of it | None for the composition, functions as needed | None |
| Best fit | Domain logic such as backup, failover, and schema migration | Mapping a platform API onto managed cloud resources | Composing existing resources into one API |

[sources/research-operator-pattern](../sources/research-operator-pattern.md)

## Reading the table

The dossier presents the two composition tools as alternatives to bespoke controllers when the custom API is mostly composition. A hand-written operator remains the right tool when the runbook needs arbitrary logic, such as database failover, which composition cannot express. The dossier does not compare Crossplane and kro in depth. See [comparisons/crossplane-xrds-versus-kro-resourcegraphdefinitions-as-crd-generators](crossplane-xrds-versus-kro-resourcegraphdefinitions-as-crd-generators.md) and [comparisons/ordering-models-flux-argo-cd-kro-crossplane](ordering-models-flux-argo-cd-kro-crossplane.md).

## Related

[decisions/build-a-custom-operator-or-compose-existing-resources](../decisions/build-a-custom-operator-or-compose-existing-resources.md), [findings/hand-written-operators-duplicate-what-composition-could-express](../findings/hand-written-operators-duplicate-what-composition-could-express.md), [entities/crossplane](../entities/crossplane.md), [entities/kro](../entities/kro.md), [entities/kubebuilder](../entities/kubebuilder.md)

## Update from the composite resources dossier

The two composition tools are now compared in depth in [comparisons/crossplane-composition-functions-versus-kro-resource-graph-execution-models](crossplane-composition-functions-versus-kro-resource-graph-execution-models.md), and Helm is added as a third altitude in [comparisons/helm-versus-kro-versus-crossplane-as-platform-abstraction-layers](helm-versus-kro-versus-crossplane-as-platform-abstraction-layers.md). The dossier reports that `function-kro` lets kro-style graphs run inside a Crossplane pipeline, so the choice is no longer strictly either-or, see [decisions/choose-kro-crossplane-or-both-for-a-platform-abstraction-layer](../decisions/choose-kro-crossplane-or-both-for-a-platform-abstraction-layer.md). [sources/research-composite-resource](../sources/research-composite-resource.md)

## A secondary three-way table from bex.co

A bex.co post (2026-07-29) gives the same three-way comparison as an opinion table. A hand-rolled operator has the highest cost per new resource type, Crossplane Compositions need a heavier control plane and are strongest for external cloud resources, and a kro RGD needs only YAML and CEL but has an alpha API and composes only Kubernetes objects. The table is the author's view with no measurement behind it, and it agrees with the stronger dossiers cited above. [sources/bex-co-kro-radar-post](../sources/bex-co-kro-radar-post.md)

---
title: Hand-written operator versus Crossplane composition versus kro
type: comparison
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-operator-pattern
    hash: eab72eca2e1b
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

[[sources/research-operator-pattern]]

## Reading the table

The dossier presents the two composition tools as alternatives to bespoke controllers when the custom API is mostly composition. A hand-written operator remains the right tool when the runbook needs arbitrary logic, such as database failover, which composition cannot express. The dossier does not compare Crossplane and kro in depth. See [[comparisons/crossplane-xrds-versus-kro-resourcegraphdefinitions-as-crd-generators]] and [[comparisons/ordering-models-flux-argo-cd-kro-crossplane]].

## Related

[[decisions/build-a-custom-operator-or-compose-existing-resources]], [[findings/hand-written-operators-duplicate-what-composition-could-express]], [[entities/crossplane]], [[entities/kro]], [[entities/kubebuilder]]

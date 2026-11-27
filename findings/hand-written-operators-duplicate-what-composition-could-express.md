---
title: Hand-written operators duplicate what composition could express
type: finding
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-operator-pattern
    hash: eab72eca2e1b
    ingested: 2026-11-25
aliases: []
tags: [pitfall, over-building, composition, platform-engineering]
---

# Hand-written operators duplicate what composition could express

## Observation

The dossier calls over-building a pitfall. When a custom API is mostly a composition of existing resources, a Crossplane Composition or a kro ResourceGraphDefinition can stand in for a hand-written controller, and the team avoids scaffolding, testing, upgrading, and operating bespoke code. The Kubernetes custom resource documentation adds that a custom resource is appropriate only when the API is declarative. Not every automation needs a custom resource. [sources/research-operator-pattern](../sources/research-operator-pattern.md)

## Caveat

The dossier presents this as guidance, with no measurement of the maintenance saved. Composition tools carry their own limits, such as immature abstractions and a second reconcile layer. See [findings/immature-abstractions-in-the-control-plane-ecosystem](immature-abstractions-in-the-control-plane-ecosystem.md) and [findings/two-reconcile-loops-hide-status-and-drift-at-two-layers](two-reconcile-loops-hide-status-and-drift-at-two-layers.md). URL: https://docs.crossplane.io/latest/composition/compositions/ and https://kro.run/docs/overview.

## Related

[decisions/build-a-custom-operator-or-compose-existing-resources](../decisions/build-a-custom-operator-or-compose-existing-resources.md), [comparisons/hand-written-operator-versus-crossplane-composition-versus-kro](../comparisons/hand-written-operator-versus-crossplane-composition-versus-kro.md)

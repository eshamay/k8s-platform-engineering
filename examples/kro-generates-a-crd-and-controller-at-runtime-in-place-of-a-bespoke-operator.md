---
title: kro generates a CRD and controller at runtime in place of a bespoke operator
type: example
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-operator-pattern
    hash: eab72eca2e1b
    ingested: 2026-11-25
aliases: []
tags: [use-case, kro, no-code, platform-engineering]
---

# kro generates a CRD and controller at runtime in place of a bespoke operator

## Scenario

A team needs a custom API composed of existing resources but does not want to write controller code. kro offers a no-code route. [sources/research-operator-pattern](../sources/research-operator-pattern.md)

## How it works

A kro ResourceGraphDefinition declares a schema and templated resources with CEL expressions. According to the overview page, "kro parses the expressions, infers the dependency graph, generates a CRD, and stands up a controller - all at runtime." The author therefore never scaffolds a project or writes a reconcile function. URL: https://kro.run/docs/overview.

## Caveat

The dossier read only the overview, so kro's readiness and status mechanics are not covered here. See [entities/kro](../entities/kro.md) and [open-knowledge-gaps](../open-knowledge-gaps.md).

## Related

[comparisons/hand-written-operator-versus-crossplane-composition-versus-kro](../comparisons/hand-written-operator-versus-crossplane-composition-versus-kro.md), [examples/platform-team-self-service-apis-with-crossplane-and-kro](platform-team-self-service-apis-with-crossplane-and-kro.md), [decisions/build-a-custom-operator-or-compose-existing-resources](../decisions/build-a-custom-operator-or-compose-existing-resources.md)

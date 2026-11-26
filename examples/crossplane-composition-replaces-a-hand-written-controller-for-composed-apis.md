---
title: A Crossplane composition replaces a hand-written controller for composed APIs
type: example
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-operator-pattern
    hash: eab72eca2e1b
    ingested: 2026-11-25
aliases: []
tags: [use-case, crossplane, composition, platform-engineering]
---

# A Crossplane composition replaces a hand-written controller for composed APIs

## Scenario

A platform team wants to offer developers a simple custom API, such as a database with a few fields, that fans out into many cloud resources. Writing and maintaining a bespoke operator for each such API is costly, and the dossier names composition as the alternative. [[sources/research-operator-pattern]]

## How it works

Crossplane lets the platform team define a composite resource API with an XRD and an XR, and then map it to managed resources with a Composition that runs a pipeline of functions. The controller logic is therefore configured, not hand-coded. The documentation says "A Composition composes individual resources together into a larger, reusable, solution." URL: https://docs.crossplane.io/latest/composition/compositions/. The dossier could not read the page at `/latest/concepts/composition/`, which returned 404.

## Related

[[entities/crossplane]], [[concepts/composition]], [[concepts/composite-resource]], [[examples/platform-team-self-service-apis-with-crossplane-and-kro]], [[decisions/build-a-custom-operator-or-compose-existing-resources]]

---
title: VSHN AppCat sells self-service databases, queues, and object storage through composition functions
type: example
status: active
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-composition
    hash: f57d89652816
    ingested: 2026-11-25
aliases: [VSHN AppCat]
tags: [use-case, crossplane, composition-functions, service-catalog]
---

# VSHN AppCat sells self-service databases, queues, and object storage through composition functions

## Scenario

VSHN is a Swiss DevOps and managed Kubernetes provider that has run Crossplane in production for roughly three years. It uses composition functions in the VSHN Application Catalog (AppCat), a marketplace where customers self-provision databases, message queues, and object storage. The platform team owns the expansion logic, and customers see only the small API object they create. [[sources/research-composition]]

## Why patch and transform was not enough

Early in the project the team hit the limits of patch and transform: it has no conditionals, no loops, and no dynamic lookups. Composition functions let VSHN inspect current state, drive Helm chart deployments, and generalize backup and maintenance logic so that it is shared across service types. The details come from a December 2023 post by Tobias Brunner: https://blog.crossplane.io/composition-functions-in-production/.

## Lessons from the alpha

The post records several operational lessons. OpenShift's crun runtime initially could not run functions and was slow when it could. Resources missing from a function request were deleted, so a function must return the full desired state on every call, as described in [[findings/a-composition-function-that-omits-a-resource-from-its-desired-state-deletes-it]]. Mixing patch and transform with functions for the same objects "increases complexity dramatically" because it hides where a change originates, see [[findings/patch-and-transform-cannot-branch-loop-or-patch-between-composed-resources]].

## Why it is the best catalogue example

The dossier calls this the clearest example of composition as a product catalogue, because one provider sells many service types across clouds from one declarative layer. It is a single self-reported case, and the dossier gives no scale numbers for it. A broader list of adopters is in [[examples/crossplane-adopters-build-self-service-platforms-and-service-catalogs-on-composite-resources]].

## Related

[[concepts/composition]], [[entities/crossplane]], [[examples/a-composition-function-pipeline-turns-observed-state-into-desired-state]], [[examples/imagine-learning-replaces-thousand-line-patch-and-transform-files-with-a-looping-composition-function]]

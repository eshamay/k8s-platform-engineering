---
title: "Crossplane v1.14.0 shipped beta functions on 2023-11-01 and broke compatibility with alpha functions"
type: example
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-o7-krm-functions
    hash: 35b3cd859ba9
    ingested: 2026-11-26
aliases: []
tags: [crossplane, release, composition-functions, xfn, migration]
---

# Crossplane v1.14.0 shipped beta functions on 2023-11-01 and broke compatibility with alpha functions

## Scenario

A platform team that adopted alpha composition functions in v1.11 through v1.13 ran them through the `xfn` sidecar in the Crossplane pod. Crossplane v1.14.0 (published 2023-11-01) promoted functions to v1beta1 "with a new, more scalable architecture". Its notes state "The `v1beta1` implementation of Composition Functions is incompatible with existing `v1alpha1` functions." The release lists "Introduce Function CRDs", "Deploy Functions with package manager", "Move xfn out-of-tree by @phisco", and "add xfn v1beta1 grpc interface", plus a new Provider DeploymentRuntimeConfig. [sources/research-gap-o7-krm-functions](../sources/research-gap-o7-krm-functions.md)

## Outcome

An alpha adopter had to rebuild functions as gRPC servers distributed as packages before upgrading. v1.17.0 (2024-08-29) then graduated functions to v1 and deprecated native patch and transform, and v2.0.0 (2025-08-14) removed it. The dossier read the release notes and not any named adopter's migration, so no adopter experience is claimed. See [findings/crossplane-moved-composition-functions-from-an-xfn-sidecar-in-v1-11-to-package-manager-deployments-in-v1-14](../findings/crossplane-moved-composition-functions-from-an-xfn-sidecar-in-v1-11-to-package-manager-deployments-in-v1-14.md).

URL: https://github.com/crossplane/crossplane/releases/tag/v1.14.0

## Related

[entities/crossplane](../entities/crossplane.md), [concepts/composition](../concepts/composition.md)

---
title: Patch and transform cannot branch, loop, or patch between composed resources
type: finding
status: active
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-composition
    hash: f57d89652816
    ingested: 2026-11-25
aliases: [patch and transform limits]
tags: [pitfall, crossplane, patch-and-transform, dsl]
---

# Patch and transform cannot branch, loop, or patch between composed resources

## The limits

Patch and transform is a static list of base resources plus patches that copy fields from the XR into each resource. It is deliberately not Turing complete. It has no conditionals and no loops. Function Patch and Transform also "can't directly patch between two composed resources," so values must be routed through a custom XR status field, and PatchSets cannot nest and ignore transforms and policies. [sources/research-composition](../sources/research-composition.md)

## Why the limits matter

The design doc argues that adding conditionals and iteration to a REST-shaped configuration API leads to an incoherent DSL, and that each addition is slow because it changes core APIs on the release cycle. Users nonetheless pushed it toward tens of composed resources. Imagine Learning had RDS compositions of more than 1,000 lines and near-duplicate files per instance count, see [examples/imagine-learning-replaces-thousand-line-patch-and-transform-files-with-a-looping-composition-function](../examples/imagine-learning-replaces-thousand-line-patch-and-transform-files-with-a-looping-composition-function.md). VSHN needed conditionals, dynamic lookups, and Helm-driven deployments, see [examples/vshn-appcat-sells-self-service-databases-queues-and-object-storage-through-composition-functions](../examples/vshn-appcat-sells-self-service-databases-queues-and-object-storage-through-composition-functions.md). Sources: https://docs.crossplane.io/latest/guides/function-patch-and-transform/ and https://github.com/crossplane/crossplane/blob/main/design/design-doc-composition-functions.md.

## Mixing styles makes it worse

VSHN warns that managing the same objects with patch and transform and with code functions "increases complexity dramatically" because it becomes hard to see where a change happens. Crossplane deprecated `mode: Resources` in v1.17 and removed it in v2, which pushes teams to one pipeline model with patch and transform as just one step. See [findings/older-claims-and-patch-and-transform-material-no-longer-matches-current-crossplane](older-claims-and-patch-and-transform-material-no-longer-matches-current-crossplane.md).

## Alternatives

Functions in a real language remove the limits, and kro's CEL expressions and `forEach` and `includeWhen` do the same inside a bounded language, as discussed in [comparisons/where-the-expressiveness-bound-sits-in-crossplane-functions-and-kro-cel](../comparisons/where-the-expressiveness-bound-sits-in-crossplane-functions-and-kro-cel.md).

## Related

[concepts/composition](../concepts/composition.md), [entities/crossplane](../entities/crossplane.md), [entities/kro](../entities/kro.md)

---
title: Unknown fields are silently pruned under structural schemas
type: finding
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-custom-resource-definition
    hash: 6c26f7f89147
    ingested: 2026-11-25
aliases: []
tags: [pitfall, crd, schema, pruning]
---

# Unknown fields are silently pruned under structural schemas

## Observation

Under a structural schema the apiserver drops any field that the schema does not declare, unless the author sets the `x-kubernetes-preserve-unknown-fields` escape hatch. An author who forgets to declare a field therefore sees the value disappear from stored objects without an error. URL: https://kubernetes.io/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/. [sources/research-custom-resource-definition](../sources/research-custom-resource-definition.md)

## Why pruning exists

Plain OpenAPI describes what must be present but not what is forbidden, and a possibly incomplete spec lets unknown fields leak into storage. Structural schemas were introduced to make validation, pruning, and defaulting possible, which brings CRDs closer to the rigor of built-in types. URL: https://kubernetes.io/blog/2019/06/20/crd-structural-schema/. The dossier presents the silent loss as a surprise for newcomers, and it is the price of the stricter storage guarantee.

## Related

[concepts/custom-resource-definition](../concepts/custom-resource-definition.md), [comparisons/cel-validation-rules-versus-validating-webhooks](../comparisons/cel-validation-rules-versus-validating-webhooks.md), and [findings/defaulting-and-drift-reconcile-loops](defaulting-and-drift-reconcile-loops.md).

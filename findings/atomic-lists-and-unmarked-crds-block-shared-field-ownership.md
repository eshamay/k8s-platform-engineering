---
title: Atomic lists and unmarked CRDs block shared field ownership
type: finding
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-server-side-apply-and-field-ownership
    hash: 1f12c486354e
    ingested: 2026-11-25
aliases: []
tags: [pitfall, server-side-apply, crd, merge-markers]
---

# Atomic lists and unmarked CRDs block shared field ownership

## Observation

How server-side apply merges lists and maps depends on schema markers (`listType`, `listMapKey`, `mapType`, `structType`). A list marked atomic, or defaulting to atomic, can have only one manager, so changes made by others are reverted. Custom resources whose CRD schemas carry no markers are treated as unstructured with atomic lists, so merging between managers fails. [sources/research-server-side-apply-and-field-ownership](../sources/research-server-side-apply-and-field-ownership.md)

## Evidence

Flux documents that atomic lists such as `.spec.tolerations` cannot be shared between managers under the `Merge` policy. Crossplane's SSA page says complex-field merging only works for resources whose CRD schemas carry the markers and tells users to ask the provider maintainer to add them. The Kubernetes reference states the default for unmarked custom resources. See [examples/flux-ssa-annotations-and-ignore-rules-share-fields-with-other-controllers](../examples/flux-ssa-annotations-and-ignore-rules-share-fields-with-other-controllers.md) and [examples/crossplane-clears-managed-fields-when-migrating-to-composition-functions](../examples/crossplane-clears-managed-fields-when-migrating-to-composition-functions.md).

## Interpretation

The CRD author decides whether other writers can safely co-own a list, so the marker is part of the API contract. A platform layer that relies on SSA, such as Crossplane propagating fields downstream, inherits any gap in a provider's CRD schemas. See [concepts/custom-resource-definition](../concepts/custom-resource-definition.md) and [concepts/server-side-apply-and-field-ownership](../concepts/server-side-apply-and-field-ownership.md).

## Related

[findings/multiple-writers-on-one-object](multiple-writers-on-one-object.md), [findings/unknown-fields-are-silently-pruned-under-structural-schemas](unknown-fields-are-silently-pruned-under-structural-schemas.md)

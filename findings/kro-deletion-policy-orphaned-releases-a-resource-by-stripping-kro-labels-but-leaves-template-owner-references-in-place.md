---
title: "kro deletion-policy Orphaned releases a resource by stripping kro labels but leaves template owner references in place"
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-m2-ownership-gc
    hash: 62aafaded9c0
    ingested: 2026-11-26
aliases: []
tags: [pitfall, kro, orphan, deletion-policy, owner-references, alpha]
---

# kro deletion-policy Orphaned releases a resource by stripping kro labels but leaves template owner references in place

## Observation

The annotation `kro.run/deletion-policy: Orphaned` tells kro to leave a resource behind when it would otherwise remove it. kro then strips its labels and annotations from the object, including the ApplySet ID, so "a released resource is no longer tracked by kro at all, and a later instance can adopt it if needed." The policy applies "whenever kro would remove the resource, not just on instance deletion", which covers an instance delete, an RGD change, `includeWhen` turning false, and a `forEach` shrink. [sources/research-gap-m2-ownership-gc](../sources/research-gap-m2-ownership-gc.md) URL: https://github.com/kubernetes-sigs/kro/blob/v0.10.0/website/docs/docs/concepts/reconciliation/06-deletion-policy.md

The feature is alpha. The `DeletionPolicy` feature gate defaults to false in `pkg/features/features.go`, so the annotation does nothing on a default install. [sources/research-gap-m2-ownership-gc](../sources/research-gap-m2-ownership-gc.md)

## Pitfalls

The policy must be on the live object before removal. The docs say to "Set the policy first, wait for the annotation to appear, then remove the resource or delete the instance." Setting it in the same change that removes the resource can lose the race. Releasing a resource does not touch `metadata.ownerReferences`, so if the template added an owner reference by hand, Kubernetes garbage collection deletes the resource anyway once its owner goes. [sources/research-gap-m2-ownership-gc](../sources/research-gap-m2-ownership-gc.md)

## Related

[findings/kro-sets-no-owner-references-on-instance-children-and-tracks-them-with-labels-and-an-applyset-inventory](kro-sets-no-owner-references-on-instance-children-and-tracks-them-with-labels-and-an-applyset-inventory.md), [examples/kro-moves-a-resource-between-graphs-by-orphaning-it-and-letting-a-later-instance-adopt-it](../examples/kro-moves-a-resource-between-graphs-by-orphaning-it-and-letting-a-later-instance-adopt-it.md), [entities/kro](../entities/kro.md), [comparisons/observe-only-and-keep-controls-across-crossplane-config-connector-and-ack](../comparisons/observe-only-and-keep-controls-across-crossplane-config-connector-and-ack.md)

---
title: Crossplane initProvider lets an autoscaler own node group size
type: example
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-idempotency
    hash: 4704ffd77903
    ingested: 2026-11-25
aliases: []
tags: [crossplane, initprovider, autoscaling, eks, drift]
---

# Crossplane initProvider lets an autoscaler own node group size

## Scenario

A Crossplane EKS NodeGroup declares an initial `desiredSize`, and a cluster autoscaler later changes the size. Crossplane treats `spec.forProvider` as the source of truth and reverts out-of-band changes, so a plain `forProvider` size would be reset on every reconcile and the two controllers would fight. [sources/research-idempotency](../sources/research-idempotency.md)

## How it works

`spec.initProvider` holds settings that apply only when the resource is created. The managed resources documentation uses this for autoscaled resources: the NodeGroup sets an initial `desiredSize` in `initProvider`, and Crossplane does not revert the autoscaler's later changes. Related controls are late initialization, which fills unset fields from provider-assigned values, and `managementPolicies`, which can omit Update so Crossplane never writes to the resource after creation. [sources/research-idempotency](../sources/research-idempotency.md)

## Lesson

An idempotent, drift-correcting reconciler converges to the declared state, which is correct only for fields the declaration owns. A field that another writer manages needs to be left out of the enforced set. See [findings/controllers-fighting-over-fields-cause-revert-loops](../findings/controllers-fighting-over-fields-cause-revert-loops.md), [findings/late-initialized-fields-create-false-drift](../findings/late-initialized-fields-create-false-drift.md), and [comparisons/exemption-and-ignore-controls-across-tools](../comparisons/exemption-and-ignore-controls-across-tools.md).

## Related

[entities/crossplane](../entities/crossplane.md), [concepts/managed-resource](../concepts/managed-resource.md), [concepts/idempotency](../concepts/idempotency.md)

---
title: Applying one object twice in a reconcile with Owns and no predicate loops on its own resource version
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-g1-operator-loop-failures
    hash: baca2cdf965d
    ingested: 2026-11-26
aliases: [Double apply loop]
tags: [reconcile-loop, server-side-apply, owns, predicates, kube-shard]
---

# Applying one object twice in a reconcile with Owns and no predicate loops on its own resource version

## Observation

In the Konflux kube-shard operator, `applyOTelCollector` server-side-applied one hashed ConfigMap twice with the same field manager but different label sets. Each apply bumped the resource version, and the controller owned ConfigMaps with no predicate, so every bump re-enqueued the APIShard and the reconcile applied the ConfigMap again. The reporter measured about 13 reconciles per second while the shard was Ready. [[sources/research-gap-g1-operator-loop-failures]] See [[examples/konflux-kube-shard-issue-121-two-server-side-applies-of-one-configmap-looped-at-about-13-reconciles-per-second]].

## Interpretation

The two applies produced different bytes, so each one changed the object, which is why server-side apply's no-op behavior for identical input did not help. The loop needed three ingredients together: a write that differs on each call, a watch on the written object, and no predicate to filter the controller's own writes. Removing any one breaks it.

## Mitigations

Build the final object once and apply it once, and add a predicate on `Owns` that ignores changes the controller made itself. The issue was closed about 5 hours after opening with the fix proposed in the issue, and the details were not read.

## Related

[[concepts/server-side-apply-and-field-ownership]], [[findings/self-triggered-reconcile-loops-generate-their-own-events]], [[findings/a-status-patch-or-update-on-every-pass-keeps-a-controller-in-a-self-sustaining-reconcile-loop]], [[examples/kubebuilder-owns-and-a-field-indexer-wire-child-changes-to-the-owner]]

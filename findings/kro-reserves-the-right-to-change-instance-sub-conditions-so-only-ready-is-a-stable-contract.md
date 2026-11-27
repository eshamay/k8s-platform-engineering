---
title: kro reserves the right to change instance sub-conditions so only Ready is a stable contract
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-b1-recheck-kro-crossplane
    hash: ccee0efa5bdd
    ingested: 2026-11-26
  - id: research-gap-g3-kro
    hash: e8d7c5923d98
    ingested: 2026-11-26
aliases: []
tags: [pitfall, kro, conditions, compatibility]
---

# kro reserves the right to change instance sub-conditions so only Ready is a stable contract

## Observation

An instance of a kro ResourceGraphDefinition carries four built-in conditions at v0.10.0: `InstanceManaged`, `GraphResolved`, `ResourcesReady`, and the root `Ready`, which the status conditions page describes as "true when the three above are true". The Instances page tells readers to depend only on `Ready` and says "kro reserves the right to add, remove, or modify sub-conditions without breaking compatibility". [sources/research-gap-g3-kro](../sources/research-gap-g3-kro.md) URL: https://github.com/kubernetes-sigs/kro/blob/v0.10.0/website/docs/docs/concepts/rgd/06-instances.md

## Why it matters

A health check, alert, or Argo CD or Flux health rule that reads `ResourcesReady` or `GraphResolved` directly can break on a kro upgrade without any breaking-change notice. The sub-conditions are useful for a human diagnosing a stuck instance, for example `ResourcesReady=Unknown` with reason `UnderDeletion` during teardown, see [examples/kro-deletes-instance-resources-in-reverse-dependency-waves](../examples/kro-deletes-instance-resources-in-reverse-dependency-waves.md). They are not a stable interface for automation.

A second effect applies when an RGD author declares custom conditions. The built-ins then disappear from `.status.conditions[]` and stay readable only through `runtime.condition`, so automation that read a built-in name finds nothing. See [examples/kro-rgd-authors-define-instance-conditions-with-cel-and-readywhen](../examples/kro-rgd-authors-define-instance-conditions-with-cel-and-readywhen.md).

## Mitigations

Read `Ready` only in automation, and read the sub-conditions by hand. When an RGD defines its own conditions, make sure the author composes a `Ready` condition. Re-check condition names at every kro minor upgrade, since the release is still pre-1.0 and the API is `v1alpha1`. See [comparisons/provider-fixed-versus-author-defined-condition-semantics-crossplane-versus-kro](../comparisons/provider-fixed-versus-author-defined-condition-semantics-crossplane-versus-kro.md) and [entities/kro](../entities/kro.md).

## Source confirmation (2026-11-26)

The four built-in instance condition types are Go constants in `api/v1alpha1/conditions.go` at v0.10.0, introduced by the comment "Instance built-in condition types. kro computes these on every managed instance". `pkg/controller/instance/status.go` builds the set with `apis.NewReadyConditions(InstanceManaged, GraphResolved, ResourcesReady)`, so `Ready` is the root over the other three, and the same line exists at v0.9.4. The names were stable across those two releases, which is a data point and not a guarantee, since the documentation still reserves the right to change them. [sources/research-gap-b1-recheck-kro-crossplane](../sources/research-gap-b1-recheck-kro-crossplane.md) URL: https://github.com/kubernetes-sigs/kro/blob/v0.10.0/pkg/controller/instance/status.go

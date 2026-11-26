---
title: kro reserves the right to change instance sub-conditions so only Ready is a stable contract
type: finding
status: draft
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-g3-kro
    hash: e8d7c5923d98
    ingested: 2026-11-26
aliases: []
tags: [pitfall, kro, conditions, compatibility]
---

# kro reserves the right to change instance sub-conditions so only Ready is a stable contract

## Observation

An instance of a kro ResourceGraphDefinition carries four built-in conditions at v0.10.0: `InstanceManaged`, `GraphResolved`, `ResourcesReady`, and the root `Ready`, which the status conditions page describes as "true when the three above are true". The Instances page tells readers to depend only on `Ready` and says "kro reserves the right to add, remove, or modify sub-conditions without breaking compatibility". [[sources/research-gap-g3-kro]] URL: https://github.com/kubernetes-sigs/kro/blob/v0.10.0/website/docs/docs/concepts/rgd/06-instances.md

## Why it matters

A health check, alert, or Argo CD or Flux health rule that reads `ResourcesReady` or `GraphResolved` directly can break on a kro upgrade without any breaking-change notice. The sub-conditions are useful for a human diagnosing a stuck instance, for example `ResourcesReady=Unknown` with reason `UnderDeletion` during teardown, see [[examples/kro-deletes-instance-resources-in-reverse-dependency-waves]]. They are not a stable interface for automation.

A second effect applies when an RGD author declares custom conditions. The built-ins then disappear from `.status.conditions[]` and stay readable only through `runtime.condition`, so automation that read a built-in name finds nothing. See [[examples/kro-rgd-authors-define-instance-conditions-with-cel-and-readywhen]].

## Mitigations

Read `Ready` only in automation, and read the sub-conditions by hand. When an RGD defines its own conditions, make sure the author composes a `Ready` condition. Re-check condition names at every kro minor upgrade, since the release is still pre-1.0 and the API is `v1alpha1`. See [[comparisons/provider-fixed-versus-author-defined-condition-semantics-crossplane-versus-kro]] and [[entities/kro]].

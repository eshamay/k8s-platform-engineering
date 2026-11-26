---
title: "kro moves a resource between graphs by orphaning it and letting a later instance adopt it"
type: example
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-m2-ownership-gc
    hash: 62aafaded9c0
    ingested: 2026-11-26
aliases: []
tags: [kro, adoption, orphan, deletion-policy, migration]
---

# kro moves a resource between graphs by orphaning it and letting a later instance adopt it

## Scenario

A platform team wants to move a live resource, for example a database, from one ResourceGraphDefinition to another without recreating it. The kro v0.10.0 deletion-policy page describes the sequence. [[sources/research-gap-m2-ownership-gc]] URL: https://github.com/kubernetes-sigs/kro/blob/v0.10.0/website/docs/docs/concepts/reconciliation/06-deletion-policy.md

## How it works

The team enables the alpha `DeletionPolicy` feature gate and sets `kro.run/deletion-policy: Orphaned` on the template in the old RGD. They wait for the annotation to appear on the live object, then delete the old instance. kro strips its labels and annotations and leaves the object running. The team then declares the same resource in the new RGD, and "kro adopts the existing object rather than creating a new one." [[sources/research-gap-m2-ownership-gc]]

Adoption also happens at two other layers. For the generated CRD, kro compares ownership labels and separates adoption (same RGD name, different ID) from conflict (a different RGD, or a CRD not owned by kro). After an upgrade to v0.10.0, the new engine adopts existing children in place because the `kro.run/applyset` field manager is unchanged. For the alpha Graph kind, a field already managed by another Graph is rejected with a conflict "rather than stealing the field". [[sources/research-gap-m2-ownership-gc]]

## Cautions

The sequence depends on an alpha gate that is off by default, and any owner reference written into the template by hand survives the release, so Kubernetes garbage collection can still delete the object. See [[findings/kro-deletion-policy-orphaned-releases-a-resource-by-stripping-kro-labels-but-leaves-template-owner-references-in-place]].

## Related

[[entities/kro]], [[comparisons/observe-only-and-keep-controls-across-crossplane-config-connector-and-ack]], [[decisions/adopt-or-create-or-require-explicit-import]]

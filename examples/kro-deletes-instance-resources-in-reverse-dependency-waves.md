---
title: "kro deletes instance resources in reverse dependency waves"
type: example
status: active
created: 2026-11-25
updated: 2026-11-26
sources:
  - id: research-gap-m1-finalizers
    hash: 014549e333b6
    ingested: 2026-11-26
  - id: research-finalizers
    hash: ca11dffc241b
    ingested: 2026-11-25
aliases: []
tags: [finalizers, kro, deletion, ordering]
---

# kro deletes instance resources in reverse dependency waves

## Scenario

A kro instance composes several resources that depend on one another, for example a network that a database needs. Deleting the instance has to remove the database before the network. The kro instance deletion page describes how the controller does this. [[sources/research-finalizers]]

## How it works

kro keeps the instance finalizer until every managed resource is gone. It finds the resources through a persisted ApplySet inventory, so it does not need to re-derive the graph at deletion time. It then deletes in reverse dependency order, in waves, and each wave must be fully gone before the next wave starts. A stuck instance reports `ResourcesReady=Unknown` with the reason `UnderDeletion`, and the documented fix is to look for finalizers on the children in the active wave.

## Why the example matters

The ordering removes a class of failure in which a dependency vanishes before a dependent finishes its own cleanup. See [[findings/a-credentials-secret-without-a-finalizer-can-vanish-before-managed-resources-finish-cleanup]] for the Crossplane case that lacks this ordering. Source read on 2026-11-26 shows the instance finalizer is `kro.run/finalizer`, the highest apply-order wave is deleted first, and the finalizer is removed by a merge patch only when no deletion candidates remain, see [[findings/ack-config-connector-and-kro-each-name-their-finalizers-differently-and-remove-them-only-after-cleanup]]. Nothing was inspected on a live object. [[sources/research-gap-m1-finalizers]]

## Related

[[entities/kro]], [[comparisons/finalizer-gated-teardown-across-argo-cd-flux-kro-and-cluster-api]], [[concepts/finalizers]]

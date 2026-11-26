---
title: Cluster API's 2020 conditions proposal had no observedGeneration and the 2024 proposal moves to metav1 conditions
type: example
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-m3-status-conditions
    hash: 07099fedb0c8
    ingested: 2026-11-26
aliases: [Cluster API condition proposals]
tags: [cluster-api, conditions, observedgeneration, polarity, proposals]
---

# Cluster API's 2020 conditions proposal had no observedGeneration and the 2024 proposal moves to metav1 conditions

## Scenario

Cluster API defined its own condition type in a May 2020 proposal and replaced it in a 2024 proposal. The two documents show how the project's position on both `observedGeneration` placement and polarity changed. [[sources/research-gap-m3-status-conditions]]

## How it works

The 2020 proposal (`20200506-conditions.md`) deliberately omitted the field: "In K8s there is an `ObservedGeneration` field, while in this proposal not." It recommended the type suffixes `Ready` and `Succeeded` and said another suffix "with positive meaning" could be used, and it recorded that Pod conditions are consistently positive while Node conditions mix polarities. A 2024-05-03 edit allowed conditions with negative polarity. URL: https://github.com/kubernetes-sigs/cluster-api/blob/main/docs/proposals/20200506-conditions.md

The 2024 proposal (`20240916-improve-status-in-CAPI-resources.md`, created 2024-07-17, updated 2025-01-30) says Cluster API "is also dropping its own `Condition` type and will start using `metav1.Conditions`", says the differences between providers' conditions make it "harder for ecosystem tools to build on top of Cluster API", and aligns with the conventions' statement that "neither positive nor negative polarity can be recommended as a general rule". The InfraMachine provider contract accepts an optional per-condition `observedGeneration` and defaults it to the resource's generation when omitted. URLs: https://github.com/kubernetes-sigs/cluster-api/blob/main/docs/proposals/20240916-improve-status-in-CAPI-resources.md and https://github.com/kubernetes-sigs/cluster-api/blob/main/docs/book/src/developer/providers/contracts/infra-machine.md

## Lesson

Cluster API moved from no generation marker to the per-condition marker of `metav1.Condition`, which a kstatus-style tool does not read. This is the context for the readiness question in [[examples/cluster-api-adds-available-and-operation-conditions-beside-ready]] and [[findings/kstatus-treats-an-unknown-kind-without-a-ready-condition-as-always-reconciled]]. See [[entities/cluster-api]] and [[comparisons/observedgeneration-top-level-versus-per-condition]].

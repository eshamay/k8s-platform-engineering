---
title: "Operator SDK capability levels keep delegating operators at Level 1 and say nothing about composition tools"
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-m7-operators-idempotency
    hash: 6c986668a6dc
    ingested: 2026-11-26
aliases: [capability levels and composition]
tags: [operator-sdk, maturity-model, crossplane, kro, operators]
---

# Operator SDK capability levels keep delegating operators at Level 1 and say nothing about composition tools

## Observation

The Operator SDK capability-levels page defines five levels, from "Level 1 - Basic Install" to "Level 5 - Auto Pilot", and frames them around an Operator managing an Operand workload. It states one rule for operators outside that frame: "Operator that do not manage a workload and/or are delegating to off-clusters orchestration services would remain at Level 1." It also says "Each capability represents its own set of features and may be independent of each other", and it defines the managed resources of an operand as "the Kubernetes objects or off-cluster services the Operator uses to constitute an Operand". A search of the full page found no mention of Crossplane, kro, composition, or non-Go implementations. [sources/research-gap-m7-operators-idempotency](../sources/research-gap-m7-operators-idempotency.md)

## Two readings the text supports

Under the strict reading, an operator whose job is to call a cloud API, such as a Crossplane managed resource or Config Connector, delegates to an off-cluster service and so caps at Level 1. kro composes in-cluster Kubernetes objects, so the sentence does not directly cover it. Under the loose reading, because capabilities "may be independent", a tool could claim features at higher levels without climbing in order. [sources/research-gap-m7-operators-idempotency](../sources/research-gap-m7-operators-idempotency.md)

The level definitions use application terms: backup and restore "the operand from the operator itself" at Level 3, metrics and alerts at Level 4, and "configure the Operand to auto-scale as load picks up" at Level 5. How these map to a composite resource's operand is undefined. [sources/research-gap-m7-operators-idempotency](../sources/research-gap-m7-operators-idempotency.md)

## What this does and does not settle

The Level 1 sentence is direct evidence. A feature-by-feature mapping for Crossplane and kro exists in no Operator Framework source, so any such mapping would be the wiki's own inference and must be labeled as one. The page carries no version stamp, and Operator SDK v1.42.3 was released on 2026-06-26 while the repository was pushed on 2026-10-21. Reading that gap as a maintenance signal is an inference and no source states it.

## Related

[entities/operator-sdk](../entities/operator-sdk.md), [concepts/operator-pattern](../concepts/operator-pattern.md), [entities/crossplane](../entities/crossplane.md), [entities/kro](../entities/kro.md), [decisions/choose-an-operator-framework-or-language-from-kubebuilder-operator-sdk-josdk-kopf-shell-operator-metacontroller-or-composition](../decisions/choose-an-operator-framework-or-language-from-kubebuilder-operator-sdk-josdk-kopf-shell-operator-metacontroller-or-composition.md)

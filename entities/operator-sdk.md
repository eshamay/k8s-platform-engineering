---
title: Operator SDK and Operator Framework
type: entity
status: active
created: 2026-11-25
updated: 2026-11-26
sources:
  - id: research-operator-pattern
    hash: eab72eca2e1b
    ingested: 2026-11-25
  - id: research-gap-m7-operators-idempotency
    hash: 6c986668a6dc
    ingested: 2026-11-26
aliases: [Operator SDK, Operator Framework]
tags: [tool, operators, framework, maturity-model]
---

# Operator SDK and Operator Framework

## What it is

The Operator Framework, maintained by Red Hat and the community, includes the Operator SDK, which scaffolds operator projects. The dossier lists the Operator Framework among the implementation frameworks named on the Kubernetes operator page, next to [[entities/kubebuilder]], Kopf, the Java Operator SDK, [[entities/kube-rs]], KubeOps, and Metacontroller. Kubebuilder and the Operator SDK are both built on [[entities/controller-runtime]]. [[sources/research-operator-pattern]]

## Capability levels

The SDK documentation defines a five-level maturity model for operators. Level 1 is Basic Install, Level 2 is Seamless Upgrades, Level 3 is Full Lifecycle (backup, restore, and failover), Level 4 is Deep Insights (metrics and alerts), and Level 5 is Auto Pilot (auto-scaling, healing, and tuning). The page describes Level 5 as work to "significantly reduce/eliminate any remaining manual intervention." The levels give teams a shared vocabulary for how far an operator has progressed and a roadmap for prioritizing features. URL: https://sdk.operatorframework.io/docs/overview/operator-capabilities/.

## Limits of the model

The dossier says the level descriptions are fairly high level and that it is unclear how strictly they apply to non-Go or generic-composition operators such as [[entities/kro]] and [[entities/crossplane]]. See [[open-knowledge-gaps]].

## Related

[[concepts/operator-pattern]], [[findings/operators-that-publish-no-standard-status-or-metrics-leave-their-state-opaque]]

## Capability levels and delegating operators (m7 dossier)

Correction note, 2026-11-26: the "Limits of the model" section above says it is unclear how the levels apply to composition-based operators. The levels page now read in full says an operator that does "not manage a workload and/or [is] delegating to off-clusters orchestration services would remain at Level 1", that capabilities "may be independent of each other", and that it never mentions Crossplane, kro, or composition. A level-by-level mapping for those tools is not in any Operator Framework source, so it remains the wiki's inference. See [[findings/operator-sdk-capability-levels-keep-delegating-operators-at-level-1-and-say-nothing-about-composition-tools]]. The SDK provides workflows for Go, Ansible, or Helm, and it is a framework on controller-runtime. Latest release v1.42.3 (2026-06-26). [[sources/research-gap-m7-operators-idempotency]] See [[comparisons/operator-frameworks-by-self-description-kubebuilder-operator-sdk-java-operator-sdk-kopf-shell-operator-and-metacontroller]] and [[decisions/choose-an-operator-framework-or-language-from-kubebuilder-operator-sdk-josdk-kopf-shell-operator-metacontroller-or-composition]].

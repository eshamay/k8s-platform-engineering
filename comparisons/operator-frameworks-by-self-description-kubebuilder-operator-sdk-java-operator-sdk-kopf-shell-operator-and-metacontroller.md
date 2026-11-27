---
title: "Operator frameworks by self-description: Kubebuilder, Operator SDK, Java Operator SDK, Kopf, shell-operator, and Metacontroller"
type: comparison
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-m7-operators-idempotency
    hash: 6c986668a6dc
    ingested: 2026-11-26
aliases: [operator framework options]
tags: [comparison, operators, frameworks, language, evidence-only]
---

# Operator frameworks by self-description: Kubebuilder, Operator SDK, Java Operator SDK, Kopf, shell-operator, and Metacontroller

Every row below is the project's own statement of what it is, read from its README or documentation on 2026-11-26. No neutral comparison from maintainers was found, so this table lists options and makes no ranking. [sources/research-gap-m7-operators-idempotency](../sources/research-gap-m7-operators-idempotency.md)

| Project | Language and style | What the project says about itself | Release or posture seen |
|---|---|---|---|
| [entities/kubebuilder](../entities/kubebuilder.md) | Go | The book targets "API extension developers" who "will learn the principles and concepts behind implementing canonical Kubernetes APIs" | v4.16.0, 2026-09-10 |
| [entities/operator-sdk](../entities/operator-sdk.md) | Go, Ansible, or Helm | "The SDK provides workflows to develop operators in Go, Ansible, or Helm", and it is a "framework that uses the controller-runtime library" | v1.42.3, 2026-06-26, repository pushed 2026-10-21 |
| Java Operator SDK | Java with the Fabric8 client | Offers "Handling dependent resources, related events, and caching" and "Automatic Retries"; lists a language-independent option that works "by simply applying a custom resource" | v5.7.0, 2026-11-19 |
| Kopf | Python decorators | "A full-featured operator in just 2 files: a `Dockerfile` + a Python file" | 1.45.2, 2026-10-23; "There is no active development of **new major** functionality for Kopf" |
| shell-operator | Scripts as hooks on Kubernetes events | "This operator is not an operator for a _particular software product_" | v1.21.5, 2026-11-06 |
| Metacontroller | Any language through a JSON webhook | Provides "a webhook (in any language) that receives the current state as JSON and returns the desired state as JSON", with adopt and orphan, garbage collection, work queues, and "retries with backoff" built in | v4.17.11, 2026-11-22 |

## Reading the table

The projects differ in where the reconcile logic runs and which parts the framework supplies. Kubebuilder and the Operator SDK are libraries and scaffolds for logic written in a general language, with the Operator SDK adding Ansible and Helm paths that map custom resources to playbooks and charts. Metacontroller moves the framework behavior into a running controller and leaves only a stateless function to the author. Composition tools such as [entities/crossplane](../entities/crossplane.md) and [entities/kro](../entities/kro.md) sit outside this table because they replace the code, and the comparison of those routes is in [comparisons/hand-written-operator-versus-crossplane-composition-versus-kro](hand-written-operator-versus-crossplane-composition-versus-kro.md).

The Operator SDK release gap (last release in June, repository pushed in October) and the Kopf statement are facts from the sources, and any maintenance conclusion drawn from them is an inference. kube-rs and KubeOps were not searched in this run, and the claim that the CNCF white paper favors Go is unverified. See [entities/kube-rs](../entities/kube-rs.md) and [decisions/choose-an-operator-framework-or-language-from-kubebuilder-operator-sdk-josdk-kopf-shell-operator-metacontroller-or-composition](../decisions/choose-an-operator-framework-or-language-from-kubebuilder-operator-sdk-josdk-kopf-shell-operator-metacontroller-or-composition.md).

## Related

[concepts/operator-pattern](../concepts/operator-pattern.md), [entities/controller-runtime](../entities/controller-runtime.md), [findings/operator-sdk-capability-levels-keep-delegating-operators-at-level-1-and-say-nothing-about-composition-tools](../findings/operator-sdk-capability-levels-keep-delegating-operators-at-level-1-and-say-nothing-about-composition-tools.md)

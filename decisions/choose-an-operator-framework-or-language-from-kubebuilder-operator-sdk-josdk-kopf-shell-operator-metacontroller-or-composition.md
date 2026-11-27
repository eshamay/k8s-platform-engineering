---
title: "Choose an operator framework or language: Kubebuilder, Operator SDK, JOSDK, Kopf, shell-operator, Metacontroller, or composition"
type: decision
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-m7-operators-idempotency
    hash: 6c986668a6dc
    ingested: 2026-11-26
aliases: [operator framework choice]
tags: [decision, operators, frameworks, language, evidence-only]
---

# Choose an operator framework or language: Kubebuilder, Operator SDK, JOSDK, Kopf, shell-operator, Metacontroller, or composition

## Status

Open decision with options and evidence only. This page makes no recommendation. The dossier searched project READMEs and the Kubebuilder book introduction for selection criteria and found only self-descriptions, so no source states a rule for choosing among these routes. [sources/research-gap-m7-operators-idempotency](../sources/research-gap-m7-operators-idempotency.md)

## Context

A team that needs a custom API and controller must pick the language and framework that will carry the reconcile logic, or decide to avoid writing a controller. The wiki's earlier material said no source gave criteria, and that remains true. See [decisions/build-a-custom-operator-or-compose-existing-resources](build-a-custom-operator-or-compose-existing-resources.md) for the code-versus-composition question and [comparisons/operator-frameworks-by-self-description-kubebuilder-operator-sdk-java-operator-sdk-kopf-shell-operator-and-metacontroller](../comparisons/operator-frameworks-by-self-description-kubebuilder-operator-sdk-java-operator-sdk-kopf-shell-operator-and-metacontroller.md) for the side-by-side facts.

## Options

### Option A: Go with Kubebuilder or the Operator SDK Go path

Both build on controller-runtime and scaffold Go projects. Kubebuilder's book teaches API design and controller concepts for "API extension developers". The Operator SDK adds Ansible and Helm workflows, and its last release was 2026-06-26. Evidence for the option is the shared library and scaffolding. Evidence against is absent, and no source ranks Go above the others, because the claim that the CNCF white paper favors Go was not verified. See [entities/kubebuilder](../entities/kubebuilder.md), [entities/operator-sdk](../entities/operator-sdk.md), and [entities/controller-runtime](../entities/controller-runtime.md).

### Option B: Ansible or Helm through the Operator SDK

The SDK maps custom resources to playbooks or charts, which avoids writing reconcile code in a general language. The sources read do not describe the limits of this path.

### Option C: another language with its own framework

Java Operator SDK offers retries, dependent-resource handling, and event scheduling. Kopf offers decorator handlers for Python, and its maintainer states that no major new functionality is in development while calling it production-ready. shell-operator runs scripts as hooks. kube-rs and KubeOps were not searched in this run. See [entities/kube-rs](../entities/kube-rs.md).

### Option D: a webhook in any language with Metacontroller

Metacontroller runs the watches, caching, work queues, adopt and orphan handling, garbage collection, optimistic concurrency, and retries, and the author supplies a function from observed state to desired state. The cost is a separate controller to operate, which the README does not discuss.

### Option E: no controller code, with composition

[entities/crossplane](../entities/crossplane.md) and [entities/kro](../entities/kro.md) generate the API and controller behavior from configuration. The Operator SDK capability levels page says operators that delegate to off-cluster services "would remain at Level 1", and it does not mention these tools. See [findings/operator-sdk-capability-levels-keep-delegating-operators-at-level-1-and-say-nothing-about-composition-tools](../findings/operator-sdk-capability-levels-keep-delegating-operators-at-level-1-and-say-nothing-about-composition-tools.md).

## Consequences

Each option moves some of the controller plumbing from the author to the framework, at a different point. The sources give no outcome data comparing them, and any team constraint such as existing language skills sits outside the evidence read here. [sources/research-gap-m7-operators-idempotency](../sources/research-gap-m7-operators-idempotency.md)

## Related

[concepts/operator-pattern](../concepts/operator-pattern.md), [comparisons/hand-written-operator-versus-crossplane-composition-versus-kro](../comparisons/hand-written-operator-versus-crossplane-composition-versus-kro.md)

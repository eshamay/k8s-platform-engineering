---
title: Declarative vs Imperative
type: concept
status: active
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: krm-platform-vocabulary
    hash: 731a6941f9db
    ingested: 2026-11-25
  - id: research-declarative-vs-imperative
    hash: 570767ba4094
    ingested: 2026-11-25
aliases: [Declarative management]
tags: [architecture, principle]
---

# Declarative vs Imperative

## Definition

Declarative management means defining the desired end-state, usually as YAML in `spec`, instead of writing a step-by-step sequence of commands or scripts to reach it. [sources/krm-platform-vocabulary](../sources/krm-platform-vocabulary.md) The Kubernetes documentation describes an object as a "record of intent": the user stores what they want, and the control plane works to make the observed `status` match the `spec`. Imperative management is the opposite: the user tells the system which action to take now, as with `kubectl create`, `kubectl scale`, or a shell script. [sources/research-declarative-vs-imperative](../sources/research-declarative-vs-imperative.md)

## A spectrum of three techniques

The official object-management page treats the choice as a spectrum rather than a binary. Imperative commands have the lowest learning curve but leave no review or audit trail, so they suit development. Imperative object configuration (`kubectl replace -f`) keeps files but still issues explicit verbs, which suits a single writer in production. Declarative object configuration (`kubectl apply -f dir/`) suits multiple writers and gives reviewable files, but it is harder to debug because of the merge and patch logic underneath. The page also warns against mixing techniques on the same object. See [comparisons/kubectl-object-management-techniques](../comparisons/kubectl-object-management-techniques.md) and [decisions/choosing-an-object-management-technique](../decisions/choosing-an-object-management-technique.md).

## Why it matters

A declared end-state gives controllers something to compare against reality, which is what makes [concepts/reconciliation-loop](reconciliation-loop.md), [concepts/self-healing-and-drift-detection](self-healing-and-drift-detection.md), and [concepts/gitops-pull-based-delivery](gitops-pull-based-delivery.md) possible. An imperative script has no standing definition of "correct" to return to.

## How the declarative model works mechanically

Declarative intent only works because of the controller pattern. A controller is a non-terminating control loop that compares `spec` with observed state and acts, in the way a thermostat does. The API conventions state that Kubernetes behavior is level-based rather than edge-based, so a controller reacts to the current full state and not to the history of changes. Controllers use list-watch events for efficiency, but they still re-list and reconcile full state, so a missed or coalesced event does not cause permanent divergence. See [concepts/level-triggered-vs-edge-triggered](level-triggered-vs-edge-triggered.md), [concepts/spec-status-split](spec-status-split.md), and [concepts/idempotency](idempotency.md). API conventions also advise that fields should express desired outcomes and not actions, which keeps a spec declarative. [sources/research-declarative-vs-imperative](../sources/research-declarative-vs-imperative.md)

## How higher layers repeat the idea

GitOps tools such as [entities/flux](../entities/flux.md) and [entities/argo-cd](../entities/argo-cd.md) treat Git as the desired state and reconcile the cluster to it, reverting manual drift when configured to. Provider controllers such as [entities/crossplane](../entities/crossplane.md), [entities/config-connector](../entities/config-connector.md), [entities/ack](../entities/ack.md), and [entities/cluster-api](../entities/cluster-api.md) extend the model to cloud resources and whole clusters. [entities/kro](../entities/kro.md) and Crossplane compositions let platform teams define new declarative APIs that expand into many resources, and the [concepts/operator-pattern](operator-pattern.md) packages human operational knowledge into controllers for custom resources. See [examples/git-driven-cluster-reconciliation-with-flux-and-argo-cd](../examples/git-driven-cluster-reconciliation-with-flux-and-argo-cd.md) and [examples/platform-team-self-service-apis-with-crossplane-and-kro](../examples/platform-team-self-service-apis-with-crossplane-and-kro.md).

## Where the declarative model strains

Pure declarative management is not absolute in practice. Kubernetes keeps imperative commands for development and one-off tasks, and tools expose escape hatches such as Flux suspend, retain or orphan deletion policies, force, and abandon. Those escape hatches exist because declarative reconciliation is dangerous when ownership, deletion, or drift semantics are misunderstood. The pitfalls fall into four groups: multiple writers fighting over fields ([findings/multiple-writers-on-one-object](../findings/multiple-writers-on-one-object.md)), unexpected pruning and deletion ([findings/unintended-deletion-through-prune](../findings/unintended-deletion-through-prune.md) and [findings/destructive-deletion-of-external-resources](../findings/destructive-deletion-of-external-resources.md)), drift correction fighting server-defaulted values ([findings/defaulting-and-drift-reconcile-loops](../findings/defaulting-and-drift-reconcile-loops.md)), and immutable fields that cannot be patched ([findings/immutable-fields-and-drift-collisions](../findings/immutable-fields-and-drift-collisions.md)). Mixing styles on one object is a fifth hazard, covered in [findings/mixing-management-techniques-on-one-object](../findings/mixing-management-techniques-on-one-object.md). [sources/research-declarative-vs-imperative](../sources/research-declarative-vs-imperative.md)

## Related

[concepts/spec-status-split](spec-status-split.md), [concepts/level-triggered-vs-edge-triggered](level-triggered-vs-edge-triggered.md), [concepts/idempotency](idempotency.md), [concepts/server-side-apply-and-field-ownership](server-side-apply-and-field-ownership.md), [entities/kubectl](../entities/kubectl.md)

## To research

Ordering, one-shot operations, and data migrations remain weak spots for a purely declarative model, and the sources read so far do not explain how tools work around them beyond hooks and waves. See [findings/ordering-and-dependency-failures](../findings/ordering-and-dependency-failures.md) and [open-knowledge-gaps](../open-knowledge-gaps.md).

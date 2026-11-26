---
title: A Deployment status reports ready replicas against spec replicas
type: example
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-spec-status-split
    hash: 598e6132ea4f
    ingested: 2026-11-25
aliases: []
tags: [spec-status, deployment, baseline, tutorial]
---

# A Deployment status reports ready replicas against spec replicas

## Scenario

A user creates a Deployment with `replicas: 3`. The control plane works continually to make the observed state match that number, and the Deployment's status reports fields such as `readyReplicas` and `updatedReplicas`. The dossier calls this the baseline use case and the best first example for tutorials. [[sources/research-spec-status-split]]

## How it works

The user, or a GitOps tool, writes only `spec`. The Deployment controller watches the object, compares the desired replica count with what it observes, creates or deletes ReplicaSet pods, and writes its measurements into `status`. Operators and rollout tools read `readyReplicas` and `updatedReplicas` to decide whether a rollout is finished. The Kubernetes documentation frames the same loop with a thermostat analogy in which each controller tries to move the current state closer to the desired state. URLs: https://kubernetes.io/docs/concepts/overview/working-with-objects/ and https://kubernetes.io/docs/concepts/architecture/controller/.

## Lesson

The example shows the whole contract in one small object: intent goes in one stanza, measurement comes out in another, and neither writer overwrites the other. Every custom resource that follows the conventions repeats this shape. See [[concepts/spec-status-split]], [[concepts/reconciliation-loop]], and [[examples/deployment-replica-changes-converge-to-the-final-count]].

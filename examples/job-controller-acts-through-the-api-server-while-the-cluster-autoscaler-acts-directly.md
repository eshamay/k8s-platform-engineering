---
title: The Job controller acts through the API server while the cluster autoscaler acts directly
type: example
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-operator-pattern
    hash: eab72eca2e1b
    ingested: 2026-11-25
aliases: []
tags: [use-case, controllers, built-in]
---

# The Job controller acts through the API server while the cluster autoscaler acts directly

## Scenario

The Kubernetes Controllers page explains the control loop with a thermostat and then uses the built-in Job controller as its worked example. It is the mechanical foundation that every operator copies. [[sources/research-operator-pattern]]

## How it works

The Job controller watches Job objects. When it sees one that needs work, it creates Pods through the API server, and when work finishes it removes them and reports status on the Job. The controller never starts a container itself. The page contrasts this with controllers that touch an external system directly, with the cluster autoscaler as its example, because adding nodes means calling something outside the API server. An operator for a database or a cloud service is usually the second kind: its controller talks to the external API and records what it did in status. URL: https://kubernetes.io/docs/concepts/architecture/controller/.

## Takeaway

The page states that "each controller tries to move the current cluster state closer to the desired state" and prefers several small controllers over one monolith. See [[concepts/operator-pattern]], [[concepts/reconciliation-loop]], and [[decisions/one-controller-per-kind-or-one-multi-kind-controller]].

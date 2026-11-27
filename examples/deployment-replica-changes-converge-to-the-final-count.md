---
title: Deployment replica changes converge to the final count
type: example
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-eventual-consistency-and-convergence
    hash: bb35eafbd239
    ingested: 2026-11-25
aliases: []
tags: [convergence, replicas, level-triggered, deployment]
---

# Deployment replica changes converge to the final count

## Scenario

A user changes the replica count of a Deployment several times in quick succession, for example from 1 to 5 and then to 2. The dossier treats this as the standard example of convergence: the controller ends at the final count however many intermediate values it did or did not see. [sources/research-eventual-consistency-and-convergence](../sources/research-eventual-consistency-and-convergence.md)

## What happens

The HackerNoon explainer contrasts the two designs on this scenario. An edge-triggered handler that applies each change event as a delta can land at 0 replicas if events are lost or reordered. A level-triggered controller compares the full desired state (2) with the observed state and acts on the difference, so it ends at 2. The Kubernetes API conventions state the same guarantee in general form: the system drives toward the most recent spec regardless of previous versions. URLs: https://hackernoon.com/level-triggering-and-reconciliation-in-kubernetes-1f17fe30333d and https://github.com/kubernetes/community/blob/master/contributors/devel/sig-architecture/api-conventions.md.

## Lesson

Convergence does not promise that every intermediate state is processed. It promises that the last declared state wins. Users should therefore treat a quick sequence of edits as one edit to the final value. See [concepts/eventual-consistency-and-convergence](../concepts/eventual-consistency-and-convergence.md), [concepts/level-triggered-vs-edge-triggered](../concepts/level-triggered-vs-edge-triggered.md), and [examples/how-core-controllers-handle-cache-lag](how-core-controllers-handle-cache-lag.md).

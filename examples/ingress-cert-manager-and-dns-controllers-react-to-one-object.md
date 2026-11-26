---
title: Ingress, cert-manager, and DNS controllers react to one object
type: example
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-reconciliation-loop
    hash: df7d66206baf
    ingested: 2026-11-25
aliases: []
tags: [controllers, composition-of-controllers, informers]
---

# Ingress, cert-manager, and DNS controllers react to one object

## Scenario

The DevOps Toolkit deep dive walks through an Ingress object that three separate controllers all care about: an ingress controller, cert-manager, and a DNS controller. Each runs its own observe, compare, act, wait loop against the same object. [[sources/research-reconciliation-loop]]

## What happens

Each controller has its own informer, which is the caching layer between the controller and the API server, and its own work queue. A change to the Ingress produces a key in each queue, and each controller does only its own job. The ingress controller programs routing, cert-manager obtains a certificate, and the DNS controller creates a record. None of them calls another, and they coordinate only through the shared object and what each writes back to it. [[sources/research-reconciliation-loop]]

## Why it matters

The example shows the Kubernetes design preference for many small controllers that each own one aspect, as the official Controllers page puts it. It also shows that reconciliation composes without orchestration code, because every controller converges on its own concern. The source is a beginner-oriented explainer with no named author, so treat it as illustration and not as authority. [[sources/research-reconciliation-loop]]

## Related

[[concepts/reconciliation-loop]], [[concepts/informers-reflectors-and-workqueues]], [[entities/cert-manager]], [[comparisons/how-flux-ack-and-cluster-api-split-controllers]]

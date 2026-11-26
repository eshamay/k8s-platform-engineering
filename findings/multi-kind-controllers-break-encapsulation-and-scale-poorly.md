---
title: Multi-kind controllers break encapsulation and scale poorly
type: finding
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-operator-pattern
    hash: eab72eca2e1b
    ingested: 2026-11-25
aliases: []
tags: [pitfall, monolith, controllers, design]
---

# Multi-kind controllers break encapsulation and scale poorly

## Observation

Three independent sources recommend a single responsibility per controller. The Kubebuilder good-practices page says "Each controller should ideally have only one job. This approach simplifies development and debugging, and makes the system more robust," and calls multi-Kind controllers a break in encapsulation that scales poorly. The Kubernetes controller documentation prefers several small controllers over one monolith, and the Google Cloud guidance advises compartmentalizing features across controllers. [[sources/research-operator-pattern]]

## How tools apply it

Flux separates source, kustomize, helm, notification, and image automation controllers. ACK splits by AWS service. Cluster API separates core controllers from provider controllers. See [[comparisons/how-flux-ack-and-cluster-api-split-controllers]]. URL: https://book.kubebuilder.io/reference/good-practices.

## Related

[[decisions/one-controller-per-kind-or-one-multi-kind-controller]], [[concepts/operator-pattern]]

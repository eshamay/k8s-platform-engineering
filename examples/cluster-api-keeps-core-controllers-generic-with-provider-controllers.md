---
title: Cluster API keeps core controllers generic with provider controllers
type: example
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-operator-pattern
    hash: eab72eca2e1b
    ingested: 2026-11-25
aliases: []
tags: [use-case, cluster-api, providers, lifecycle]
---

# Cluster API keeps core controllers generic with provider controllers

## Scenario

Managing whole Kubernetes clusters across AWS, GCP, vSphere, and other infrastructure would be unmanageable if one operator knew every backend. Cluster API solves this by treating cluster lifecycle as the operator domain and splitting the controllers. [[sources/research-operator-pattern]]

## How it works

A management cluster holds Cluster API custom resources and runs controllers for them. Pluggable infrastructure providers implement the backend-specific work, so the core controllers stay generic. The Cluster API book says "Extensibility is at the core of Cluster API." The dossier calls this a large-scale example of the operator pattern applied to cluster lifecycle. URL: https://cluster-api.sigs.k8s.io/user/concepts.

## Related

[[entities/cluster-api]], [[examples/cluster-fleet-lifecycle-with-cluster-api]], [[comparisons/how-flux-ack-and-cluster-api-split-controllers]], [[concepts/provider]]

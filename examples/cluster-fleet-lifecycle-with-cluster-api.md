---
title: Cluster fleet lifecycle with Cluster API
type: example
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-universal-control-plane
    hash: 037575049a4c
    ingested: 2026-11-25
  - id: research-declarative-vs-imperative
    hash: 570767ba4094
    ingested: 2026-11-25
  - id: research-self-healing-and-drift-detection
    hash: 98edc2019c6b
    ingested: 2026-11-25
aliases: []
tags: [use-case, cluster-api, fleet]
---

# Cluster fleet lifecycle with Cluster API

## Scenario

An organization needs to create, upgrade, and repair many Kubernetes clusters on AWS, vSphere, and other infrastructure. [entities/cluster-api](../entities/cluster-api.md) solves this by designating a management cluster that runs the Cluster API controllers and the relevant provider controllers. [sources/research-universal-control-plane](../sources/research-universal-control-plane.md)

## How it works

Operators describe workload clusters as Cluster, Machine, MachineDeployment, and MachineHealthCheck resources. The provider controllers translate those into real machines and networks, and the health check resource lets the system repair machines automatically. This is the loop from [concepts/reconciliation-loop](../concepts/reconciliation-loop.md) applied to infrastructure, and it shows Kubernetes managing Kubernetes.

## Risk

The management cluster concentrates authority over the entire fleet, so it becomes a single point of failure. See [findings/blast-radius-and-privilege-centralization](../findings/blast-radius-and-privilege-centralization.md).

## Immutable Machines and rolling replacement

The Cluster API concepts page says Machines are immutable and are replaced and not updated, so upgrades become rolling replacement, in the same declarative spirit as a Deployment replacing Pods. The user base includes platform operators with many clusters and infrastructure providers such as AWS, Azure, and vSphere. [sources/research-declarative-vs-imperative](../sources/research-declarative-vs-imperative.md) See [concepts/declarative-vs-imperative](../concepts/declarative-vs-imperative.md).

## Automatic node replacement

MachineHealthCheck replaces unhealthy Machines automatically. [sources/research-self-healing-and-drift-detection](../sources/research-self-healing-and-drift-detection.md) See [examples/cluster-api-machine-health-check-replaces-failed-nodes](cluster-api-machine-health-check-replaces-failed-nodes.md).

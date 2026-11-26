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
aliases: []
tags: [use-case, cluster-api, fleet]
---

# Cluster fleet lifecycle with Cluster API

## Scenario

An organization needs to create, upgrade, and repair many Kubernetes clusters on AWS, vSphere, and other infrastructure. [[entities/cluster-api]] solves this by designating a management cluster that runs the Cluster API controllers and the relevant provider controllers. [[sources/research-universal-control-plane]]

## How it works

Operators describe workload clusters as Cluster, Machine, MachineDeployment, and MachineHealthCheck resources. The provider controllers translate those into real machines and networks, and the health check resource lets the system repair machines automatically. This is the loop from [[concepts/reconciliation-loop]] applied to infrastructure, and it shows Kubernetes managing Kubernetes.

## Risk

The management cluster concentrates authority over the entire fleet, so it becomes a single point of failure. See [[findings/blast-radius-and-privilege-centralization]].

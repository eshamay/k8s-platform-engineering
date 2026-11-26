---
title: Cluster API MachineHealthCheck replaces failed nodes
type: example
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-self-healing-and-drift-detection
    hash: 98edc2019c6b
    ingested: 2026-11-25
aliases: []
tags: [cluster-api, self-healing, machines, remediation]
---

# Cluster API MachineHealthCheck replaces failed nodes

## Scenario

A platform team runs workload clusters through [[entities/cluster-api]] and wants failed nodes replaced without a human. A MachineHealthCheck evaluates Node conditions against timeouts and remediates unhealthy Machines, usually by replacing them. As the book puts it, "If any of these conditions are met for the duration of the timeout, the Machine will be remediated." The source is the older v0.4 Cluster API book at https://release-0-4.cluster-api.sigs.k8s.io/tasks/healthcheck. [[sources/research-self-healing-and-drift-detection]]

## How it works

The health check watches Node conditions, waits out the configured timeouts so brief blips do not trigger action, and then remediates. Only machines owned by a MachineSet or KubeadmControlPlane are supported, because replacement relies on that owner recreating a Machine. The `maxUnhealthy` setting is a brake: when too many machines look unhealthy at once, remediation is skipped so the controller does not replace a large share of the fleet during a wider problem.

## Lesson

This is self-healing at the machine layer, where "drift" is a node that is no longer healthy and correction is replacement instead of patching. Current behavior may differ from the v0.4 book. See [[findings/remediation-can-amplify-an-outage]], [[examples/cluster-fleet-lifecycle-with-cluster-api]], and [[concepts/self-healing-and-drift-detection]].

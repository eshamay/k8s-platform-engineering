---
title: Domain-scoped Crossplane control planes are proposed in place of one monolithic instance
type: example
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-crossplane-deep-dive
    hash: 44034359219f
    ingested: 2026-11-25
aliases: []
tags: [crossplane, platform-engineering, v2, design-advice, prescriptive]
---

# Domain-scoped Crossplane control planes are proposed in place of one monolithic instance

> [!WARNING]
> This page records prescriptive advice from two blogs. The dossier says explicitly that it is not evidence of deployments.

## The proposal

A practitioner blog by Polarpoint argues that "Teams no longer need a single monolithic Crossplane instance." Because Crossplane v2 compositions can contain any Kubernetes resource, the author proposes several small control planes, each scoped to a domain such as networking or data, with APIs modeled by infrastructure domain and not by cloud provider. A CNCF community blog adds the idea of whole-application composites that mix cloud resources with in-cluster workloads, and of agent-driven operations on top of such APIs. [sources/research-crossplane-deep-dive](../sources/research-crossplane-deep-dive.md)

## Design advice attached to the proposal

The Polarpoint post tells teams to invest in observability before rollout, meaning status conditions and events that make each layer inspectable. It tells them to start with small Compositions and not mega-Compositions, and to design the API around the mental model of its users. These points line up with the pitfalls in [findings/oversized-compositions-and-cloud-shaped-apis-make-platform-apis-hard-to-use](../findings/oversized-compositions-and-cloud-shaped-apis-make-platform-apis-hard-to-use.md) and with the status vocabulary in [concepts/conditions](../concepts/conditions.md).

## Why it is only an example of intent

Neither post names an organization that runs this layout, and neither gives numbers for object counts or operating cost. The scenario is therefore a design option and not a documented deployment. The trade-off is framed in [decisions/run-one-crossplane-control-plane-or-several-domain-scoped-ones](../decisions/run-one-crossplane-control-plane-or-several-domain-scoped-ones.md). For a concrete composite that creates both a database and its workload, see [examples/a-microservice-xr-creates-a-database-and-its-workload-from-one-namespaced-object](a-microservice-xr-creates-a-database-and-its-workload-from-one-namespaced-object.md).

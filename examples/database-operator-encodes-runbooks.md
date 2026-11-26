---
title: Database operators encode runbooks
type: example
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-declarative-vs-imperative
    hash: 570767ba4094
    ingested: 2026-11-25
aliases: []
tags: [use-case, operators, stateful]
---

# Database operators encode runbooks

## Scenario

Stateful services need human operational knowledge such as backup, upgrade, and failover. The Kubernetes operator documentation uses a hypothetical SampleDB custom resource to show how that knowledge moves into software. [[sources/research-declarative-vs-imperative]]

## How it works

A user edits a SampleDB custom resource to say what they want. The operator, which the page describes as a client of the Kubernetes API that acts as a controller for a custom resource, then creates the PVCs, StatefulSets, and Jobs needed to realize it. Runbook steps become reconcile logic that runs continuously, not commands a human types. See [[concepts/operator-pattern]] and [[concepts/reconciliation-loop]].

## Building one

[[entities/kubebuilder]] shows how such a controller is structured: rebuild status from observed children, set owner references, and write status through the status subresource.

## Caveat

SampleDB is an illustration, not a named deployment. No database operator adopter was read in the dossier. See [[open-knowledge-gaps]].

## Related

[[concepts/declarative-vs-imperative]]

---
title: Cluster API Machine controller waits for infrastructure and bootstrap data
type: example
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-reconciliation-loop
    hash: df7d66206baf
    ingested: 2026-11-25
aliases: []
tags: [cluster-api, reconciliation, dependencies]
---

# Cluster API Machine controller waits for infrastructure and bootstrap data

## Scenario

The Cluster API Machine controller is a reconciler that depends on other objects and on external provisioning, so it spends much of its life waiting. [[sources/research-reconciliation-loop]]

## What happens

According to the Cluster API Book, the controller sets owner references, waits for the infrastructure and bootstrap provisioning to finish, and matches Nodes to provider IDs. The page does not describe requeue or pause mechanics, so the dossier uses it only as a multi-object, waiting-on-dependencies example. The waiting is expressed through state read each pass, not through a held-open operation. [[sources/research-reconciliation-loop]]

## Why it matters

This is the shape of most platform reconcilers. They return quickly when a dependency is not ready and rely on a watch event or a timed requeue to run again, as laid out in [[decisions/choose-error-requeueafter-or-terminalerror-in-a-reconciler]]. The gap on exact requeue behavior is recorded in [[open-knowledge-gaps]].

## Related

[[entities/cluster-api]], [[examples/cluster-api-keeps-core-controllers-generic-with-provider-controllers]], [[concepts/reconciliation-loop]], [[concepts/owner-references-and-garbage-collection]]

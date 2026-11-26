---
title: Duplicate work from replicas without leader election
type: finding
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-eventual-consistency-and-convergence
    hash: bb35eafbd239
    ingested: 2026-11-25
aliases: []
tags: [pitfall, leader-election, replicas, kube-rs]
---

# Duplicate work from replicas without leader election

## Observation

Running two replicas of a controller without leader election makes both reconcile the same objects, which duplicates work and produces racy writes. The kube-rs availability guide explains the cause: a controller is a queue consumer, so every replica consumes the same stream of keys. URL: https://kube.rs/controllers/availability/. [[sources/research-eventual-consistency-and-convergence]]

## Costs of the fix

Lease-based leader election prevents the duplication, and the guide recommends stepping down on SIGTERM. The price is failover delay of up to the lease expiry, and rollouts that surge an extra replica can briefly overlap two leaders' worth of activity if the step-down is not handled.

## Mitigations

Use leader election for multi-replica controllers, release the lease on shutdown, and keep reconcilers idempotent so that overlap is harmless. See [[decisions/single-replica-versus-leader-election]], [[entities/kube-rs]], and [[concepts/idempotency]].

## Related

[[concepts/eventual-consistency-and-convergence]], [[findings/stale-cache-and-double-action]]

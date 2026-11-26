---
title: Single replica versus leader election for controllers
type: decision
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-eventual-consistency-and-convergence
    hash: bb35eafbd239
    ingested: 2026-11-25
aliases: []
tags: [controllers, availability, leader-election, kube-rs]
---

# Single replica versus leader election for controllers

## Status

Open guidance from the kube-rs project, not an ADR authored by this wiki. [[sources/research-eventual-consistency-and-convergence]]

## Context

A controller must stay available, but two replicas that both reconcile the same objects duplicate work and race on writes. URL: https://kube.rs/controllers/availability/.

## Decision

The kube-rs guide says most controllers can run as a single replica. They are queue consumers, watch streams reinitialize with current state on boot, and idempotent reconcilers make repeated work harmless, so a short outage delays convergence but does not break it. Controllers that need faster failover should run multiple replicas with Lease-based leader election and step down on SIGTERM. Linkerd's policy controller is cited as a user of leader election.

## Consequences

A single replica is simple and tolerates restarts because of eventual consistency, but convergence pauses during a restart or a rollout. Leader election reduces that pause only to the lease expiry, and it adds a coordination component. Rollout surge can briefly create overlap. See [[findings/duplicate-work-from-replicas-without-leader-election]] and [[concepts/idempotency]].

## Related

[[entities/kube-rs]], [[concepts/eventual-consistency-and-convergence]]

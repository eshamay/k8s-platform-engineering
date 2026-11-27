---
title: Single replica versus leader election for controllers
type: decision
status: draft
created: 2026-11-25
updated: 2026-11-26
sources:
  - id: research-eventual-consistency-and-convergence
    hash: bb35eafbd239
    ingested: 2026-11-25
  - id: research-gap-o2-flux-internals
    hash: 866650ffd3aa
    ingested: 2026-11-26
aliases: []
tags: [controllers, availability, leader-election, kube-rs]
---

# Single replica versus leader election for controllers

## Status

Open guidance from the kube-rs project, not an ADR authored by this wiki. [sources/research-eventual-consistency-and-convergence](../sources/research-eventual-consistency-and-convergence.md)

## Context

A controller must stay available, but two replicas that both reconcile the same objects duplicate work and race on writes. URL: https://kube.rs/controllers/availability/.

## Decision

The kube-rs guide says most controllers can run as a single replica. They are queue consumers, watch streams reinitialize with current state on boot, and idempotent reconcilers make repeated work harmless, so a short outage delays convergence but does not break it. Controllers that need faster failover should run multiple replicas with Lease-based leader election and step down on SIGTERM. Linkerd's policy controller is cited as a user of leader election.

## Consequences

A single replica is simple and tolerates restarts because of eventual consistency, but convergence pauses during a restart or a rollout. Leader election reduces that pause only to the lease expiry, and it adds a coordination component. Rollout surge can briefly create overlap. See [findings/duplicate-work-from-replicas-without-leader-election](../findings/duplicate-work-from-replicas-without-leader-election.md) and [concepts/idempotency](../concepts/idempotency.md).

## Related

[entities/kube-rs](../entities/kube-rs.md), [concepts/eventual-consistency-and-convergence](../concepts/eventual-consistency-and-convergence.md)

## Flux source-controller as a worked case

The 2026-11-26 o2 dossier shows one controller where the trade-off is concrete. Flux source-controller ships with one replica, a Recreate strategy, and `--enable-leader-election`, and the artifact server runs only on the leader, so standbys give failover and no capacity. During a restart the Service has no ready endpoint until the new pod is elected, and dependents fail fetches until artifacts exist again. See [findings/flux-source-controller-starts-its-artifact-server-only-after-winning-leader-election-and-standbys-fail-readiness](../findings/flux-source-controller-starts-its-artifact-server-only-after-winning-leader-election-and-standbys-fail-readiness.md) and [findings/the-stock-flux-source-controller-keeps-artifacts-in-an-emptydir-with-one-minute-retention-so-a-restart-rebuilds-them](../findings/the-stock-flux-source-controller-keeps-artifacts-in-an-emptydir-with-one-minute-retention-so-a-restart-rebuilds-them.md). [sources/research-gap-o2-flux-internals](../sources/research-gap-o2-flux-internals.md)

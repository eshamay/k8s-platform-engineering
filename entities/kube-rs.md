---
title: kube-rs
type: entity
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-eventual-consistency-and-convergence
    hash: bb35eafbd239
    ingested: 2026-11-25
aliases: [kube]
tags: [tool, controllers, rust, framework]
---

# kube-rs

kube-rs is a Rust library for writing Kubernetes clients and controllers. Its controllers guide is the dossier's source for how small operators run in production. [sources/research-eventual-consistency-and-convergence](../sources/research-eventual-consistency-and-convergence.md)

## Availability guidance

The guide explains that most controllers can run as a single replica because they are queue consumers, their watch streams reinitialize with current state on boot, and idempotent reconcilers make repeats harmless. It describes Lease-based leader election, step-down on SIGTERM, and the hazards of rollout surge. Small Rust operators built on it are run as single replicas that tolerate restarts. URL: https://kube.rs/controllers/availability/. See [decisions/single-replica-versus-leader-election](../decisions/single-replica-versus-leader-election.md) and [findings/duplicate-work-from-replicas-without-leader-election](../findings/duplicate-work-from-replicas-without-leader-election.md).

## Related

[entities/controller-runtime](controller-runtime.md), [concepts/eventual-consistency-and-convergence](../concepts/eventual-consistency-and-convergence.md), [concepts/idempotency](../concepts/idempotency.md)

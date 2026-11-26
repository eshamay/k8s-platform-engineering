---
title: Idempotency
type: concept
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: krm-platform-vocabulary
    hash: 731a6941f9db
    ingested: 2026-11-25
  - id: research-level-triggered-vs-edge-triggered
    hash: 27a34aa0de59
    ingested: 2026-11-25
  - id: research-eventual-consistency-and-convergence
    hash: bb35eafbd239
    ingested: 2026-11-25
aliases: []
tags: [controllers]
---

# Idempotency

## Definition

Ensuring that running the same reconciliation logic multiple times produces the same result, without duplicating resources or causing errors. [[sources/krm-platform-vocabulary]]

## Why it matters

Because a level-triggered loop can run at any time and any number of times, a non-idempotent reconcile creates duplicates or fails on the second run. External APIs that lack natural idempotency (for example, creating a resource with a generated ID) need extra bookkeeping.

## Reading all state first

The controller-runtime FAQ says reconcile functions must be idempotent and must always read all the state they need before writing updates, which makes them tolerate skipped or coalesced events and restarts. [[sources/research-level-triggered-vs-edge-triggered]] See [[findings/event-specific-logic-in-reconcilers]] and [[findings/stale-cache-and-double-action]].

## Idempotency under convergence

Convergence depends on idempotence in three places. Idempotent reconcilers make extra runs harmless, which is why most controllers can run as a single replica. Argo CD hooks run on every sync and must be idempotent. Failed operations are retried with backoff, so each retry must be safe. [[sources/research-eventual-consistency-and-convergence]] See [[decisions/single-replica-versus-leader-election]].

## Related

[[concepts/reconciliation-loop]], [[concepts/level-triggered-vs-edge-triggered]], [[concepts/provider]]

## To research

Patterns for idempotent creates against cloud APIs, such as external-name annotations in Crossplane.

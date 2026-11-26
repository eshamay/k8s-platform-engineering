---
title: Events as hints, state as truth
type: decision
status: draft
created: 2026-11-25
updated: 2026-11-26
sources:
  - id: research-level-triggered-vs-edge-triggered
    hash: 27a34aa0de59
    ingested: 2026-11-25
  - id: research-gap-m5-informers-caches
    hash: 1a6a4969c0c2
    ingested: 2026-11-26
aliases: [Hybrid level and edge triggering]
tags: [controllers, architecture, level-triggered]
---

# Events as hints, state as truth

## Status

Accepted in upstream Kubernetes design. This page records the rationale as the dossier reports it; it is not an ADR authored by this wiki.

## Context

A controller must notice that something changed, and it must stay correct when notifications are lost. Watch connections drop, controllers restart, and events are batched or coalesced. Pure event handling is cheap and fast but leaves the system permanently wrong after one missed event. Pure polling is robust but slow and wasteful. [[sources/research-level-triggered-vs-edge-triggered]]

## Decision

Controllers are level-based, and watch events are used only as hints. The Kubernetes design archive says "Controllers are level-based to maximize fault tolerance," and that watches restore the latency and efficiency benefits of edge triggering without making correctness depend on them. In practice an event enqueues an object key, and the reconciler then reads the full state from a cache and enforces all of it. [[sources/research-level-triggered-vs-edge-triggered]] See [[concepts/level-triggered-vs-edge-triggered]] and [[concepts/informers-reflectors-and-workqueues]].

## Consequences

Correctness depends only on being able to observe the current state, so a missed event is repaired by the next reconcile. The price is that authors must write idempotent reconcilers that never branch on the event type (see [[findings/event-specific-logic-in-reconcilers]]), that stale cache reads can cause double action (see [[findings/stale-cache-and-double-action]]), and that repeated checking costs reads and external API calls (see [[findings/cost-of-constant-reconciliation]]).

## Alternatives considered

Edge-triggered handling is not always wrong. The HackerNoon explainer and the design archive both note that edge signals are efficient and can be made safe with periodic full resync or with ordered, versioned events. The dossier's sources differ in framing: the first-principles book and HackerNoon describe a pure level-triggered design, while the design archive and the Ayson post describe a hybrid that uses watch events and expectations, so tutorials should present the hybrid. [[sources/research-level-triggered-vs-edge-triggered]]

## Related

[[concepts/reconciliation-loop]], [[concepts/idempotency]], [[concepts/eventual-consistency-and-convergence]]

The principle's wording traces to the Controller Writing Guide and the archived design principles ("Edge-triggered behavior must be just an optimization"), see [[findings/the-level-driven-not-edge-driven-guideline-is-point-3-of-the-controller-writing-guide-and-the-beda-quote-remains-second-hand]]. [[sources/research-gap-m5-informers-caches]]

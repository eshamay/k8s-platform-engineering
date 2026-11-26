---
title: Level-Triggered vs Edge-Triggered
type: concept
status: active
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: krm-platform-vocabulary
    hash: 731a6941f9db
    ingested: 2026-11-25
  - id: research-declarative-vs-imperative
    hash: 570767ba4094
    ingested: 2026-11-25
  - id: research-level-triggered-vs-edge-triggered
    hash: 27a34aa0de59
    ingested: 2026-11-25
  - id: research-eventual-consistency-and-convergence
    hash: bb35eafbd239
    ingested: 2026-11-25
aliases: [State-based vs event-based]
tags: [architecture, controllers]
---

# Level-Triggered vs Edge-Triggered

## Definition

The terms come from electronics and interrupt handling. An edge-triggered system reacts to a transition, such as "the signal went high" or "a Pod was deleted." A level-triggered system reacts to the current value, such as "the signal is high" or "3 replicas desired, 2 exist." A level-triggered (state-based) controller therefore bases its logic on the current state of a resource, comparing spec with reality, while an edge-triggered (event-based) controller reacts to the specific event that caused a change. If a level-triggered controller misses an event, the next reconciliation still converges to the right state. [[sources/krm-platform-vocabulary]] [[sources/research-level-triggered-vs-edge-triggered]]

## Why it matters

This property is why controllers tolerate restarts, dropped watch events, batching, and network partitions. It shapes how [[concepts/reconciliation-loop]] is written: the loop must derive its work from observed state, never from the triggering event alone. The sources agree on the core reason, which is robustness to lost or coalesced information. If correctness depends on seeing every event, one missed event leaves the system permanently wrong. If correctness depends only on being able to observe the current state, the next reconcile repairs the damage. [[sources/research-level-triggered-vs-edge-triggered]]

## Why edge-triggering breaks

The HackerNoon explainer shows this with arithmetic: a missed "-1" event leaves an edge-triggered counter at 3 when the true value is 2. A lossy channel leaves a level-triggered view delayed but correct, while an edge-triggered view can end in a state the original signal never had. Joe Beda is quoted there as saying "If you are edge triggered you run risk of compromising your state and never being able to re-create the state." An online book sums it up as "Edge-triggered systems require reliable event delivery; level-triggered systems only require eventual state observation." [[sources/research-level-triggered-vs-edge-triggered]]

## Kubernetes is a hybrid

In practice watches and informers deliver events with low latency, which is an edge-triggered optimization. The event is only a hint to enqueue an object key, and the reconciler then reads full state from a cache and enforces all of it. The Kubernetes design archive says "Controllers are level-based to maximize fault tolerance," and that watches restore edge-triggered latency benefits without making correctness depend on them. Tim Hockin's slides make the same point: the cache is updated by events, yet controllers still reconcile full state. See [[decisions/events-as-hints-state-as-truth]] and [[concepts/informers-reflectors-and-workqueues]]. Edge-triggering is not always wrong either, since it transmits only changes and can be made safe with periodic full resync or ordered, versioned events.

## Declarative evidence

The API conventions state that "the system's behavior is level-based rather than edge-based," so the system drives toward the latest spec regardless of intermediate values. [[sources/research-declarative-vs-imperative]] See [[concepts/declarative-vs-imperative]].

## Rules for controller authors

The controller-runtime Reconciler is not told the event type, and its docs say reconciliation is "driven by actual cluster state." Authors must reconcile idempotently by reading all needed state, must not branch on create, update, or delete, and must tolerate skipped or coalesced events. See [[entities/controller-runtime]], [[concepts/idempotency]], and [[findings/event-specific-logic-in-reconcilers]].

## Costs and limits of level-triggering

Pure level-triggering is not free. A cache read can lag the controller's own writes, so a controller can act twice on one gap, which Kubernetes handles with deterministic names or expectations (see [[findings/stale-cache-and-double-action]] and [[examples/how-core-controllers-handle-cache-lag]]). Constant re-checking costs reads and external API calls (see [[findings/cost-of-constant-reconciliation]]), a continuous loop reverts intentional changes (see [[findings/continuous-loops-override-intentional-changes]]), and a failing reconcile retries forever unless bounded (see [[findings/failure-retry-loops-and-backoff]]). Tools expose these trade-offs as intervals, jitter, backoff, and pause controls. See [[comparisons/reconcile-cadence-and-off-switches-across-tools]].

## In practice

See [[examples/gitops-reverts-a-hand-edited-deployment]], [[examples/cloud-console-changes-reverted-by-provider-controllers]], and [[examples/controller-pattern-for-digital-twins]].

## Convergence framing

The convergence dossier repeats Tim Hockin's framing, "State is more useful than events," and the replica scenario in which a level-triggered controller ends at the final count while an edge-triggered one can end at zero. It treats level-triggering as the mechanism that makes eventual consistency robust. [[sources/research-eventual-consistency-and-convergence]] See [[concepts/eventual-consistency-and-convergence]] and [[examples/deployment-replica-changes-converge-to-the-final-count]].

## Related

[[concepts/eventual-consistency-and-convergence]], [[concepts/informers-reflectors-and-workqueues]], [[concepts/idempotency]], [[concepts/self-healing-and-drift-detection]]

## To research

Informer resync period semantics (replay of cached state versus relist), the original "Controller Writing Guide," and named-company incidents caused by lost-event design. See [[open-knowledge-gaps]].

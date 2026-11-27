---
title: Level-Triggered vs Edge-Triggered
type: concept
status: active
created: 2026-11-25
updated: 2026-11-26
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
  - id: research-gap-g1-operator-loop-failures
    hash: baca2cdf965d
    ingested: 2026-11-26
  - id: research-gap-m5-informers-caches
    hash: 1a6a4969c0c2
    ingested: 2026-11-26
aliases: [State-based vs event-based]
tags: [architecture, controllers]
---

# Level-Triggered vs Edge-Triggered

## Definition

The terms come from electronics and interrupt handling. An edge-triggered system reacts to a transition, such as "the signal went high" or "a Pod was deleted." A level-triggered system reacts to the current value, such as "the signal is high" or "3 replicas desired, 2 exist." A level-triggered (state-based) controller therefore bases its logic on the current state of a resource, comparing spec with reality, while an edge-triggered (event-based) controller reacts to the specific event that caused a change. If a level-triggered controller misses an event, the next reconciliation still converges to the right state. [sources/krm-platform-vocabulary](../sources/krm-platform-vocabulary.md) [sources/research-level-triggered-vs-edge-triggered](../sources/research-level-triggered-vs-edge-triggered.md)

## Why it matters

This property is why controllers tolerate restarts, dropped watch events, batching, and network partitions. It shapes how [concepts/reconciliation-loop](reconciliation-loop.md) is written: the loop must derive its work from observed state, never from the triggering event alone. The sources agree on the core reason, which is robustness to lost or coalesced information. If correctness depends on seeing every event, one missed event leaves the system permanently wrong. If correctness depends only on being able to observe the current state, the next reconcile repairs the damage. [sources/research-level-triggered-vs-edge-triggered](../sources/research-level-triggered-vs-edge-triggered.md)

## Why edge-triggering breaks

The HackerNoon explainer shows this with arithmetic: a missed "-1" event leaves an edge-triggered counter at 3 when the true value is 2. A lossy channel leaves a level-triggered view delayed but correct, while an edge-triggered view can end in a state the original signal never had. Joe Beda is quoted there as saying "If you are edge triggered you run risk of compromising your state and never being able to re-create the state." An online book sums it up as "Edge-triggered systems require reliable event delivery; level-triggered systems only require eventual state observation." [sources/research-level-triggered-vs-edge-triggered](../sources/research-level-triggered-vs-edge-triggered.md)

## Kubernetes is a hybrid

In practice watches and informers deliver events with low latency, which is an edge-triggered optimization. The event is only a hint to enqueue an object key, and the reconciler then reads full state from a cache and enforces all of it. The Kubernetes design archive says "Controllers are level-based to maximize fault tolerance," and that watches restore edge-triggered latency benefits without making correctness depend on them. Tim Hockin's slides make the same point: the cache is updated by events, yet controllers still reconcile full state. See [decisions/events-as-hints-state-as-truth](../decisions/events-as-hints-state-as-truth.md) and [concepts/informers-reflectors-and-workqueues](informers-reflectors-and-workqueues.md). Edge-triggering is not always wrong either, since it transmits only changes and can be made safe with periodic full resync or ordered, versioned events.

## Declarative evidence

The API conventions state that "the system's behavior is level-based rather than edge-based," so the system drives toward the latest spec regardless of intermediate values. [sources/research-declarative-vs-imperative](../sources/research-declarative-vs-imperative.md) See [concepts/declarative-vs-imperative](declarative-vs-imperative.md).

## Rules for controller authors

The controller-runtime Reconciler is not told the event type, and its docs say reconciliation is "driven by actual cluster state." Authors must reconcile idempotently by reading all needed state, must not branch on create, update, or delete, and must tolerate skipped or coalesced events. See [entities/controller-runtime](../entities/controller-runtime.md), [concepts/idempotency](idempotency.md), and [findings/event-specific-logic-in-reconcilers](../findings/event-specific-logic-in-reconcilers.md).

## Costs and limits of level-triggering

Pure level-triggering is not free. A cache read can lag the controller's own writes, so a controller can act twice on one gap, which Kubernetes handles with deterministic names or expectations (see [findings/stale-cache-and-double-action](../findings/stale-cache-and-double-action.md) and [examples/how-core-controllers-handle-cache-lag](../examples/how-core-controllers-handle-cache-lag.md)). Constant re-checking costs reads and external API calls (see [findings/cost-of-constant-reconciliation](../findings/cost-of-constant-reconciliation.md)), a continuous loop reverts intentional changes (see [findings/continuous-loops-override-intentional-changes](../findings/continuous-loops-override-intentional-changes.md)), and a failing reconcile retries forever unless bounded (see [findings/failure-retry-loops-and-backoff](../findings/failure-retry-loops-and-backoff.md)). Tools expose these trade-offs as intervals, jitter, backoff, and pause controls. See [comparisons/reconcile-cadence-and-off-switches-across-tools](../comparisons/reconcile-cadence-and-off-switches-across-tools.md).

## In practice

See [examples/gitops-reverts-a-hand-edited-deployment](../examples/gitops-reverts-a-hand-edited-deployment.md), [examples/cloud-console-changes-reverted-by-provider-controllers](../examples/cloud-console-changes-reverted-by-provider-controllers.md), and [examples/controller-pattern-for-digital-twins](../examples/controller-pattern-for-digital-twins.md).

## Convergence framing

The convergence dossier repeats Tim Hockin's framing, "State is more useful than events," and the replica scenario in which a level-triggered controller ends at the final count while an edge-triggered one can end at zero. It treats level-triggering as the mechanism that makes eventual consistency robust. [sources/research-eventual-consistency-and-convergence](../sources/research-eventual-consistency-and-convergence.md) See [concepts/eventual-consistency-and-convergence](eventual-consistency-and-convergence.md) and [examples/deployment-replica-changes-converge-to-the-final-count](../examples/deployment-replica-changes-converge-to-the-final-count.md).

## Related

[concepts/eventual-consistency-and-convergence](eventual-consistency-and-convergence.md), [concepts/informers-reflectors-and-workqueues](informers-reflectors-and-workqueues.md), [concepts/idempotency](idempotency.md), [concepts/self-healing-and-drift-detection](self-healing-and-drift-detection.md)

## To research

Named-company incidents caused by lost-event design remain open. Resync semantics and the guide's origin were settled on 2026-11-26: a resync replays cached state and does not relist ([findings/a-resync-replays-the-informers-local-cache-to-the-handlers-and-never-contacts-the-api-server](../findings/a-resync-replays-the-informers-local-cache-to-the-handlers-and-never-contacts-the-api-server.md)), and "Level driven, not edge driven." is guideline 3 of the Controller Writing Guide ([findings/the-level-driven-not-edge-driven-guideline-is-point-3-of-the-controller-writing-guide-and-the-beda-quote-remains-second-hand](../findings/the-level-driven-not-edge-driven-guideline-is-point-3-of-the-controller-writing-guide-and-the-beda-quote-remains-second-hand.md)). See [open-knowledge-gaps](../open-knowledge-gaps.md).

## Update from the operator loop dossier

The 2026-11-26 dossier found no named-company outage caused by edge-triggered design. It found two primary cases of lost events: a client-go relist that could drop a DELETE for a short-lived object (Kubernetes issue 115658, fixed by pull requests 115620 and 116623) and a delete that happened while a monitor was down and was never delivered (NVSentinel issue 1542). Both support the rule that an event is a hint and that state-keyed logic or a finalizer must cover the gap. See [findings/an-informer-relist-that-races-a-queued-create-can-drop-the-delete-event-for-the-object](../findings/an-informer-relist-that-races-a-queued-create-can-drop-the-delete-event-for-the-object.md), [findings/a-delete-that-happens-while-a-controller-is-down-is-never-delivered-so-finalizers-or-resync-must-cover-it](../findings/a-delete-that-happens-while-a-controller-is-down-is-never-delivered-so-finalizers-or-resync-must-cover-it.md), and [findings/projects-add-periodic-resync-as-a-safety-net-against-missed-events-and-bugs](../findings/projects-add-periodic-resync-as-a-safety-net-against-missed-events-and-bugs.md). Source: [sources/research-gap-g1-operator-loop-failures](../sources/research-gap-g1-operator-loop-failures.md).

## Origin of the guideline (m5 dossier)

The guide the earlier sections cite second-hand is "Writing Controllers" in kubernetes/community at `contributors/devel/sig-api-machinery/controllers.md`. "Level driven, not edge driven." is its third guideline, and it adds that "you can't count on having seen it turn from `false` to `true`, only that you now observe it being `true`", and that a controller should record the information it last decided on in the object's status. The design-principle form, "Edge-triggered behavior must be just an optimization", is in the archived principles document (first commit 2017-09-06), and Tim Hockin's slides of 2017-06-02 say "State is more useful than events". The Joe Beda quotation above is known only through the 2018 Hacker Noon post and stays SECONDARY-ONLY, because Cloud Native Infrastructure was not read. [sources/research-gap-m5-informers-caches](../sources/research-gap-m5-informers-caches.md) See [findings/the-level-driven-not-edge-driven-guideline-is-point-3-of-the-controller-writing-guide-and-the-beda-quote-remains-second-hand](../findings/the-level-driven-not-edge-driven-guideline-is-point-3-of-the-controller-writing-guide-and-the-beda-quote-remains-second-hand.md).

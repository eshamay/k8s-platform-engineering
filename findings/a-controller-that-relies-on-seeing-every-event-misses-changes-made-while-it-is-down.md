---
title: A controller that relies on seeing every event misses changes made while it is down
type: finding
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-operator-pattern
    hash: eab72eca2e1b
    ingested: 2026-11-25
aliases: []
tags: [pitfall, level-triggered, controllers, restarts]
---

# A controller that relies on seeing every event misses changes made while it is down

## Observation

The sig-api-machinery guide says "Your controller may be off for an indeterminate amount of time before running again." A controller that keys its behavior on remembered events, such as "a Pod was deleted" or "a field changed from A to B," will miss whatever happened during the outage and will then act on a stale picture. The guide's rule is to be level-driven: reconcile from the current state of the world, not from a history of events. [[sources/research-operator-pattern]]

## Mitigation

Frameworks such as controller-runtime supply the informer, cache, and workqueue plumbing that makes level-based reconciliation the default, and the Kubebuilder good-practices page requires an idempotent reconcile function so repeated or late runs are harmless. URL: https://github.com/kubernetes/community/blob/master/contributors/devel/sig-api-machinery/controllers.md and https://book.kubebuilder.io/reference/good-practices.

## Related

[[concepts/level-triggered-vs-edge-triggered]], [[findings/event-specific-logic-in-reconcilers]], [[concepts/idempotency]], [[concepts/operator-pattern]]

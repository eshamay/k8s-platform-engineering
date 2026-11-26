---
title: Blocking on errors inside the sync loop stalls every other object
type: finding
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-operator-pattern
    hash: eab72eca2e1b
    ingested: 2026-11-25
aliases: []
tags: [pitfall, reconcile, error-handling, workqueue]
---

# Blocking on errors inside the sync loop stalls every other object

## Observation

The Google Cloud operator guidance advises asynchronous sync loops that do not block on errors. A reconcile that sleeps, polls, or waits inside the loop occupies a worker, and because workqueues process keys through a limited set of workers, one slow or failing object delays unrelated objects. The dossier states the advice but gives no measurements. [[sources/research-operator-pattern]]

## Mitigation

The standard alternative is to return an error or a requeue so the rate-limited workqueue retries with backoff while the worker moves on. URL: https://cloud.google.com/blog/products/containers-kubernetes/best-practices-for-building-kubernetes-operators-and-stateful-apps.

## Related

[[findings/failure-retry-loops-and-backoff]], [[findings/errors-used-as-timers-in-reconcilers]], [[findings/retry-storms-and-unbounded-retries]], [[concepts/informers-reflectors-and-workqueues]]

---
title: kro shared queue and tunable throughput
type: example
status: active
created: 2026-11-25
updated: 2026-11-26
sources:
  - id: research-eventual-consistency-and-convergence
    hash: bb35eafbd239
    ingested: 2026-11-25
  - id: research-gap-g3-kro
    hash: e8d7c5923d98
    ingested: 2026-11-26
  - id: research-gap-g1-named-adopters
    hash: 9f6a50098233
    ingested: 2026-11-26
aliases: []
tags: [kro, workqueue, backoff, tuning]
---

# kro shared queue and tunable throughput

## Scenario

kro expands each instance of a custom API into a graph of resources, and one shared dynamic controller handles every instance. The dossier reads kro's controller tuning page to show concrete numbers for the trade-off between responsiveness and API load. [[sources/research-eventual-consistency-and-convergence]]

## The numbers

The kro v0.10.0 controller tuning page, and the unreleased "next" docs the wiki read first, describe a single shared queue with configurable workers (default 1), exponential backoff from 200 milliseconds to 1000 seconds combined with a token bucket of 10 items per second and a burst of 100, client QPS of 100 with a burst of 150, a full resync every 10 hours, and a limit of 20 retries before an item is dropped. The stated reason for the shared queue is that no single ResourceGraphDefinition can overwhelm the system. URL: https://kro.run/next/docs/advanced/controller-tuning. The released page at https://github.com/kubernetes-sigs/kro/blob/v0.10.0/website/docs/docs/advanced/03-controller-tuning.md lists the same values, see [[sources/research-gap-g3-kro]].

## Caveat

Correction note: the earlier caveat that these defaults came only from unreleased documentation no longer applies. The v0.10.0 release (2026-11-10) documents the same worker count, backoff range, token bucket, client limits, resync period, and retry cap. The v0.10.0 page adds a 30 second `watchSyncTimeout`, a Graph controller concurrency of 1, `applyConcurrency` 20, a collection limit of 1000 items with 10 dimensions, and a CEL cost limit of 0 (disabled). The instance requeue interval is 3 seconds and backs off exponentially, doubling up to five minutes and resetting on progress. At v0.9.4 the same setting reads as a fixed delay, so the exponential backoff appears to be new in v0.10.0 (an inference from two pages). The docs also say per-RGD queues may replace the shared queue in future versions. The rate-limiter table at v0.9.4 was not read in full, so whether those defaults are unchanged since then is not verified. The instance conditions are documented in [[findings/kro-reserves-the-right-to-change-instance-sub-conditions-so-only-ready-is-a-stable-contract]]. [[sources/research-gap-g3-kro]]

## Lesson

Every convergence machine has a throughput budget. A shared queue with a rate limiter and a retry cap keeps one noisy graph from starving the rest, at the cost of slower convergence under load. See [[entities/kro]], [[comparisons/retry-and-backoff-controls-across-tools]], [[findings/retry-storms-and-unbounded-retries]], and [[concepts/informers-reflectors-and-workqueues]].

## Scaling evidence from the named-adopters dossier

The tuning page on main says the dynamic controller uses lazy informers per registered RGD and metadata-only watches while the queue and workers are shared. It lists defaults of 1 dynamic-controller worker, 1 RGD worker, a 36000 second resync, `watchSyncTimeout` 30s (to be raised when a kind has tens of thousands of objects), `rgd.maxCollectionSize` 1000, and `applyConcurrency` 20. These are main-branch values and may differ from tagged releases. No measured throughput exists: issue 610 asks for continuous performance testing and issue 198 proposes weighted queues. See [[findings/kro-s-single-shared-queue-can-starve-resources-and-a-maintainer-proposed-weighted-queues]]. [[sources/research-gap-g1-named-adopters]]

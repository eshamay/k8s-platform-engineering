---
title: kro shared queue and tunable throughput
type: example
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-eventual-consistency-and-convergence
    hash: bb35eafbd239
    ingested: 2026-11-25
aliases: []
tags: [kro, workqueue, backoff, tuning]
---

# kro shared queue and tunable throughput

## Scenario

kro expands each instance of a custom API into a graph of resources, and one shared dynamic controller handles every instance. The dossier reads kro's controller tuning page to show concrete numbers for the trade-off between responsiveness and API load. [[sources/research-eventual-consistency-and-convergence]]

## The numbers

The "next" (unreleased) docs describe a single shared queue with configurable workers (default 1), exponential backoff from 200 milliseconds to 1000 seconds combined with a token bucket of 10 items per second and a burst of 100, client QPS of 100 with a burst of 150, a full resync every 10 hours, and a limit of 20 retries before an item is dropped. The stated reason for the shared queue is that no single ResourceGraphDefinition can overwhelm the system. URL: https://kro.run/next/docs/advanced/controller-tuning.

## Caveat

These defaults come from unreleased documentation and may differ in released versions. The dossier could not read kro's instances concept page, so per-instance status conditions are unverified. See [[open-knowledge-gaps]].

## Lesson

Every convergence machine has a throughput budget. A shared queue with a rate limiter and a retry cap keeps one noisy graph from starving the rest, at the cost of slower convergence under load. See [[entities/kro]], [[comparisons/retry-and-backoff-controls-across-tools]], [[findings/retry-storms-and-unbounded-retries]], and [[concepts/informers-reflectors-and-workqueues]].

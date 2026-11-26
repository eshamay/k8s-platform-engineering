---
title: Crossplane max-reconcile-rate turns reconcile rate into an API call budget
type: example
status: draft
created: 2026-11-25
updated: 2026-11-26
sources:
  - id: research-gap-b1-recheck-kro-crossplane
    hash: ccee0efa5bdd
    ingested: 2026-11-26
  - id: research-informers-reflectors-and-workqueues
    hash: f9de5ca73ab6
    ingested: 2026-11-25
aliases: []
tags: [crossplane, rate-limiting, external-api, providers]
---

# Crossplane max-reconcile-rate turns reconcile rate into an API call budget

## Scenario

Crossplane providers reconcile external cloud resources, so every reconcile may become a call to a cloud API that has its own quotas. The dossier reads Crossplane issue 2595, which proposed a single flag to govern this. [[sources/research-informers-reflectors-and-workqueues]]

## The problem and the proposal

The issue argues that provider performance was governed by scattered knobs (`QPS`, `PollInterval`, `MaxConcurrentReconciles`, and `RateLimiter`), and that none of them directly bounded external API calls. It proposed a `--max-reconcile-rate` flag on Crossplane and all providers that caps reconciles per second globally, derives the other settings from it, and works with `--poll-interval`. Its stated reasoning is that "Reconcile rate in Crossplane is a good proxy for average external API call rate." The dossier reports that the flag was merged for Crossplane 1.6 and adopted by providers, and that scale tests reached hundreds of thousands of objects. URL: https://github.com/crossplane/crossplane/issues/2595.

## Lesson

A workqueue limiter normally protects the API server. For a provider, the same queue is also the budget for someone else's API. Choosing the reconcile rate as the single control makes the cloud call rate predictable. The dossier did not read Crossplane's current performance guide, so the present defaults are unknown. See [[entities/crossplane]], [[comparisons/concurrency-and-cache-memory-controls-across-flux-argo-cd-and-crossplane]], [[findings/retry-storms-and-unbounded-retries]], and [[concepts/informers-reflectors-and-workqueues]].

## Later history of the flag (2026-11-26)

Correction note: this page describes the 2021 proposal and the Crossplane 1.6 flag. The v2.1.0 release renamed `--max-reconcile-rate` to `--max-concurrent-reconciles`, and in v2.5.0 source the old name is an alias for a worker pool size with a default of 100, not a per-second rate. See [[findings/the-crossplane-v2-5-docs-describe-max-reconcile-rate-as-a-rate-but-source-treats-it-as-a-worker-pool-size-alias]]. [[sources/research-gap-b1-recheck-kro-crossplane]]

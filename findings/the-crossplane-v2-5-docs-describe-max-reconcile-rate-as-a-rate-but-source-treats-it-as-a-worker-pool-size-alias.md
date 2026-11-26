---
title: The Crossplane v2.5 docs describe max-reconcile-rate as a rate but source treats it as a worker pool size alias
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-b1-recheck-kro-crossplane
    hash: ccee0efa5bdd
    ingested: 2026-11-26
aliases: []
tags: [crossplane, scaling, flags, documentation-drift, concurrency]
---

# The Crossplane v2.5 docs describe max-reconcile-rate as a rate but source treats it as a worker pool size alias

## Observation

The v2.1.0 release notes say that "The `--max-reconcile-rate` flag has been renamed to this new `--max-concurrent-reconciles` flag". In `cmd/crossplane/core/core.go` at v2.5.0 the flag is `MaxConcurrentReconciles`, with the help text "The maximum number of concurrent reconcile operations (worker pool size).", a default of 100, and `max-reconcile-rate` kept as an alias. The v2.5 pods guide in the crossplane/docs repository still says the flag "defines the rate, in times per second, Crossplane reconciles resources". The docs therefore describe a rate in per-second units, while the source describes a count of concurrent workers. [[sources/research-gap-b1-recheck-kro-crossplane]] URL: https://github.com/crossplane/docs/blob/master/content/v2.5/guides/pods.md

The same source gives the other v2.5.0 defaults: poll interval 1 minute, sync interval 1 hour, minimum per-resource poll interval 1 second, and 10 concurrent package establishers.

## Why it matters

The 2021 design that introduced the flag used reconcile rate as a proxy for cloud API call rate, see [[examples/crossplane-max-reconcile-rate-turns-reconcile-rate-into-an-api-call-budget]]. A reader who sizes the v2 flag from the docs would treat 100 as a ceiling of 100 reconciles per second, while the source treats it as 100 workers. How many calls per second 100 workers produce depends on how long each reconcile takes, so the flag no longer states a call budget on its own.

## Mitigations

Use the flag name `--max-concurrent-reconciles` for v2, read the alias as a worker pool size, and verify the provider's own flag separately, since providers define their own. See [[entities/crossplane]], [[comparisons/concurrency-and-cache-memory-controls-across-flux-argo-cd-and-crossplane]], and [[concepts/scale-and-sharding]].

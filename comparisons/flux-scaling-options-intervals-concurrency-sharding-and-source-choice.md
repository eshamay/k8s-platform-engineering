---
title: Flux scaling options, intervals, concurrency, sharding, and source choice
type: comparison
status: draft
created: 2026-11-25
updated: 2026-11-26
sources:
  - id: research-flux-deep-dive
    hash: e640ec8046bc
    ingested: 2026-11-25
  - id: research-gap-g1-named-adopters
    hash: 9f6a50098233
    ingested: 2026-11-26
aliases: []
tags: [flux, scale, sharding, comparison, tuning]
---

# Flux scaling options, intervals, concurrency, sharding, and source choice

| Option | What it changes | Evidence in the dossier | Cost |
|---|---|---|---|
| Longer reconciliation intervals | Fewer scheduled reconciles and less API load | Used by Morgan Stanley | Slower drift correction |
| `--concurrent` and resource limits | More objects reconciled in parallel by the one active instance | Used by Morgan Stanley | More memory and API load per instance |
| More replicas | Failover only, because only the leader reconciles | Sharding page | No added capacity |
| Label-based sharding | Splits objects across separately named controllers | Sharding page, Flux Operator docs | Labels must be kept consistent across dependents |
| Object-store source (S3) instead of a self-hosted Git provider | Moves artifact fetching off the Git host | Used by Morgan Stanley for availability and compliance | A different source type to manage |
| Webhook Receivers | Starts reconciliation on push | Notification controller docs | Extra endpoints and credentials |

[[sources/research-flux-deep-dive]]

## Reading the table

Only the first, second, and fifth rows were used in production by the one named adopter, and that adopter listed sharding as roadmap work. The sharding row therefore rests on documentation, not on a measured deployment. Webhooks are a latency tool and do not reduce periodic load.

## Related

[[decisions/shard-flux-controllers-or-tune-intervals-and-concurrency-first]], [[comparisons/concurrency-and-cache-memory-controls-across-flux-argo-cd-and-crossplane]], [[examples/flux-controllers-expose-worker-concurrency-and-helm-cache-size-as-tuning-knobs]], [[examples/morgan-stanley-runs-flux-across-more-than-500-clusters-with-self-service-onboarding]], [[findings/extra-replicas-of-a-flux-controller-add-failover-not-capacity]]

## Evidence from the named-adopters dossier

The sharding page advises sharding at "tens of thousands of applications", the project benchmark reconciles 1000 Kustomizations in 4m13s at concurrency 20, and no organization was found that runs sharded Flux. Morgan Stanley, at more than 500 clusters, scaled by intervals, concurrency, and limits. See [[examples/the-flux-benchmark-reconciles-1000-kustomizations-in-4-minutes-13-seconds-on-flux-v2-10-0]] and [[examples/morgan-stanley-runs-flux-across-more-than-500-clusters-with-self-service-onboarding]]. [[sources/research-gap-g1-named-adopters]]

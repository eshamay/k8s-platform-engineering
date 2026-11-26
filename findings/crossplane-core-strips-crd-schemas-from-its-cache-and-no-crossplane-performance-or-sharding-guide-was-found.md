---
title: Crossplane core strips CRD schemas from its cache, and no Crossplane performance or sharding guide was found
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-m5-informers-caches
    hash: 1a6a4969c0c2
    ingested: 2026-11-26
aliases: [Crossplane performance guidance]
tags: [crossplane, cache, performance, sharding, controller-runtime, mechanism]
---

# Crossplane core strips CRD schemas from its cache, and no Crossplane performance or sharding guide was found

## Observation

Crossplane core (main) builds a dedicated cache for the API-extensions kinds with a transform whose comment reads "Strip the OpenAPI schemas (most of CRDs' size) from typed CRDs in this cache." It sets the client's `DisableFor` list to include Secret, sets the cache `SyncPeriod` from the sync-interval flag, and defaults the worker pool to 100 with the flag help "The maximum number of concurrent reconcile operations (worker pool size)." https://github.com/crossplane/crossplane/blob/main/cmd/crossplane/core/core.go [[sources/research-gap-m5-informers-caches]]

The closest official guidance is the "Crossplane Pods" guide. It gives a default polling rate of "one minute", a sync interval that Crossplane runs "every one hour by default", and says "Most Providers use their own `--max-reconcile-rate`." https://github.com/crossplane/docs/blob/master/content/master/guides/pods.md (docs master, rendered as v2.x). The doc default for poll interval agrees with the source, and the one-hour sync interval was not cross-checked against the source flag default.

## What was not found

The guessed URL `docs.crossplane.io/latest/guides/performance/` scraped empty, and the crossplane/docs tree has no performance guide. A search for "perform", "scal" and "tuning" found only `pods.md`, `scalable-composition.md` (about the scale subresource) and `troubleshoot-crossplane.md`. No Crossplane documentation describes informer sharding. The statement that no such guide exists is therefore UNVERIFIED and means only that none was found.

One vendor article, an Upbound knowledge-base page last updated "7 months ago", says that after a provider restart "All managed resources are re-queued for reconciliation immediately" because the cache is rebuilt, and that a poll interval of 30 minutes or an hour cuts drift checks by three or six times. It is SECONDARY-ONLY because it comes from a vendor and not the Crossplane project. https://help.upbound.io/articles/9922842107-understanding-gcp-provider-reconcile-rates-and-api-call-volume

## Related

[[comparisons/concurrency-and-cache-memory-controls-across-flux-argo-cd-and-crossplane]], [[findings/the-crossplane-v2-5-docs-describe-max-reconcile-rate-as-a-rate-but-source-treats-it-as-a-worker-pool-size-alias]], [[findings/crossplane-provider-memory-figures-are-design-doc-targets-not-measurements]], [[entities/crossplane]].

---
title: "No official Upjet memory or CPU figures exist, and the memory-footprint issue was closed as outdated by provider families"
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-o8-crossplane-residuals
    hash: 35c6f2fb6101
    ingested: 2026-11-26
aliases: []
tags: [upjet, crossplane, memory, cpu, provider-family, negative-finding]
---

# No official Upjet memory or CPU figures exist, and the memory-footprint issue was closed as outdated by provider families

## Observation

The Upjet documentation and issues read contain no per-resource or per-provider memory or CPU numbers, and no requests or limits. The dossier searched the Upjet docs listing and issue searches for "memory", "OOM", "CPU", and "no-fork" and found nothing numeric. That is an UNVERIFIED negative finding: it says none was found, not that none exists. [sources/research-gap-o8-crossplane-residuals](../sources/research-gap-o8-crossplane-residuals.md)

The one first-party cost thread is issue 151, "Capture Provider memory footprint with releases". It was closed, and a collaborator comment says it is outdated after the provider family architecture introduced in Upjet v0.9.0, adding "The use of the large monolithic provider packages for AWS, GCP and Azure is discouraged". The reason given elsewhere in the wiki is that the API server handles many CRDs inefficiently. https://github.com/crossplane/upjet/issues/151 (VERIFIED, collaborator comment)

## Why it matters

A platform team sizing a provider pod has the metrics from [findings/upjet-cli-mode-keeps-a-terraform-workspace-per-resource-and-shares-a-forked-provider-process-until-an-invocation-ttl](upjet-cli-mode-keeps-a-terraform-workspace-per-resource-and-shares-a-forked-provider-process-until-an-invocation-ttl.md) to measure with but no published baseline to compare against. The closest quantitative evidence in the wiki is about CRD counts and core Crossplane memory, see [examples/crossplane-v2-4-and-v2-5-cut-memory-on-clusters-with-hundreds-to-two-thousand-crds](../examples/crossplane-v2-4-and-v2-5-cut-memory-on-clusters-with-hundreds-to-two-thousand-crds.md) and [findings/splitting-a-provider-into-a-family-trades-fewer-crds-for-more-pods-and-memory](splitting-a-provider-into-a-family-trades-fewer-crds-for-more-pods-and-memory.md).

## Related

[entities/upjet](../entities/upjet.md), [decisions/split-a-large-provider-into-families-or-filter-or-lazy-load-its-crds](../decisions/split-a-large-provider-into-families-or-filter-or-lazy-load-its-crds.md)

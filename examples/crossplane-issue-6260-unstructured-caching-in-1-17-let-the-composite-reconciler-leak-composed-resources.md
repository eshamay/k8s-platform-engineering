---
title: Crossplane issue 6260 unstructured caching in 1.17 let the composite reconciler leak composed resources
type: example
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-g1-leaked-resources-adoption
    hash: 472b18eb451a
    ingested: 2026-11-26
aliases: [Crossplane issue 6260]
tags: [crossplane, composite-resource, stale-cache, duplicate-create, crossplane-1-17]
---

# Crossplane issue 6260 unstructured caching in 1.17 let the composite reconciler leak composed resources

## Scenario

On 2025-02-01 bobh66 opened Crossplane issue 6260, which was later closed. The report concerns Crossplane 1.17, where the composite reconciler read objects through a cache of unstructured objects. [[sources/research-gap-g1-leaked-resources-adoption]] URL: https://github.com/crossplane/crossplane/issues/6260

## What happened

The reporter's analysis is that the composite reconciler "can leak resources when it runs multiple reconciliations in a row". A cached read did not yet show a composed resource that an earlier pass had created, so the next pass created another one. The leaked objects are Kubernetes composed objects and not cloud resources.

## Why it belongs here

It is the same mechanism as the stale-cache leak scenario that the Crossplane maintainer lists in issue 3037, a stale read followed by a second create, one layer up in the composition loop. See [[findings/stale-cache-and-double-action]] and [[examples/built-in-controllers-use-deterministic-names-to-avoid-duplicate-children]].

## Related

[[entities/crossplane]], [[concepts/composite-resource]], [[findings/an-ambiguous-create-result-halts-reconciliation-until-a-human-intervenes]]

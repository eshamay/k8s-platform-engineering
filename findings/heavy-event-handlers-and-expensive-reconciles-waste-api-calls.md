---
title: Heavy event handlers and expensive reconciles waste API calls
type: finding
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-informers-reflectors-and-workqueues
    hash: f9de5ca73ab6
    ingested: 2026-11-25
aliases: []
tags: [pitfall, handlers, reconcile, cache, indexer]
---

# Heavy event handlers and expensive reconciles waste API calls

## Observation

Both the client-go documents and the pitfalls blog say event handlers should only enqueue a key. Doing real work in a handler ties processing to delivery and bypasses the queue's deduplication and rate limiting. The pitfalls blog adds that Reconcile runs every time any of its event sources changes, so a reconciler that makes needless API calls multiplies load, and that missing `observedGeneration` or status handling leaves reconcilers acting on stale or absent information. [[sources/research-informers-reflectors-and-workqueues]]

## Mitigations

Read through the cache and not the API server, and add field indexers so lookups such as "Jobs owned by this CronJob" do not scan the whole cache. See [[examples/kubebuilder-owns-and-a-field-indexer-wire-child-changes-to-the-owner]]. Writes and status updates still go to the API server, so keep them minimal and compare before writing. See [[findings/status-writes-through-the-main-resource-retrigger-reconcile-loops]] and [[findings/self-triggered-reconcile-loops-generate-their-own-events]].

## Related

[[concepts/informers-reflectors-and-workqueues]], [[findings/missing-observedgeneration-hides-stale-status]]

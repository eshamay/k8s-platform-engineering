---
title: Mutating objects from a shared cache or reading an unsynced cache corrupts reconcile input
type: finding
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-operator-pattern
    hash: eab72eca2e1b
    ingested: 2026-11-25
aliases: []
tags: [pitfall, informers, caches, controllers]
---

# Mutating objects from a shared cache or reading an unsynced cache corrupts reconcile input

## Observation

The controller guidelines document two cache mistakes. The first is mutating an object returned from a shared informer cache, which changes what every other consumer of that cache sees. The second is acting before a secondary cache has synced, so the controller decides from incomplete data. The dossier gives the cure for both: copy objects before modifying them, and wait for caches to sync before starting workers. [[sources/research-operator-pattern]]

## Interpretation

Both mistakes are silent. The controller keeps running and simply reasons from wrong input, which is why the guide states them as hard rules alongside using SharedInformers and rate-limited workqueues that process one key at a time. URL: https://github.com/kubernetes/community/blob/master/contributors/devel/sig-api-machinery/controllers.md.

## Related

[[concepts/informers-reflectors-and-workqueues]], [[findings/stale-cache-and-double-action]], [[entities/controller-runtime]], [[concepts/operator-pattern]]

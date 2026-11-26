---
title: Skipping Done or Forget on the workqueue leaves items stuck or retrying
type: finding
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-informers-reflectors-and-workqueues
    hash: f9de5ca73ab6
    ingested: 2026-11-25
aliases: []
tags: [pitfall, workqueue, client-go, retry]
---

# Skipping Done or Forget on the workqueue leaves items stuck or retrying

## Observation

The workqueue package expects a worker to call `Done()` after it finishes an item and `Forget()` after it succeeds. The package documentation reminds authors that otherwise retry tracking persists. Because a queue never processes one item concurrently, an item that is never marked done cannot be handed to another worker, and an item that is never forgotten keeps its accumulated backoff, so a healthy object can be delayed as if it were still failing. [[sources/research-informers-reflectors-and-workqueues]]

## Interpretation

The queue's guarantees depend on the caller's bookkeeping. Frameworks such as controller-runtime perform the calls for authors, so the hazard mostly affects hand-written client-go loops. The dossier states the rule but gives no incident. See [[concepts/informers-reflectors-and-workqueues]] and [[findings/retry-storms-and-unbounded-retries]].

## Related

[[findings/blocking-on-errors-inside-the-sync-loop-stalls-every-other-object]]

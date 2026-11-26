---
title: A kro hard apply failure discarded watches and hot-looped while large collections re-listed against the apiserver
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-g1-named-adopters
    hash: 9f6a50098233
    ingested: 2026-11-26
aliases: [kro issue 1464]
tags: [kro, graph, hot-loop, watch, apiserver-memory, issue-report]
---

# A kro hard apply failure discarded watches and hot-looped while large collections re-listed against the apiserver

## Observation

kro issue 1464 (opened 2026-09-30, closed) reports that a hard apply failure on a Graph discarded the watches and then hot-looped without backoff. On a large collection, the reporter writes, "each rebuild re-issues a full WatchList, which drives apiserver memory up." The report was made on kro main and v0.10.0-rc0 against Kubernetes 1.35. [[sources/research-gap-g1-named-adopters]] URL: https://github.com/kubernetes-sigs/kro/issues/1464.

## Confidence

This is a reporter observation and not a measurement. The dossier did not read the fix, so the current behavior is not recorded here. The failure combines two scale hazards: an unbacked-off retry loop, and a re-list that costs the server more as the collection grows.

## Related

The tuning page says the initial list of a kind with tens of thousands of objects can exceed the 30 second `watchSyncTimeout`, see [[examples/kro-shared-queue-tunes-throughput]]. See also [[findings/kro-s-single-shared-queue-can-starve-resources-and-a-maintainer-proposed-weighted-queues]], [[findings/a-kro-foreach-collection-above-the-1000-item-default-limit-gets-stuck-during-deletion]], and [[findings/retry-storms-and-unbounded-retries]].

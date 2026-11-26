---
title: A retry loop with no backoff or target-health gate grows controller memory during a dependency outage
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-g1-operator-loop-failures
    hash: baca2cdf965d
    ingested: 2026-11-26
aliases: [Retry loop memory growth]
tags: [retries, backoff, oom, longhorn, operator-failure, dependency-outage]
---

# A retry loop with no backoff or target-health gate grows controller memory during a dependency outage

## Observation

Longhorn issue 14121 reports that during an S3 backup-target outage `longhorn-manager` memory grew about 25 times on every node, the process was OOM killed at about 5.5 GiB, and nodes flapped between Ready and not Ready. The reporter's diagnosis is that reconcile attempts against the backup target ran with "No exponential backoff or target-health gate". When the target recovered, two managers that were still alive fell back to about 240 MiB without a restart. All figures and the causal diagnosis come from the reporter, and the issue was still open. [[sources/research-gap-g1-operator-loop-failures]] See [[examples/longhorn-issue-14121-a-backup-target-outage-grew-longhorn-manager-memory-about-25-fold]].

## Interpretation

The finding adds a resource cost to the retry pitfalls the wiki already tracked. An unbounded retry against a dead dependency can harm the controller's own node and not only the dependency. A target-health gate, which stops attempts while the target is known to be down, is a separate control from backoff.

## Mitigations

Use exponential backoff, and consider a gate that pauses attempts against an unhealthy target. See [[findings/failure-retry-loops-and-backoff]] and [[findings/retry-storms-and-unbounded-retries]].

## Related

[[concepts/reconciliation-loop]], [[findings/cost-of-constant-reconciliation]], [[findings/remediation-can-amplify-an-outage]]

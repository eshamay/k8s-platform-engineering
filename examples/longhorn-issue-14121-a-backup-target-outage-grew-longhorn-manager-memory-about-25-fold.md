---
title: Longhorn issue 14121 a backup target outage grew longhorn-manager memory about 25-fold
type: example
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-g1-operator-loop-failures
    hash: baca2cdf965d
    ingested: 2026-11-26
aliases: [Longhorn issue 14121]
tags: [longhorn, reconcile-loop, backoff, oom, operator-failure]
---

# Longhorn issue 14121 a backup target outage grew longhorn-manager memory about 25-fold

## Scenario

On 2026-09-28 a user, brianramseyau, reported that an S3 backup-target outage took down Longhorn nodes. The report is a user bug report with a measured timeline and not a vendor postmortem, and it was still open when the dossier read it. [[sources/research-gap-g1-operator-loop-failures]] URL: https://github.com/longhorn/longhorn/issues/14121

## What happened

While the backup target was down, `longhorn-manager` memory grew about 25 times on every node. `longhorn-manager` was then OOM killed at about 5.5 GiB and nodes flapped between Ready and not Ready. The reporter's diagnosis is that reconcile retries against the backup target had no suppression, in the words "No exponential backoff or target-health gate appears to suppress these reconcile attempts while the target is down". When the target recovered, two managers that had not been killed returned to about 240 MiB without a restart. All figures are self-reported, and the causal diagnosis is the reporter's.

## Why it belongs here

It is the closest the dossier came to an operator's own retry behavior taking nodes down, which makes it the leading example for the finding [[findings/a-retry-loop-with-no-backoff-or-target-health-gate-grows-controller-memory-during-a-dependency-outage]]. The same project appears in [[examples/longhorn-issue-13831-volatile-text-in-a-condition-message-drove-about-six-reconciles-per-second]] with a different loop mechanism.

## Related

[[findings/failure-retry-loops-and-backoff]], [[findings/retry-storms-and-unbounded-retries]], [[concepts/reconciliation-loop]]

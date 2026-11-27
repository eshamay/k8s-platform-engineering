---
title: Volatile text in a condition message defeats the equality check and causes a reconcile storm
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-g1-operator-loop-failures
    hash: baca2cdf965d
    ingested: 2026-11-26
aliases: [Condition message storm]
tags: [reconcile-loop, conditions, status-writes, longhorn, equality-check]
---

# Volatile text in a condition message defeats the equality check and causes a reconcile storm

## Observation

A controller can have an equality check that is meant to avoid needless status writes and still write on every pass, because the compared value contains text that changes each time. In Longhorn v1.10.1 the BackupTargetController copied the raw backup-store error into a condition message. That error held S3 request IDs and RFC3339 timestamps, so `reflect.DeepEqual` never matched. Each failure triggered a status update, and the informer re-enqueued the object, bypassing the controller's `PollInterval`. The reporter measured about 6 reconciles per second with invalid B2 credentials and proposed sanitizing the volatile parts. [sources/research-gap-g1-operator-loop-failures](../sources/research-gap-g1-operator-loop-failures.md) See [examples/longhorn-issue-13831-volatile-text-in-a-condition-message-drove-about-six-reconciles-per-second](../examples/longhorn-issue-13831-volatile-text-in-a-condition-message-drove-about-six-reconciles-per-second.md).

## Interpretation

A message field is part of the status that gets compared, so any error text that embeds a request ID, a timestamp, or a retry counter makes the write non-idempotent in bytes while it stays idempotent in meaning. This is the same effect as [findings/updating-lasttransitiontime-on-every-reconcile-turns-a-condition-into-a-heartbeat](updating-lasttransitiontime-on-every-reconcile-turns-a-condition-into-a-heartbeat.md), reached through a message instead of a timestamp.

## Mitigations

Store a stable reason and a sanitized message, and keep the raw error in logs. The issue was open when read, so the shipped fix is unknown.

## Related

[concepts/conditions](../concepts/conditions.md), [findings/a-status-patch-or-update-on-every-pass-keeps-a-controller-in-a-self-sustaining-reconcile-loop](a-status-patch-or-update-on-every-pass-keeps-a-controller-in-a-self-sustaining-reconcile-loop.md), [findings/free-text-in-a-condition-reason-breaks-consumers](free-text-in-a-condition-reason-breaks-consumers.md)

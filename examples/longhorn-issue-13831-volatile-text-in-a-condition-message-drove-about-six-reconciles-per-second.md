---
title: Longhorn issue 13831 volatile text in a condition message drove about six reconciles per second
type: example
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-g1-operator-loop-failures
    hash: baca2cdf965d
    ingested: 2026-11-26
aliases: [Longhorn issue 13831]
tags: [longhorn, reconcile-loop, conditions, status-writes, operator-failure]
---

# Longhorn issue 13831 volatile text in a condition message drove about six reconciles per second

## Scenario

On 2026-08-24 a user, 0byte-coding, reported a reconcile storm in Longhorn v1.10.1 on a k3s cluster with invalid B2 credentials. The issue was open when the dossier read it. [[sources/research-gap-g1-operator-loop-failures]] URL: https://github.com/longhorn/longhorn/issues/13831

## What happened

The BackupTargetController stored the raw backup-store error in a status condition message. That error contained S3 request IDs and RFC3339 timestamps, so it differed on every attempt and `reflect.DeepEqual` never matched. Each failure therefore caused a status update, the informer re-enqueued the object, and the re-enqueue bypassed the controller's `PollInterval`. The reporter measured about 6 reconciles per second and proposed sanitizing the volatile parts of the message. The report calls it a "self-sustaining reconcile storm". The rate is self-reported.

## Why it belongs here

It is the named case for [[findings/volatile-text-in-a-condition-message-defeats-the-equality-check-and-causes-a-reconcile-storm]], and it shows that a message field is part of the equality check a controller relies on to avoid writes.

## Related

[[findings/updating-lasttransitiontime-on-every-reconcile-turns-a-condition-into-a-heartbeat]], [[concepts/conditions]], [[examples/longhorn-issue-14121-a-backup-target-outage-grew-longhorn-manager-memory-about-25-fold]]

---
title: The Requeue true result is deprecated and described inconsistently
type: finding
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-reconciliation-loop
    hash: df7d66206baf
    ingested: 2026-11-25
aliases: [Requeue true ambiguity]
tags: [controller-runtime, requeue, backoff, documentation]
---

# The Requeue true result is deprecated and described inconsistently

## Observation

Two sources in the dossier disagree about what `Result{Requeue: true}` does. The controller-runtime package reference says it produces a rate-limited requeue, which implies backoff. A summary of controller-runtime issue 808 reads the same return value as an immediate requeue without backoff, and says that returning an error is the way to enter the exponential backoff loop. The package reference also marks `Requeue` as deprecated. [[sources/research-reconciliation-loop]]

## Why it is a pitfall

Authors who guess wrong build either a hot loop, if they expect backoff that does not happen, or a slow retry, if they expect immediacy. The Ahmet Alp Balkan guide lists unclear use of error versus `Requeue` versus `RequeueAfter` among common mistakes, and the issue itself exists because the semantics were historically under-documented. [[sources/research-reconciliation-loop]]

## What to do

The dossier recommends verifying against the current controller-runtime source in `reconcile.go` before writing tutorial text, and avoiding the deprecated field in new code. Use an error for failures, `RequeueAfter` for planned polling, and `TerminalError` for failures that retry cannot fix. See [[decisions/choose-error-requeueafter-or-terminalerror-in-a-reconciler]]. The conflict is logged as an open question in [[open-knowledge-gaps]].

## Related

[[entities/controller-runtime]], [[findings/errors-used-as-timers-in-reconcilers]], [[findings/failure-retry-loops-and-backoff]], [[concepts/reconciliation-loop]]

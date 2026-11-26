---
title: Errors used as timers in reconcilers
type: finding
status: draft
created: 2026-11-25
updated: 2026-11-26
sources:
  - id: research-gap-g3-k8s-and-controller-runtime
    hash: 2b4e3378c119
    ingested: 2026-11-26
  - id: research-eventual-consistency-and-convergence
    hash: bb35eafbd239
    ingested: 2026-11-25
  - id: research-reconciliation-loop
    hash: df7d66206baf
    ingested: 2026-11-25
aliases: []
tags: [pitfall, requeue, backoff, controller-runtime]
---

# Errors used as timers in reconcilers

## Observation

A controller often finds that everything is healthy but a dependency is not ready yet. Returning an error for that case triggers workqueue exponential backoff and produces noisy failure signals, even though nothing failed. A third-party controller-runtime guide maps the return values this way: an empty result with a nil error means converged, `RequeueAfter` means healthy but waiting, and an error means the attempt failed. Its summary rule is "Errors should mean 'this reconcile attempt failed,' not 'come back in thirty seconds.'" URL: https://www.golinuxcloud.com/requeue-requeueafter-error-handling-controller-runtime/. [[sources/research-eventual-consistency-and-convergence]]

## Related mistakes

The same guide warns against tight `RequeueAfter` loops, against ignoring NotFound and Conflict errors, and against over-requeueing when the controller should instead watch its child objects. The dossier flags the guide as third-party and says to confirm it against controller-runtime source.

## Mitigations

Use `RequeueAfter` for waiting states, record terminal errors in status so retries stop, and watch owned children so events wake the controller instead of a timer. See [[findings/failure-retry-loops-and-backoff]], [[entities/controller-runtime]], and [[concepts/conditions]].

## Related

[[concepts/eventual-consistency-and-convergence]], [[concepts/reconciliation-loop]]

## Corroboration from the reconciliation-loop dossier

The reconciliation-loop dossier repeats the guidance: errors for failures, `RequeueAfter` for planned polling, and `TerminalError` for failures retry cannot fix, and it notes that the semantics of `Requeue: true` are described inconsistently. [[sources/research-reconciliation-loop]] See [[decisions/choose-error-requeueafter-or-terminalerror-in-a-reconciler]].

## Source-level backoff behavior at controller-runtime v0.25.3

Reading the source settles the `Requeue: true` question the sections above leave open. A nil error with `Requeue: true` is a rate-limited requeue that keeps the per-item failure history, so it backs off exponentially, while `RequeueAfter > 0` calls `Queue.Forget(req)` first and waits exactly the given duration. An error also backs off, and an error ignores both `Result` fields. A reconciler that wants a fixed cadence should return `RequeueAfter`. [[sources/research-gap-g3-k8s-and-controller-runtime]] See [[findings/a-requeue-true-result-backs-off-exponentially-because-only-requeueafter-forgets-the-failure-history]].

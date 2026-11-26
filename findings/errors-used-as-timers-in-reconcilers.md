---
title: Errors used as timers in reconcilers
type: finding
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-eventual-consistency-and-convergence
    hash: bb35eafbd239
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

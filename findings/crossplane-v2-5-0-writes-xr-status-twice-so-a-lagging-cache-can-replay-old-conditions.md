---
title: Crossplane v2.5.0 writes XR status twice so a lagging cache can replay old conditions
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-b1-recheck-kro-crossplane
    hash: ccee0efa5bdd
    ingested: 2026-11-26
aliases: []
tags: [crossplane, conditions, cache, status, reconcile-loop]
---

# Crossplane v2.5.0 writes XR status twice so a lagging cache can replay old conditions

## Observation

When a composite resource uses function composition, the v2.5.0 source writes its status twice in one pass. A `Status().Patch` with `client.Apply` and `client.ForceOwnership` sits in `composition_functions.go`, and a `Status().Update` sits in `reconciler.go`. The open issues describe the result. The first write is built from conditions in a cached copy of the XR, so a cache that lags behind the API server publishes old conditions, and the second write then corrects them. The extra writes produce extra watch events and repeated reconciliation. Issue 7062 ("Reconciliation loop caused by cached XR status conditions") is open with the label `bug`, and issue 8033 ("XR conditions flap: the composer's status apply re-applies conditions from a stale cached read") is open. [[sources/research-gap-b1-recheck-kro-crossplane]] URL: https://github.com/crossplane/crossplane/issues/8033

The pull request author reports reproductions on 2.4.2, 2.4.3, and 2.5.0-rc.1 and says the issue exists back to 2.1.x. The fix proposal is pull request 8080, see [[examples/crossplane-pull-request-8080-guards-the-xr-status-write-with-a-resource-version-to-stop-stale-condition-replay]]. It is not merged, and v2.5.0 (released 2026-11-24) does not contain it.

## Why it matters

A condition that flaps between old and new values breaks anything that alerts on `Ready` or `Synced`, and the self-triggered watch events can sustain a reconcile loop, see [[findings/a-status-patch-or-update-on-every-pass-keeps-a-controller-in-a-self-sustaining-reconcile-loop]]. This is a different problem from the asynchronous managed-resource case in [[findings/upjet-and-crossplane-runtime-source-still-reports-reconcilesuccess-while-an-async-operation-runs]], where the managed resource reports `ReconcileSuccess` while a long operation runs. Neither fix addresses the other.

## Mitigations

Treat a single brief `Ready` or `Synced` flip on an XR as possible noise and alert on a condition that persists. The dossier did not test mitigations, and no released fix exists. See [[concepts/conditions]] and [[entities/crossplane]].

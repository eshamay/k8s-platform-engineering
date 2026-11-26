---
title: Argo CD does not retry a failed sync of the same commit unless retry is configured
type: example
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-reconciliation-loop
    hash: df7d66206baf
    ingested: 2026-11-25
aliases: []
tags: [argo-cd, retries, gitops, reconciliation]
---

# Argo CD does not retry a failed sync of the same commit unless retry is configured

## Scenario

An Argo CD application has automated sync turned on and a sync fails. The automated sync documentation describes what happens next, and it differs from the default of a controller-runtime controller. [[sources/research-reconciliation-loop]]

## What happens

The documentation says "Automatic sync will not reattempt a sync if the previous sync attempt against the same commit-SHA and parameters had failed." The application stays failed until a new commit or changed parameters arrive, or until retry is configured. Retry supports an attempt limit, a base duration, a backoff factor, and a maximum wait. Self-heal is separate: it re-syncs when live state diverges from Git, with a default 5 second delay. Git polling runs on `timeout.reconciliation`, default 120 seconds plus 60 seconds of jitter, and prune is off by default. [[sources/research-reconciliation-loop]]

The controller-runtime default is the opposite: a failing reconcile is retried forever with exponential backoff unless the error is terminal.

## Why it matters

The two defaults make different bets. Retrying forever risks retry amplification, and refusing to retry risks silent non-convergence while the cause may already be fixed. See [[findings/retry-storms-and-unbounded-retries]] and [[comparisons/retry-and-backoff-controls-across-tools]]. Older material often says the polling interval is 3 minutes, so check the version. [[sources/research-reconciliation-loop]]

## Related

[[entities/argo-cd]], [[examples/argo-cd-sync-waves-order-crds-operators-and-workloads]], [[concepts/reconciliation-loop]]

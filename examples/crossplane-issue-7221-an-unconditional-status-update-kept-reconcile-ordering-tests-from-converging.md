---
title: Crossplane issue 7221 an unconditional status update kept reconcile-ordering tests from converging
type: example
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-g1-operator-loop-failures
    hash: baca2cdf965d
    ingested: 2026-11-26
aliases: [Crossplane issue 7221]
tags: [crossplane, reconcile-loop, status-writes, compositionrevision, kamera]
---

# Crossplane issue 7221 an unconditional status update kept reconcile-ordering tests from converging

## Scenario

On 2026-03-19 tgoodwin filed Crossplane issue 7221 after running the kamera reconcile-ordering test tool against Crossplane. Maintainer jbw976 acknowledged it, and it was closed on 2026-05-13. The fix pull request was not read. [[sources/research-gap-g1-operator-loop-failures]] URL: https://github.com/crossplane/crossplane/issues/7221

## What happened

The CompositionRevision and composite reconcilers call `Status().Update()` on every pass regardless of whether anything changed. The issue says "the unconditional `Status().Update()` still produces an API write → watch event → re-enqueue", so the test scenarios never converge. In production the rate limiter dampens the effect into slow churn and not a tight loop. The cause is the reporter's analysis, acknowledged by a maintainer, and the fix content is UNVERIFIED.

## Why it belongs here

It is the named Crossplane case for [[findings/a-status-patch-or-update-on-every-pass-keeps-a-controller-in-a-self-sustaining-reconcile-loop]], and it shows that the rate limiter hides a loop in production while a convergence test exposes it.

## Related

[[entities/crossplane]], [[concepts/composition]], [[examples/cluster-api-provider-rke2-issue-905-an-unconditional-status-patch-held-the-controller-at-about-ten-reconciles-per-second]]

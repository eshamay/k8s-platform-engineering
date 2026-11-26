---
title: Argo Rollouts issue 4140 workqueue add rates stayed high after promotions with a 60-second resync
type: example
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-g1-operator-loop-failures
    hash: baca2cdf965d
    ingested: 2026-11-26
aliases: [Argo Rollouts issue 4140]
tags: [argo-rollouts, workqueue, resync, reconcile-loop, unexplained-cause]
---

# Argo Rollouts issue 4140 workqueue add rates stayed high after promotions with a 60-second resync

## Scenario

On 2025-02-19 a user reported on Argo Rollouts v1.7.2, run with `--rollout-resync=60`, that workqueue add rates for DestinationRules, Services, and Rollouts stayed constantly high after promotions. The setup was about 800 Rollouts across 4 clusters, and the issue was open when read. [[sources/research-gap-g1-operator-loop-failures]] URL: https://github.com/argoproj/argo-rollouts/issues/4140

## What happened

The reporter described the result as unexpected 2 to 4 times the events per object, in the words "The system shouldn't observe 2-4x events per Rollout, DR, VS". No root cause is stated, so the wiki records the symptom only. The thread also contains a user's statement, SECONDARY-ONLY, that operators run the resync flag "to prevent rollouts from getting stuck due to missed events". The flag documentation was not read.

## Why it belongs here

It pairs a high event rate with a deliberate periodic resync, and it is one of two places where the dossier finds a project's users relying on resync as a guard. See [[findings/projects-add-periodic-resync-as-a-safety-net-against-missed-events-and-bugs]].

## Related

[[concepts/informers-reflectors-and-workqueues]], [[decisions/keep-informer-resync-disabled-or-set-a-periodic-resync]], [[findings/cost-of-constant-reconciliation]]

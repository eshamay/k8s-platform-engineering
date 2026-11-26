---
title: ACK resync period tuning for stateful resources
type: example
status: draft
created: 2026-11-25
updated: 2026-11-26
sources:
  - id: research-self-healing-and-drift-detection
    hash: 98edc2019c6b
    ingested: 2026-11-25
  - id: research-gap-g3-reconcile-defaults
    hash: b7be72012393
    ingested: 2026-11-26
aliases: []
tags: [ack, aws, drift, resync, api-cost]
---

# ACK resync period tuning for stateful resources

## Scenario

An AWS shop runs [[entities/ack]] and needs to decide how quickly drift in AWS resources is noticed. The ACK drift-recovery page (https://aws-controllers-k8s.github.io/community/docs/user-docs/drift-recovery/) says controllers detect drift "by continuing to reconcile resources after they have reached their desired state, but with much longer delays." [[sources/research-self-healing-and-drift-detection]]

## The knobs

After a resource reaches `ResourceSynced = true`, the controller reconciles it again about every 10 hours by default, to limit AWS API cost and throttling. Two Helm values change this: `reconcile.defaultResyncPeriod` for all kinds, and `reconcile.resourceResyncPeriods` for specific kinds. The page gives stateful jobs as an example of a kind where a shorter period is worth the extra calls.

## Lesson

This is the clearest statement in the sources of the freshness-versus-API-cost trade-off, because each observation is a call to a rate-limited cloud API. See [[decisions/choosing-a-drift-check-interval-for-external-resources]], [[findings/cost-of-constant-reconciliation]], and [[findings/drift-detection-latency-is-the-interval]].

## Confirmation of the default

The 2026-11-26 dossier confirms the 10 hour default against the runtime constant `defaultResyncPeriod = 10 * time.Hour` as well as the drift-recovery page. [[sources/research-gap-g3-reconcile-defaults]]

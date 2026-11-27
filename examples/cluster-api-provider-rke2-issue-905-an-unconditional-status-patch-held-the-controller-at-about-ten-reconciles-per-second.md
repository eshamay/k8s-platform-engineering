---
title: Cluster API provider RKE2 issue 905 an unconditional status patch held the controller at about ten reconciles per second
type: example
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-g1-operator-loop-failures
    hash: baca2cdf965d
    ingested: 2026-11-26
aliases: [CABPR issue 905]
tags: [cluster-api, rke2, reconcile-loop, status-writes, operator-failure]
---

# Cluster API provider RKE2 issue 905 an unconditional status patch held the controller at about ten reconciles per second

## Scenario

On 2026-05-18 a reporter, pydeepzp, described a regression in Rancher's cluster-api-provider-rke2 (CABPR) from v0.22.0 onward. The issue was open when the dossier read it. [sources/research-gap-g1-operator-loop-failures](../sources/research-gap-g1-operator-loop-failures.md) URL: https://github.com/rancher/cluster-api-provider-rke2/issues/905

## What happened

The RKE2ControlPlane controller deferred a status patch with no equality check. The reporter says it "enters a self-sustaining reconcile loop at approximately **10 reconciles per second**", and the loop continued even after the external trigger was removed. Neighbouring controllers were affected as well: RKE2Config reconciled at about 10 per second, VSphereMachine and VSphereCluster reconciled repeatedly, and CAAPF saw frequent 409 conflicts. The dossier's verification corrected an earlier draft that had attributed the 409 conflicts to all three, since the issue attributes them only to CAAPF. The reporter ties the regression to a commit that added the v1beta2 status path, and v0.21.0 was quiet. The figures are self-reported.

## Why it belongs here

It is a Cluster API provider and so the wiki's first provider-level hot loop, and it is the named case for [findings/a-status-patch-or-update-on-every-pass-keeps-a-controller-in-a-self-sustaining-reconcile-loop](../findings/a-status-patch-or-update-on-every-pass-keeps-a-controller-in-a-self-sustaining-reconcile-loop.md). It also shows a loop spreading to other controllers that watch the same objects.

## Related

[entities/cluster-api](../entities/cluster-api.md), [examples/crossplane-issue-7221-an-unconditional-status-update-kept-reconcile-ordering-tests-from-converging](crossplane-issue-7221-an-unconditional-status-update-kept-reconcile-ordering-tests-from-converging.md), [findings/self-triggered-reconcile-loops-generate-their-own-events](../findings/self-triggered-reconcile-loops-generate-their-own-events.md)

---
title: Crossplane Synced stays True through a sixty-minute async MSK update
type: example
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-conditions
    hash: 97b224c63502
    ingested: 2026-11-25
aliases: []
tags: [crossplane, conditions, upjet, async, provider-aws]
---

# Crossplane Synced stays True through a sixty-minute async MSK update

## Scenario

A team manages an AWS MSK (Kafka) cluster through a Crossplane provider built on Upjet. They change the cluster configuration, and AWS takes more than an hour to apply the update. The team alerts on `Synced=False` and also has automation that polls `Synced` to decide when a change has finished. [[sources/research-conditions]]

## How it works

provider-aws issue 2287 reports that during the long update the controller says the resource is "up to date". Crossplane-runtime then overwrites the pending state with `ReconcileSuccess`, so `Synced` stays `True` for the whole hour. An `AsyncOperation` condition does exist, and it reads `False` with reason `Ongoing` while the work runs, but it sits outside the conventional alert surface. The reporter concluded that a fix needs changes in both upjet and crossplane-runtime. URL: https://github.com/crossplane-contrib/provider-aws/issues/2287.

## Lesson

The `Synced` condition answers whether the provider could reconcile, not whether the external change has finished, so an alert on `Synced=False` stays silent while a slow operation runs and polling automation sees convergence that has not happened. Operators of Upjet-based providers need to read `AsyncOperation` as well, and the dossier did not confirm whether Crossplane v2 or later upjet releases fixed this. See [[findings/a-summary-condition-can-stay-true-while-a-long-async-operation-is-running]], [[examples/crossplane-database-claim-reports-synced-and-ready]], [[entities/crossplane]], and [[concepts/managed-resource]].

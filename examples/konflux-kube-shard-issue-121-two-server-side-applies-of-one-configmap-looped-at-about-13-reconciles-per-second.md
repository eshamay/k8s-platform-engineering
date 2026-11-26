---
title: Konflux kube-shard issue 121 two server-side applies of one ConfigMap looped at about 13 reconciles per second
type: example
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-g1-operator-loop-failures
    hash: baca2cdf965d
    ingested: 2026-11-26
aliases: [kube-shard issue 121]
tags: [konflux, kube-shard, server-side-apply, reconcile-loop, owns, operator-failure]
---

# Konflux kube-shard issue 121 two server-side applies of one ConfigMap looped at about 13 reconciles per second

## Scenario

On 2026-09-07 gbenhaim filed an issue against the Konflux kube-shard operator and it was closed the same day, about 5 hours later. [[sources/research-gap-g1-operator-loop-failures]] URL: https://github.com/konflux-ci/kube-shard/issues/121

## What happened

A Ready APIShard sat in a tight reconcile loop. The function `applyOTelCollector` server-side-applied one hashed ConfigMap twice with the same field manager but different label sets. Each apply bumped the resource version, and the controller owned ConfigMaps with no predicate, so about 13 APIShard reconciles per second occurred while the shard was Ready. The issue puts it as "Every RV bump requeues the `APIShard`. Reconcile applies the ConfigMap again → infinite loop." Its summary line is "Operator burns CPU and API-server QPS for as long as a monitored in-cluster PostgreSQL shard exists". The fix is proposed in the issue, and details beyond the first 2,000 characters were not read. The rate is self-reported.

## Why it belongs here

It is the named case for [[findings/applying-one-object-twice-in-a-reconcile-with-owns-and-no-predicate-loops-on-its-own-resource-version]], where the write is idempotent in meaning but not in bytes.

## Related

[[concepts/server-side-apply-and-field-ownership]], [[findings/self-triggered-reconcile-loops-generate-their-own-events]], [[entities/kubebuilder]]

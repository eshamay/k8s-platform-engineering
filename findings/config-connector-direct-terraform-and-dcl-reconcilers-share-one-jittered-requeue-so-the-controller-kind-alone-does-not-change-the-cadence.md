---
title: "Config Connector's direct, Terraform and DCL reconcilers share one jittered requeue, so the controller kind alone does not change the cadence"
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-o9-cadence-and-staleness
    hash: eb353fed45cd
    ingested: 2026-11-26
aliases: [Config Connector cadence by controller kind, JitteredReenqueue]
tags: [config-connector, reconcile-interval, jitter, controllers, drift, cadence]
---

# Config Connector's direct, Terraform and DCL reconcilers share one jittered requeue, so the controller kind alone does not change the cadence

## Observation

All three reconcilers end a successful reconcile with `return reconcile.Result{RequeueAfter: jitteredPeriod}, nil`, and each obtains `jitteredPeriod` from the same `JitteredReenqueue` function. The code was read in `tf/controller.go`, `dcl/controller.go` (lines 270 to 275) and `directbase_controller.go` (lines 330 to 336) at master. [[sources/research-gap-o9-cadence-and-staleness]] https://github.com/GoogleCloudPlatform/k8s-config-connector/blob/master/pkg/controller/dcl/controller.go

## How the delay is built

`JitteredReenqueue` applies the annotation `cnrm.cloud.google.com/reconcile-interval-in-seconds` first. Without it, `MeanReconcileReenqueuePeriod` resolves in this order: the Terraform service-mapping value, the DCL metadata value, the IAM kind constants, and then the global default of 10 minutes. The result goes through `wait.Jitter(reconcileInterval/2, k8s.JitterFactor)` with `JitterFactor = 2.0`, which gives a delay between half and one and a half times the mean, so 5 to 15 minutes by default. https://github.com/GoogleCloudPlatform/k8s-config-connector/blob/master/pkg/controller/jitter/jitter.go and https://github.com/GoogleCloudPlatform/k8s-config-connector/blob/master/pkg/controller/reconciliationinterval/reconciliationinterval.go

## What follows

A direct-controller kind has no service-mapping or metadata entry of its own, so it gets 10 minutes unless annotated. The controller kind therefore does not itself set a different default cadence, and the only per-kind differences are the service-mapping overrides in [[findings/config-connector-per-kind-reconcile-intervals-exist-only-as-five-terraform-service-mapping-overrides-and-262-of-267-reference-pages-show-600-seconds]].

## Limits

The lookup is by group, version and kind. A kind that has a Terraform mapping and also runs its direct controller would, on that reading, take the Terraform mapping value, but the dossier did not test this overlap and marks it UNVERIFIED. No cadence was measured on a live cluster.

## Related

[[findings/setting-a-config-connector-reconcile-interval-to-zero-switches-off-drift-correction-and-the-docs-call-it-irreversible]], [[findings/config-connector-s-static-config-table-lists-814-kinds-and-sets-direct-as-the-default-for-539-of-them]], [[comparisons/reconcile-cadence-and-off-switches-across-tools]], [[entities/config-connector]]

---
title: "Setting a Config Connector reconcile interval to zero switches off drift correction and the docs call it irreversible"
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-g3-reconcile-defaults
    hash: b7be72012393
    ingested: 2026-11-26
aliases: []
tags: [pitfall, config-connector, reconcile-interval, drift, jitter, defaults]
---

# Setting a Config Connector reconcile interval to zero switches off drift correction and the docs call it irreversible

## Observation

Config Connector lets a resource set its own average reconcile interval through the annotation `cnrm.cloud.google.com/reconcile-interval-in-seconds`. Setting it to 0 turns off periodic drift correction for that resource, and the reconciliation page states: "Setting the reconciliation interval to 0 is irreversible." The dossier's reading is that recovery needs a spec edit or an abandon-and-recreate, but the page quote is the verified part. [[sources/research-gap-g3-reconcile-defaults]] https://cloud.google.com/config-connector/docs/concepts/reconciliation

## The default and the jitter

The docs page does not state a number. It says each resource reconciles on every update and "after a jitter period with an average based on the preconfigured default interval". In source the global fallback is `MeanReconcileReenqueuePeriod = 10 * time.Minute`. The interval is resolved in order from the Terraform service mapping, DCL metadata, IAM kind constants (`IAMPolicyReconcileInterval` is 10 minutes), and finally the 10-minute default. The jitter code spreads requeues "between 1/2 * MeanReconcileReenqueuePeriod and 3/2 * MeanReconcileReenqueuePeriod", so the default mean means 5 to 15 minutes in practice. https://github.com/GoogleCloudPlatform/k8s-config-connector/blob/master/pkg/k8s/constants.go and https://github.com/GoogleCloudPlatform/k8s-config-connector/blob/master/pkg/controller/jitter/jitter.go

## Failure retries

On errors the retry uses exponential backoff up to a default ceiling of 120 seconds, and the ceiling is configurable only on direct-controller resources. https://github.com/GoogleCloudPlatform/k8s-config-connector/blob/master/docs/features/exponential-backoff-configuration.md

## What stays open

The per-kind interval values from the Terraform service mapping and DCL metadata were not read, so it is UNVERIFIED whether the direct, Terraform-based, and DCL-based controllers differ by default.

## Consequences

An operator who sets the interval to 0 to quiet API quota or a revert loop loses drift correction for good on that object, which turns a reversible tuning choice into a one-way one. Lengthen the interval instead, and weigh it against freshness as in [[decisions/choosing-a-drift-check-interval-for-external-resources]]. See [[entities/config-connector]], [[findings/cost-of-constant-reconciliation]], and [[comparisons/drift-detection-mechanisms-across-tools]].

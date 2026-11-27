---
title: "Config Connector has no separate drift poll, and the failure backoff annotation works only for direct controllers from 1.160.0"
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-o9-cadence-and-staleness
    hash: eb353fed45cd
    ingested: 2026-11-26
aliases: [Config Connector drift check is the reconcile, backoff-max-delay-in-seconds]
tags: [config-connector, drift, backoff, annotations, direct-controller, cadence]
---

# Config Connector has no separate drift poll, and the failure backoff annotation works only for direct controllers from 1.160.0

## Observation

The dossier found no separate drift poll in Config Connector. Each reconcile reads the live state and compares it with the spec, so drift detection runs at the reconcile requeue cadence of [findings/config-connector-direct-terraform-and-dcl-reconcilers-share-one-jittered-requeue-so-the-controller-kind-alone-does-not-change-the-cadence](config-connector-direct-terraform-and-dcl-reconcilers-share-one-jittered-requeue-so-the-controller-kind-alone-does-not-change-the-cadence.md). The docs frame the interval as drift correction: setting it to 0 "disable[s] drift correction for a resource, but it does not disable resource actuation", and "Setting the reconciliation interval to 0 is irreversible." The annotation has been available since Config Connector 1.102. [sources/research-gap-o9-cadence-and-staleness](../sources/research-gap-o9-cadence-and-staleness.md) https://docs.cloud.google.com/config-connector/docs/concepts/reconciliation

## Failure retries are separate

Failed reconciles retry with exponential backoff that starts at 250 ms, doubles, and has a 120-second default ceiling. The reconciliation page says the interval annotation "does not affect retry intervals when reconciliation fails". The ceiling can be changed with the annotation `cnrm.cloud.google.com/backoff-max-delay-in-seconds`, and the annotations reference says "Requires Config Connector version 1.160.0 or later. Supported only for resources managed by direct controllers." https://docs.cloud.google.com/config-connector/docs/reference/annotations and https://github.com/GoogleCloudPlatform/k8s-config-connector/blob/master/docs/features/exponential-backoff-configuration.md

## Why it matters

A Terraform-based or DCL-based kind keeps the 120-second ceiling and cannot tune it, so the controller kind matters for failure behavior even though it does not change the success cadence. A team that wants a longer ceiling needs the kind to run on the direct controller, see [decisions/accept-the-build-time-controller-for-a-config-connector-kind-or-override-it-per-namespace-or-per-resource](../decisions/accept-the-build-time-controller-for-a-config-connector-kind-or-override-it-per-namespace-or-per-resource.md).

## Limits

The three Google Cloud pages exceeded the tool's inline size limit and were read through saved output with jq and ripgrep excerpts, so these claims rest on matched passages and not a full read of each page. No measured drift latency on a live cluster was found.

## Related

[findings/argo-cd-and-config-connector-document-bounded-exponential-backoff-and-status-based-health-for-failure-handling](argo-cd-and-config-connector-document-bounded-exponential-backoff-and-status-based-health-for-failure-handling.md), [findings/drift-detection-latency-is-the-interval](drift-detection-latency-is-the-interval.md), [entities/config-connector](../entities/config-connector.md)

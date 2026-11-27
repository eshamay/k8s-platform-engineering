---
title: Intermittent API server downtime can send node auto-repair into an endless recreate loop
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-g1-outage-postmortems
    hash: 0487bcf071d6
    ingested: 2026-11-26
  - id: research-gap-g1-named-incident-reports
    hash: 3c7df7bb12f1
    ingested: 2026-11-26
aliases: []
tags: [pitfall, node-auto-repair, gke, remediation, postmortem]
---

# Intermittent API server downtime can send node auto-repair into an endless recreate loop

## Observation

In Jetstack's 2019 outage, the failing master made the API intermittently unavailable, so kubelets could not report node health. GKE node auto-repair read the missing reports as unhealthy nodes, and "all the nodes started to be destroyed and recreated in an endless loop", which caused loss of service for all tenants of the shared dev cluster. Jetstack kept auto-repair enabled afterward and fixed the webhook instead. Self-reported on 2019-09-05. [sources/research-gap-g1-outage-postmortems](../sources/research-gap-g1-outage-postmortems.md)

## Why it matters

This is a second example, beside the Cluster API case in [findings/remediation-can-amplify-an-outage](remediation-can-amplify-an-outage.md), of automated remediation turning a control-plane fault into a data-plane outage. The remediation acts on node health that is reported through the same API that has failed. The wiki has no evidence on how GKE auto-repair bounds this today. See [examples/jetstack-s-2019-gke-master-upgrade-stalled-on-an-unresponsive-opa-validating-webhook](../examples/jetstack-s-2019-gke-master-upgrade-stalled-on-an-unresponsive-opa-validating-webhook.md) and [findings/an-unresponsive-validating-webhook-can-block-the-api-server-s-own-startup-write-and-crash-loop-a-master-upgrade](an-unresponsive-validating-webhook-can-block-the-api-server-s-own-startup-write-and-crash-loop-a-master-upgrade.md).

## Jetstack kept auto-repair on

A second read of the post confirms that Jetstack "considered but decided against disabling GKE node auto-repair". The mitigation it chose was to stop the webhook from breaking the master, not to remove the remediation loop. See [sources/research-gap-g1-named-incident-reports](../sources/research-gap-g1-named-incident-reports.md).

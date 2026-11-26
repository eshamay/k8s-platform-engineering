---
title: Cloud console changes reverted by provider controllers
type: example
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-level-triggered-vs-edge-triggered
    hash: 27a34aa0de59
    ingested: 2026-11-25
  - id: research-self-healing-and-drift-detection
    hash: 98edc2019c6b
    ingested: 2026-11-25
aliases: []
tags: [config-connector, crossplane, drift, cloud]
---

# Cloud console changes reverted by provider controllers

## Scenario

A database or bucket is managed through a Kubernetes object, and someone changes it in the cloud console. Config Connector and Crossplane providers reconcile external cloud objects on a schedule, so the console change is detected and reverted. [[sources/research-level-triggered-vs-edge-triggered]]

## Config Connector

Config Connector reconciles periodically to correct drift once a resource is UpToDate and retries failures with exponential backoff capped at two minutes. The annotation `cnrm.cloud.google.com/reconcile-interval-in-seconds` tunes the interval, and a value of "0" disables it. Fields that cannot be read back, such as passwords, are actuated only on a spec change, and immutable-field changes need recreation. See [[entities/config-connector]].

## Crossplane

A Crossplane provider re-reconciles each managed resource and compares `forProvider` to the external resource, acting according to `managementPolicies` such as Observe, Update, and LateInitialize. A poll interval and a pause annotation control cadence, but the default poll interval was not confirmed. See [[entities/crossplane]].

## Others

ACK and Cluster API follow the same shape according to the dossier, but their drift behavior could not be confirmed from the pages fetched. See [[entities/ack]], [[entities/cluster-api]], [[examples/cloud-services-as-kubernetes-objects]], and [[findings/continuous-loops-override-intentional-changes]].

## Further detail from the self-healing dossier

The Crossplane documentation says `forProvider` is the source of truth, and ACK documents that drift is found by continued reconciliation with a roughly 10-hour default, so a console change to an AWS resource may sit for hours. [[sources/research-self-healing-and-drift-detection]] See [[examples/crossplane-managed-resource-enforces-forprovider-and-observes-adopted-resources]] and [[examples/ack-resync-period-tuning-for-stateful-resources]].

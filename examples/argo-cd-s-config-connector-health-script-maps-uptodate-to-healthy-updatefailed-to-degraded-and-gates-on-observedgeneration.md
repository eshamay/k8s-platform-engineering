---
title: Argo CD's Config Connector health script maps UpToDate to Healthy, UpdateFailed to Degraded, and gates on observedGeneration
type: example
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-m3-status-conditions
    hash: 07099fedb0c8
    ingested: 2026-11-26
aliases: [Argo CD cnrm health check]
tags: [argo-cd, config-connector, health, conditions, observedgeneration]
---

# Argo CD's Config Connector health script maps UpToDate to Healthy, UpdateFailed to Degraded, and gates on observedGeneration

## Scenario

Argo CD cannot derive health from custom resource status without a script, and Config Connector publishes one `Ready` condition whose reason carries the phase. Argo CD therefore ships a Lua health check for the `cnrm.cloud.google.com` group, last changed 2026-10-30 and read near release v3.6.3. [[sources/research-gap-m3-status-conditions]] URL: https://github.com/argoproj/argo-cd/blob/master/resource_customizations/_.cnrm.cloud.google.com/_/health.lua

## How it works

The script handles three shapes. `ConfigConnector` and `ConfigConnectorContext` kinds use `status.healthy` and not conditions, gated on `observedGeneration`. Kinds in the `customize.core.cnrm.cloud.google.com` group treat an `observedGeneration` of 0 as unset. Ordinary resources are judged by the `Ready` condition: while the status is stale the script returns Progressing, and it skips the check if `observedGeneration` is not set.

The reason mapping is `UpToDate` with status True gives Healthy, `UpdateFailed` gives Degraded, `DependencyNotFound` gives Degraded, `DependencyNotReady` gives Suspended, and everything else, including `Updating`, falls through to Progressing with the message "Update in progress". Argo CD's own health documentation says app health is the worst of the children, so a Degraded child makes the application Degraded, and it asks authors of CRD checks to note kstatus usage in a comment.

## Lesson

The script matches the shipped reason `UpdateFailed`, which corroborates [[findings/config-connector-shipped-updatefailed-with-a-single-ready-condition-and-the-first-field-path-message-and-operation-id-reason-are-not-in-code]]. It also shows a consumer that reads only the top-level generation, as in [[findings/kstatus-reads-only-the-top-level-observedgeneration-because-its-condition-struct-has-no-per-condition-field]]. Argo CD's operation-state docs and controller aggregation code were not read. See [[entities/argo-cd]], [[entities/config-connector]], and [[examples/argo-cd-rolls-up-child-health-with-lua-checks]].

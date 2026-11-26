---
title: "Argo CD and Config Connector document bounded exponential backoff and status-based health for failure handling"
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-m7-operators-idempotency
    hash: 6c986668a6dc
    ingested: 2026-11-26
aliases: [Argo CD and Config Connector failure handling]
tags: [argo-cd, config-connector, retries, backoff, health, operators]
---

# Argo CD and Config Connector document bounded exponential backoff and status-based health for failure handling

## Argo CD

The architecture page describes the application controller as "a Kubernetes controller which continuously monitors running applications", next to a repository server that is "an internal service which maintains a local cache of the Git repository" and an API server. The ApplicationSet controller is a separate component. The automated sync page says "Argo CD can automatically retry a failed sync operation using exponential backoff", with `limit`, `duration`, `factor`, and `maxDuration` settings, and "Set to `-1` for unlimited retries." Self-heal re-attempts a sync "after self-heal timeout (5 seconds by default)". Health assessment marks a pod "Degraded" when a container is in an error state such as `CrashLoopBackOff` or `ImagePullBackOff`, and the rules can be customized. [[sources/research-gap-m7-operators-idempotency]]

## Config Connector

The reconciliation page says "you can create and update resources in any order, regardless of dependency relationships", so ordering errors converge by retry. It says "Config Connector retries with exponential backoff where maximum backoff is 2 minutes", configurable by annotation for direct controllers, and that the average reconcile interval is set per resource with the `cnrm.cloud.google.com/reconcile-interval-in-seconds` annotation. Status carries a Ready condition with a reason and message, and "Important status changes for Config Connector resources are visible as Kubernetes events." [[sources/research-gap-m7-operators-idempotency]]

## What is not settled

The part of the gap about one-controller-per-concern guidance is not answerable from these pages. They describe the Argo CD split into components and do not cite any such guidance, and the Config Connector controller-types page, which covers direct and Terraform-based controllers, was not read. [[sources/research-gap-m7-operators-idempotency]]

## Related

[[comparisons/reconcile-cadence-and-off-switches-across-tools]], [[comparisons/retry-and-backoff-controls-across-tools]], [[entities/argo-cd]], [[entities/config-connector]], [[concepts/operator-pattern]]

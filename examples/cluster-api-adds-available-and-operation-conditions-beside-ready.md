---
title: Cluster API adds Available and operation conditions beside Ready
type: example
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-conditions
    hash: 97b224c63502
    ingested: 2026-11-25
aliases: []
tags: [cluster-api, conditions, available, lifecycle]
---

# Cluster API adds Available and operation conditions beside Ready

## Scenario

An operator upgrades a Cluster API workload cluster. While machines roll, the cluster is still serving traffic, but under the older model one mandatory `Ready` condition summarized everything and went `False` during the upgrade. Users could not tell a broken cluster from a healthy cluster that was changing. [[sources/research-conditions]]

## How it works

The 2024 proposal "Improve status in CAPI resources" abandons Cluster API's custom condition model, which had a mandatory `Ready` that summarized everything, a custom `Severity` field, and a shape that diverged from the Kubernetes API conventions. The new model uses `metav1.Condition`, adds `Available` as a separate signal, and adds operation conditions such as `ScalingUp` and `Remediating` across Cluster, MachineDeployment, and Machine. The proposal's reasoning is that "higher level abstractions in Cluster API are designed to remain operational during lifecycle operations." URL: https://github.com/kubernetes-sigs/cluster-api/blob/main/docs/proposals/20240916-improve-status-in-CAPI-resources.md. The dossier read about 95 percent of the page.

## Lesson

The case shows an ecosystem converging on the shared convention, and it shows the cost for consumers. Flux's kstatus-based health checks relied on `Ready`, so Flux added CEL health checks for Cluster API resources. See [[findings/one-mandatory-ready-condition-that-summarizes-everything-is-too-rigid]], [[examples/cluster-api-readiness-gates-flux-dependents]], [[findings/premature-readiness-in-kstatus-based-tools]], and [[entities/cluster-api]].

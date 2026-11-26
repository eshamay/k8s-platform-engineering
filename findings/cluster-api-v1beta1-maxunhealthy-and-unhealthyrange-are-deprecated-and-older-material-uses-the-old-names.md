---
title: Cluster API v1beta1 maxUnhealthy and unhealthyRange are deprecated and older material uses the old names
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-g3-argocd-capi
    hash: c3d485fa58ae
    ingested: 2026-11-26
aliases: []
tags: [pitfall, cluster-api, machinehealthcheck, v1beta2, terminology-drift]
---

# Cluster API v1beta1 maxUnhealthy and unhealthyRange are deprecated and older material uses the old names

## Observation

In Cluster API v1beta1, the MachineHealthCheck short-circuit is set with `maxUnhealthy` and `unhealthyRange`. The v1beta1 Go type marks `maxUnhealthy` "Deprecated: This field is deprecated and is going to be removed in the next apiVersion." (issue 10722). The v1beta2 API, introduced in v1.11.0 on 2025-08-19, renames the fields: `remediation.triggerIf.unhealthyLessThanOrEqualTo` and `unhealthyInRange`. The checks moved under `spec.checks`, and the external remediation reference became `remediation.templateRef`. The v1.11.0 guide still used the v1beta1 names. The v1beta1 API is tentatively removed in April 2027. [[sources/research-gap-g3-argocd-capi]] URL: https://github.com/kubernetes-sigs/cluster-api/blob/v1.15.0-rc.0/api/core/v1beta1/machinehealthcheck_types.go.

## Why it matters

Most public material, including the v0.4 book this wiki first read, uses `maxUnhealthy`. A manifest copied from it still applies on v1beta1 but uses a deprecated field, and a reader searching current docs for `maxUnhealthy` finds nothing. The tutorials in `outputs/` use the old name.

## Mitigations

Use the v1beta2 names in new manifests and plan the migration before v1beta1 is removed. See [[examples/cluster-api-v1beta2-machine-health-check-short-circuits-remediation-and-hands-off-to-external-controllers]], [[findings/the-cluster-api-machine-health-check-short-circuit-is-off-by-default-so-remediation-is-unbounded-until-a-threshold-is-set]], [[findings/older-observeonly-and-deletionpolicy-advice-needs-translation-to-managementpolicies]] for a similar terminology drift in Crossplane, and [[entities/cluster-api]].

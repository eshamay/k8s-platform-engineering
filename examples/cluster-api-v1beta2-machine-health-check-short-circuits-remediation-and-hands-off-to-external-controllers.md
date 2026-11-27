---
title: Cluster API v1beta2 MachineHealthCheck short-circuits remediation and hands off to external controllers
type: example
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-g3-argocd-capi
    hash: c3d485fa58ae
    ingested: 2026-11-26
  - id: research-gap-b1-recheck-capi-argocd
    hash: 832b86e20750
    ingested: 2026-11-26
aliases: []
tags: [cluster-api, machinehealthcheck, remediation, v1beta2, self-healing]
---

# Cluster API v1beta2 MachineHealthCheck short-circuits remediation and hands off to external controllers

## Scenario

A platform team runs workload clusters through [entities/cluster-api](../entities/cluster-api.md) and wants unhealthy machines replaced automatically, without replacing a large share of a fleet during a wider problem. The current API for this is the v1beta2 MachineHealthCheck, which shipped in Cluster API v1.11.0 on 2025-08-19. The details below come from the user guide and Go types at tag v1.15.0-rc.0, so anything marked v1.15 is a pre-release claim. [sources/research-gap-g3-argocd-capi](../sources/research-gap-g3-argocd-capi.md)

## How it works

The checks live under `spec.checks`. The brake is `spec.remediation.triggerIf.unhealthyLessThanOrEqualTo`, which "prevents further remediation if the cluster is already partially unhealthy". If the number of unhealthy machines exceeds the limit, remediation is skipped. The limit can be an absolute number or a percentage, and percentages round down. A second field, `unhealthyInRange` with a value such as `[3-5]`, takes precedence when both are set. In v1.15 the checks can also include `unhealthyExpressions`, CEL expressions that are OR-combined (the machine is unhealthy if any evaluates to true), with a maximum of 10 entries.

For repair that Cluster API does not perform itself, `remediation.templateRef` names an object template (apiVersion, kind, name). The controller creates an object from the template and "hands off remediation of the machine to a controller that lives outside of Cluster API."

MachineHealthChecks cover only Machines owned by a MachineDeployment, a MachineSet, or a KubeadmControlPlane. A Machine with the `cluster.x-k8s.io/skip-remediation` annotation, or in a paused cluster, is skipped. With ClusterClass, the MachineHealthChecks come from the class and can be overridden or disabled under `spec.topology`, and direct edits to those objects are overridden by the topology controller.

## Lesson

The self-healing loop at the machine layer has a brake, an escape hatch to external repair, and an expression language for custom health rules. The brake is off by default, which makes configuring it the operator's job. See [findings/the-cluster-api-machine-health-check-short-circuit-is-off-by-default-so-remediation-is-unbounded-until-a-threshold-is-set](../findings/the-cluster-api-machine-health-check-short-circuit-is-off-by-default-so-remediation-is-unbounded-until-a-threshold-is-set.md), [findings/cluster-api-v1beta1-maxunhealthy-and-unhealthyrange-are-deprecated-and-older-material-uses-the-old-names](../findings/cluster-api-v1beta1-maxunhealthy-and-unhealthyrange-are-deprecated-and-older-material-uses-the-old-names.md), [examples/cluster-api-machine-health-check-replaces-failed-nodes](cluster-api-machine-health-check-replaces-failed-nodes.md), and [findings/remediation-can-amplify-an-outage](../findings/remediation-can-amplify-an-outage.md).

## Recheck on 2026-11-26

The field names `unhealthyExpressions` (at most 10 items), `remediation.templateRef`, and `remediation.triggerIf.unhealthyLessThanOrEqualTo`, and the precedence of `unhealthyInRange`, were re-read at v1.15.0-rc.0 and on `main` and are unchanged. `DefaultNodeStartupTimeoutSeconds = 600` was also seen. The 100 percent default, the rounding rule, and the KubeadmControlPlane retry fields were not re-read. v1.15.0 final is still unreleased, see [findings/cluster-api-v1-15-0-final-was-not-released-on-2026-11-26-so-every-v1-15-statement-is-a-release-candidate-claim](../findings/cluster-api-v1-15-0-final-was-not-released-on-2026-11-26-so-every-v1-15-statement-is-a-release-candidate-claim.md) and [sources/research-gap-b1-recheck-capi-argocd](../sources/research-gap-b1-recheck-capi-argocd.md).

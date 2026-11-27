---
title: Ready can be reported for a spec generation the controller has not yet observed
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-g1-operator-loop-failures
    hash: baca2cdf965d
    ingested: 2026-11-26
aliases: [Early Ready]
tags: [observedgeneration, readiness, status, cloudnativepg, restate, ack, argo-cd, flux]
---

# Ready can be reported for a spec generation the controller has not yet observed

## Observation

Three open 2026 issues show the same gap in three operators. CloudNativePG 1.30.0 returns a Ready condition produced before a `spec.instances` patch, and `Cluster.status` has no field that tells a consumer which generation it describes ([examples/cloudnativepg-issue-11390-kubectl-wait-for-ready-can-return-on-a-condition-produced-before-the-spec-change](../examples/cloudnativepg-issue-11390-kubectl-wait-for-ready-can-return-on-a-condition-produced-before-the-spec-change.md)). restate-operator 3.1.0 reported Ready before a StatefulSet rollout finished, and Flux with `wait: true` marked the release healthy about 37 seconds before the last pod was Ready ([examples/restate-operator-issue-216-ready-true-before-a-statefulset-rollout-finished-let-flux-mark-the-release-healthy](../examples/restate-operator-issue-216-ready-true-before-a-statefulset-rollout-finished-let-flux-mark-the-release-healthy.md)). Argo CD's built-in ACK health check reports Healthy about 2 seconds before the ACK controller re-stamps its conditions after a spec change ([examples/argo-cd-issue-30373-the-built-in-ack-health-check-reports-healthy-before-the-controller-observes-a-spec-change](../examples/argo-cd-issue-30373-the-built-in-ack-health-check-reports-healthy-before-the-controller-observes-a-spec-change.md)). All three were filed as bugs and were open when read, so no fix is recorded, and the timings are self-reported. [sources/research-gap-g1-operator-loop-failures](../sources/research-gap-g1-operator-loop-failures.md)

## Interpretation

Each issue names the missing `observedGeneration` as the cause. The consequence reaches scripts (`kubectl wait`), delivery tools (Flux `wait`), and health checks (Argo CD), which all gate on a condition that may be one generation old. The opposite failure, status written too often, is recorded in [findings/a-status-patch-or-update-on-every-pass-keeps-a-controller-in-a-self-sustaining-reconcile-loop](a-status-patch-or-update-on-every-pass-keeps-a-controller-in-a-self-sustaining-reconcile-loop.md).

## Mitigations

Set `observedGeneration` on the status and on each condition, and compare it with `metadata.generation` before trusting Ready. See [findings/missing-observedgeneration-hides-stale-status](missing-observedgeneration-hides-stale-status.md) and [decisions/publish-synced-false-at-reconcile-start](../decisions/publish-synced-false-at-reconcile-start.md).

## Related

[findings/misleading-readiness-and-stale-status](misleading-readiness-and-stale-status.md), [findings/premature-readiness-in-kstatus-based-tools](premature-readiness-in-kstatus-based-tools.md), [concepts/conditions](../concepts/conditions.md), [concepts/spec-status-split](../concepts/spec-status-split.md)

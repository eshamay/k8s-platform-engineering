---
title: Missing observedGeneration hides stale status
type: finding
status: active
created: 2026-11-25
updated: 2026-11-26
sources:
  - id: research-spec-status-split
    hash: 598e6132ea4f
    ingested: 2026-11-25
  - id: research-gap-g1-operator-loop-failures
    hash: baca2cdf965d
    ingested: 2026-11-26
  - id: research-gap-m3-status-conditions
    hash: 07099fedb0c8
    ingested: 2026-11-26
aliases: []
tags: [pitfall, observedgeneration, conditions, ack, argo-cd]
---

# Missing observedGeneration hides stale status

## Observation

If a controller does not record the generation it acted on, consumers cannot tell a fresh condition from a stale one. ACK issue 1583 is the clearest example: without `observedGeneration` on its conditions, a stale `ResourceSynced=True` looks the same as a current one. Argo CD maintainers described working around the gap by comparing managed-field timestamps, which they called fragile. The proposed mitigation is to publish `ResourceSynced=False` at the start of each reconcile so consumers can require both `ResourceSynced=True` and a matching generation. At fetch time the issue was open with a frozen label. [sources/research-spec-status-split](../sources/research-spec-status-split.md) URL: https://github.com/aws-controllers-k8s/community/issues/1583.

## Why it matters

Flux exposes the comparison directly: if `observedGeneration` is below `metadata.generation`, a spec change is still pending. A controller that omits the field removes that check from every consumer. The thread also argues that conditions carrying `observedGeneration` remain compatible with Server-Side Apply, which answers a multi-writer objection raised by maintainers. A related OneUptime tutorial lists not setting `ObservedGeneration` among the common operator mistakes.

## Mitigations

Set `observedGeneration` on every condition and on the top level where tools expect it. Where a controller cannot, consumers fall back on timestamp heuristics. See [decisions/publish-synced-false-at-reconcile-start](../decisions/publish-synced-false-at-reconcile-start.md), [comparisons/observedgeneration-top-level-versus-per-condition](../comparisons/observedgeneration-top-level-versus-per-condition.md), [findings/misleading-readiness-and-stale-status](misleading-readiness-and-stale-status.md), and [entities/ack](../entities/ack.md).

## Related

[concepts/conditions](../concepts/conditions.md), [concepts/spec-status-split](../concepts/spec-status-split.md), [concepts/server-side-apply-and-field-ownership](../concepts/server-side-apply-and-field-ownership.md)

## Further 2026 cases from the operator loop dossier

Three open 2026 issues show the consumer-side effect. CloudNativePG 1.30.0 returns a Ready condition produced before a spec patch ([examples/cloudnativepg-issue-11390-kubectl-wait-for-ready-can-return-on-a-condition-produced-before-the-spec-change](../examples/cloudnativepg-issue-11390-kubectl-wait-for-ready-can-return-on-a-condition-produced-before-the-spec-change.md)), restate-operator 3.1.0 has no `observedGeneration` and let Flux mark a release healthy about 37 seconds early ([examples/restate-operator-issue-216-ready-true-before-a-statefulset-rollout-finished-let-flux-mark-the-release-healthy](../examples/restate-operator-issue-216-ready-true-before-a-statefulset-rollout-finished-let-flux-mark-the-release-healthy.md)), and Argo CD's built-in ACK health check reports Healthy before the ACK controller re-stamps its conditions ([examples/argo-cd-issue-30373-the-built-in-ack-health-check-reports-healthy-before-the-controller-observes-a-spec-change](../examples/argo-cd-issue-30373-the-built-in-ack-health-check-reports-healthy-before-the-controller-observes-a-spec-change.md)). The reporter of the last one says ACK issue 1583 has been open since 2022, which is SECONDARY-ONLY here. See [findings/ready-can-be-reported-for-a-spec-generation-the-controller-has-not-yet-observed](ready-can-be-reported-for-a-spec-generation-the-controller-has-not-yet-observed.md). Source: [sources/research-gap-g1-operator-loop-failures](../sources/research-gap-g1-operator-loop-failures.md).

## How the missing field plays out in kstatus

kstatus skips its generation check entirely when `status.observedGeneration` is absent, and it ignores per-condition values, so an ACK-style controller that writes neither placement gives kstatus nothing to compare. [sources/research-gap-m3-status-conditions](../sources/research-gap-m3-status-conditions.md) See [findings/a-kstatus-resource-whose-controller-never-writes-status-observedgeneration-skips-the-generation-check-and-can-read-current-early](a-kstatus-resource-whose-controller-never-writes-status-observedgeneration-skips-the-generation-check-and-can-read-current-early.md) and [findings/kstatus-reads-only-the-top-level-observedgeneration-because-its-condition-struct-has-no-per-condition-field](kstatus-reads-only-the-top-level-observedgeneration-because-its-condition-struct-has-no-per-condition-field.md).

---
title: Misleading readiness and stale status
type: finding
status: active
created: 2026-11-25
updated: 2026-11-26
sources:
  - id: research-eventual-consistency-and-convergence
    hash: bb35eafbd239
    ingested: 2026-11-25
  - id: research-spec-status-split
    hash: 598e6132ea4f
    ingested: 2026-11-25
  - id: research-conditions
    hash: 97b224c63502
    ingested: 2026-11-25
  - id: research-gap-g1-operator-loop-failures
    hash: baca2cdf965d
    ingested: 2026-11-26
aliases: []
tags: [pitfall, conditions, observedgeneration, status]
---

# Misleading readiness and stale status

## Observation

Readiness is easy to confuse with "the controller is working," and status can describe an older spec than the one the user just wrote. The dossier names two defenses. Crossplane separates `Synced` (the provider can reconcile the resource) from `Ready` (the resource is available). The Kubernetes API conventions define a standard conditions structure and `observedGeneration`, so a reader can tell whether a status reflects the latest spec generation. URLs: https://docs.crossplane.io/latest/managed-resources/managed-resources/ and https://github.com/kubernetes/community/blob/master/contributors/devel/sig-architecture/api-conventions.md. [sources/research-eventual-consistency-and-convergence](../sources/research-eventual-consistency-and-convergence.md)

## Why it matters under eventual consistency

Because convergence takes time, there is always a window in which the spec has changed and the status has not. A status that says Ready with an `observedGeneration` behind `metadata.generation` is a statement about the past. Tools that gate on readiness, such as Flux `dependsOn` and Argo CD waves, depend on these signals being honest. See [examples/crossplane-database-claim-reports-synced-and-ready](../examples/crossplane-database-claim-reports-synced-and-ready.md).

## Mitigations

Compare `observedGeneration` to `metadata.generation` before trusting a condition, and read both `Synced` and `Ready` on Crossplane objects. See [concepts/conditions](../concepts/conditions.md) and [concepts/spec-status-split](../concepts/spec-status-split.md).

## Related

[concepts/eventual-consistency-and-convergence](../concepts/eventual-consistency-and-convergence.md), [findings/ordering-and-dependency-failures](ordering-and-dependency-failures.md)

## Further sources of stale and premature readiness

The spec and status dossier adds three concrete cases. ACK conditions lack `observedGeneration`, so a stale `ResourceSynced=True` cannot be told from a current one. A Cluster API resource with `observedGeneration` but no conditions can look ready to kstatus, and Flux may proceed to dependents too early. A suspended Flux resource keeps its last condition and can look healthy. [sources/research-spec-status-split](../sources/research-spec-status-split.md) See [findings/missing-observedgeneration-hides-stale-status](missing-observedgeneration-hides-stale-status.md), [findings/premature-readiness-in-kstatus-based-tools](premature-readiness-in-kstatus-based-tools.md), and [examples/flux-helmrelease-status-records-attempts-and-health](../examples/flux-helmrelease-status-records-attempts-and-health.md).

## Summary conditions that mask in-flight work

Provider-aws issue 2287 adds a case where `Synced` stayed True through a 60-minute update. [sources/research-conditions](../sources/research-conditions.md) See [findings/a-summary-condition-can-stay-true-while-a-long-async-operation-is-running](a-summary-condition-can-stay-true-while-a-long-async-operation-is-running.md).

## Named 2026 cases of early Ready

The operator loop dossier adds three dated, open issues where Ready or Healthy was reported for an unobserved spec generation, in CloudNativePG, restate-operator, and Argo CD's ACK health check. None is a postmortem. See [findings/ready-can-be-reported-for-a-spec-generation-the-controller-has-not-yet-observed](ready-can-be-reported-for-a-spec-generation-the-controller-has-not-yet-observed.md). Source: [sources/research-gap-g1-operator-loop-failures](../sources/research-gap-g1-operator-loop-failures.md).

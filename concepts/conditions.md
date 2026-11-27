---
title: Conditions
type: concept
status: active
created: 2026-11-25
updated: 2026-11-26
sources:
  - id: krm-platform-vocabulary
    hash: 731a6941f9db
    ingested: 2026-11-25
  - id: research-eventual-consistency-and-convergence
    hash: bb35eafbd239
    ingested: 2026-11-25
  - id: research-spec-status-split
    hash: 598e6132ea4f
    ingested: 2026-11-25
  - id: research-conditions
    hash: 97b224c63502
    ingested: 2026-11-25
  - id: research-gap-g3-crossplane-v2
    hash: 073a1fe74dec
    ingested: 2026-11-26
  - id: research-gap-g1-operator-loop-failures
    hash: baca2cdf965d
    ingested: 2026-11-26
  - id: research-gap-m3-status-conditions
    hash: 07099fedb0c8
    ingested: 2026-11-26
aliases: [status.conditions]
tags: [controllers, api-machinery]
---

# Conditions

## Definition

A standardized array in `.status.conditions`, with entries such as Ready, Synced, and Healthy, that gives machine-readable status reporting across tools and CRDs. [sources/krm-platform-vocabulary](../sources/krm-platform-vocabulary.md)

## Why it matters

Conditions are the common language that lets a GitOps tool wait for health, lets a composite resource aggregate its children, and lets humans debug. They live in [status](spec-status-split.md) and are written by the [concepts/reconciliation-loop](reconciliation-loop.md).

## Conditions and observedGeneration under convergence

The API conventions define the standard conditions structure and `observedGeneration`, which lets a reader tell whether a status reflects the latest spec generation. Crossplane applies the idea with separate `Synced` and `Ready` conditions. [sources/research-eventual-consistency-and-convergence](../sources/research-eventual-consistency-and-convergence.md) See [findings/misleading-readiness-and-stale-status](../findings/misleading-readiness-and-stale-status.md) and [examples/crossplane-database-claim-reports-synced-and-ready](../examples/crossplane-database-claim-reports-synced-and-ready.md).

## Related

[concepts/eventual-consistency-and-convergence](eventual-consistency-and-convergence.md), [concepts/composite-resource](composite-resource.md), [entities/flux](../entities/flux.md)

## Condition format and who reads it

The API conventions define a condition as a PascalCase `type` that describes the current observed state, a `True`, `False`, or `Unknown` status, a CamelCase `reason` meant for programs, a human-readable `message`, and `observedGeneration`. Flux, Argo CD, kstatus, Cluster API, and Crossplane all read conditions to decide readiness, so a convention slip such as free text in `reason` breaks consumers. Flux treats `Reconciling=True` as normal progress and `Stalled` as no progress without a change. [sources/research-spec-status-split](../sources/research-spec-status-split.md) See [comparisons/health-and-readiness-models-across-tools](../comparisons/health-and-readiness-models-across-tools.md), [findings/free-text-in-a-condition-reason-breaks-consumers](../findings/free-text-in-a-condition-reason-breaks-consumers.md), [findings/missing-observedgeneration-hides-stale-status](../findings/missing-observedgeneration-hides-stale-status.md), [comparisons/observedgeneration-top-level-versus-per-condition](../comparisons/observedgeneration-top-level-versus-per-condition.md), and [entities/kstatus](../entities/kstatus.md).

## Anatomy of a condition

A condition is one entry in `.status.conditions`. It has a `type`, a `status` of `True`, `False`, or `Unknown`, a machine-readable `reason`, a human-readable `message`, a `lastTransitionTime`, and an optional `observedGeneration`. The list is treated as a map keyed by `type`, and a missing condition is equivalent to `Unknown`. Conditions complement the detailed status fields and do not replace them. Type names should be short PascalCase adjectives or past-tense verbs that describe observed state, not transitions, and controllers should report conditions on first visit, even as `Unknown`, to show they have started work. KEP-1623 produced the shared `metav1.Condition` type, made `lastTransitionTime` and `reason` required, and shipped helpers such as `SetStatusCondition` and `FindStatusCondition`, but adoption is voluntary, so older APIs keep their own shapes. [sources/research-conditions](../sources/research-conditions.md) See [comparisons/condition-vocabularies-across-crossplane-ack-config-connector-flux-kro-and-cluster-api](../comparisons/condition-vocabularies-across-crossplane-ack-config-connector-flux-kro-and-cluster-api.md).

## Why observedGeneration makes a condition trustworthy

`metadata.generation` increases when the spec changes, and a controller copies the generation it has processed into status, at the top level, on each condition, or both. If `generation` is greater than `observedGeneration`, the status describes an older spec. Under the abnormal-true pattern that kstatus describes, the absence of problem conditions looks healthy, so a stopped or lagging controller looks the same as a healthy one, and comparing generations breaks that ambiguity. The sources agree that omitting it is the most common mistake. [sources/research-conditions](../sources/research-conditions.md) See [findings/abnormal-true-polarity-makes-a-stopped-controller-look-healthy](../findings/abnormal-true-polarity-makes-a-stopped-controller-look-healthy.md), [findings/missing-observedgeneration-hides-stale-status](../findings/missing-observedgeneration-hides-stale-status.md), and [comparisons/observedgeneration-top-level-versus-per-condition](../comparisons/observedgeneration-top-level-versus-per-condition.md).

## Condition vocabularies differ by stack

`Ready` is the conventional top-level summary, but its meaning varies. Crossplane separates `Synced` (could the controller reconcile) from `Ready` (is the external resource usable). ACK adds `ACK.ResourceSynced`, `ACK.Terminal`, and `ACK.Recoverable` and keeps `Ready` as the roll-up. Config Connector uses a single `Ready` whose reasons are `Updating`, `UpToDate`, and `UpdateFailed` (the design document said `UpdateFailure`, which did not ship). Flux uses `Ready` plus `Reconciling` and `Stalled`. kro lets the RGD author define instance conditions with CEL. Cluster API moved to `metav1.Condition` and split `Available` from `Ready`. [sources/research-conditions](../sources/research-conditions.md) See [examples/crossplane-synced-stays-true-through-a-sixty-minute-async-msk-update](../examples/crossplane-synced-stays-true-through-a-sixty-minute-async-msk-update.md), [examples/ack-splits-terminal-and-recoverable-errors-into-separate-conditions](../examples/ack-splits-terminal-and-recoverable-errors-into-separate-conditions.md), [examples/config-connector-ready-condition-moves-through-updating-uptodate-and-updatefailure](../examples/config-connector-ready-condition-moves-through-updating-uptodate-and-updatefailure.md), [examples/kro-rgd-authors-define-instance-conditions-with-cel-and-readywhen](../examples/kro-rgd-authors-define-instance-conditions-with-cel-and-readywhen.md), [examples/cluster-api-adds-available-and-operation-conditions-beside-ready](../examples/cluster-api-adds-available-and-operation-conditions-beside-ready.md), and [comparisons/provider-fixed-versus-author-defined-condition-semantics-crossplane-versus-kro](../comparisons/provider-fixed-versus-author-defined-condition-semantics-crossplane-versus-kro.md).

## Who consumes conditions

Everyday consumers include `kubectl rollout status`, which reads the Deployment's `Progressing` condition and its `ProgressDeadlineExceeded` reason, and Helm's `--wait`. GitOps tools use conditions for ordering: Flux's kustomize-controller waits for health before marking a Kustomization `Ready` and unblocking those that `dependsOn` it, judging compatible custom resources with kstatus and others with CEL `healthCheckExprs`, while Argo CD aggregates the worst health of an application's immediate children and needs Lua checks for CRDs. [sources/research-conditions](../sources/research-conditions.md) See [examples/deployment-progress-deadline-sets-progressing-false-for-a-stalled-rollout](../examples/deployment-progress-deadline-sets-progressing-false-for-a-stalled-rollout.md), [examples/flux-dependson-and-health-checks-gate-rollout](../examples/flux-dependson-and-health-checks-gate-rollout.md), and [examples/argo-cd-rolls-up-child-health-with-lua-checks](../examples/argo-cd-rolls-up-child-health-with-lua-checks.md).

## Pitfalls

The recurring failure modes are a missing or stale `observedGeneration`, premature readiness on new objects (kstatus treats a resource with no conditions as reconciled), abnormal-true polarity that hides a dead controller, summary conditions that mask in-flight work, an all-powerful `Ready`, and heartbeat writes to `lastTransitionTime`. Mitigations include defaulting `observedGeneration`, an initial `Unknown` condition, CEL or Lua health checks, and terminal versus recoverable error classes. See [findings/premature-readiness-in-kstatus-based-tools](../findings/premature-readiness-in-kstatus-based-tools.md), [findings/a-summary-condition-can-stay-true-while-a-long-async-operation-is-running](../findings/a-summary-condition-can-stay-true-while-a-long-async-operation-is-running.md), [findings/one-mandatory-ready-condition-that-summarizes-everything-is-too-rigid](../findings/one-mandatory-ready-condition-that-summarizes-everything-is-too-rigid.md), [findings/updating-lasttransitiontime-on-every-reconcile-turns-a-condition-into-a-heartbeat](../findings/updating-lasttransitiontime-on-every-reconcile-turns-a-condition-into-a-heartbeat.md), and [findings/condition-polarity-guidance-conflicts-between-kstatus-and-the-api-conventions](../findings/condition-polarity-guidance-conflicts-between-kstatus-and-the-api-conventions.md). The open polarity question is framed in [decisions/choose-abnormal-true-or-positive-polarity-for-new-condition-types](../decisions/choose-abnormal-true-or-positive-polarity-for-new-condition-types.md).

## Further reading

The clearest short explanation of `observedGeneration` is an operator best-practices post on Medium, the best entry point for `Synced` versus `Ready` is the Crossplane managed resources page, and the kstatus README explains how tools infer "done". The URLs are listed in [sources/research-conditions](../sources/research-conditions.md).

## Update from the v2.5 verification pass (2026-11-26)

The Crossplane async `Synced` pitfall is unfixed as of 2026-11-26: provider-aws issue 2287 was closed by the stale bot without a fix, and the current upjet and crossplane-runtime source still marks `ReconcileSuccess` while an async operation runs. [sources/research-gap-g3-crossplane-v2](../sources/research-gap-g3-crossplane-v2.md) See [findings/upjet-and-crossplane-runtime-source-still-reports-reconcilesuccess-while-an-async-operation-runs](../findings/upjet-and-crossplane-runtime-source-still-reports-reconcilesuccess-while-an-async-operation-runs.md).

## Operator loop dossier additions

Three open 2026 issues show Ready or Healthy reported before the controller observed the spec generation (CloudNativePG, restate-operator, and Argo CD's ACK health check), and a Longhorn issue shows a volatile condition message driving about 6 reconciles per second. None is a postmortem. See [findings/ready-can-be-reported-for-a-spec-generation-the-controller-has-not-yet-observed](../findings/ready-can-be-reported-for-a-spec-generation-the-controller-has-not-yet-observed.md) and [findings/volatile-text-in-a-condition-message-defeats-the-equality-check-and-causes-a-reconcile-storm](../findings/volatile-text-in-a-condition-message-defeats-the-equality-check-and-causes-a-reconcile-storm.md). Source: [sources/research-gap-g1-operator-loop-failures](../sources/research-gap-g1-operator-loop-failures.md).

## Status and condition gaps settled in the m3 dossier

kstatus evaluates deletion, then a top-level generation comparison, then `Reconciling` and `Stalled`, then type-specific rules, then a `Ready` fallback, and defaults to Current, and it never reads a condition's own `observedGeneration`. The API conventions recommended abnormal-true, then positive, and since June 2020 recommend neither polarity as a general rule. `observedGeneration` placement is a design choice with three coexisting practices, and Config Connector shipped `UpdateFailed` with a single `Ready` condition. [sources/research-gap-m3-status-conditions](../sources/research-gap-m3-status-conditions.md) See [findings/kstatus-checks-deletion-then-generation-then-reconciling-and-stalled-then-ready-so-a-stale-top-level-observedgeneration-overrides-ready-true](../findings/kstatus-checks-deletion-then-generation-then-reconciling-and-stalled-then-ready-so-a-stale-top-level-observedgeneration-overrides-ready-true.md), [findings/the-kubernetes-api-conventions-recommended-abnormal-true-then-positive-polarity-and-since-june-2020-recommend-neither](../findings/the-kubernetes-api-conventions-recommended-abnormal-true-then-positive-polarity-and-since-june-2020-recommend-neither.md), [decisions/place-observedgeneration-at-the-top-level-on-each-condition-or-both](../decisions/place-observedgeneration-at-the-top-level-on-each-condition-or-both.md), and [findings/config-connector-shipped-updatefailed-with-a-single-ready-condition-and-the-first-field-path-message-and-operation-id-reason-are-not-in-code](../findings/config-connector-shipped-updatefailed-with-a-single-ready-condition-and-the-first-field-path-message-and-operation-id-reason-are-not-in-code.md).

Correction note: the vocabularies section above previously gave Config Connector's failure reason as `UpdateFailure`, which was the design document's name. The shipped reason is `UpdateFailed`.

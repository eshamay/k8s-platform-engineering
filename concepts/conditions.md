---
title: Conditions
type: concept
status: active
created: 2026-11-25
updated: 2026-11-25
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
aliases: [status.conditions]
tags: [controllers, api-machinery]
---

# Conditions

## Definition

A standardized array in `.status.conditions`, with entries such as Ready, Synced, and Healthy, that gives machine-readable status reporting across tools and CRDs. [[sources/krm-platform-vocabulary]]

## Why it matters

Conditions are the common language that lets a GitOps tool wait for health, lets a composite resource aggregate its children, and lets humans debug. They live in [[concepts/spec-status-split|status]] and are written by the [[concepts/reconciliation-loop]].

## Conditions and observedGeneration under convergence

The API conventions define the standard conditions structure and `observedGeneration`, which lets a reader tell whether a status reflects the latest spec generation. Crossplane applies the idea with separate `Synced` and `Ready` conditions. [[sources/research-eventual-consistency-and-convergence]] See [[findings/misleading-readiness-and-stale-status]] and [[examples/crossplane-database-claim-reports-synced-and-ready]].

## Related

[[concepts/eventual-consistency-and-convergence]], [[concepts/composite-resource]], [[entities/flux]]

## Condition format and who reads it

The API conventions define a condition as a PascalCase `type` that describes the current observed state, a `True`, `False`, or `Unknown` status, a CamelCase `reason` meant for programs, a human-readable `message`, and `observedGeneration`. Flux, Argo CD, kstatus, Cluster API, and Crossplane all read conditions to decide readiness, so a convention slip such as free text in `reason` breaks consumers. Flux treats `Reconciling=True` as normal progress and `Stalled` as no progress without a change. [[sources/research-spec-status-split]] See [[comparisons/health-and-readiness-models-across-tools]], [[findings/free-text-in-a-condition-reason-breaks-consumers]], [[findings/missing-observedgeneration-hides-stale-status]], [[comparisons/observedgeneration-top-level-versus-per-condition]], and [[entities/kstatus]].

## Anatomy of a condition

A condition is one entry in `.status.conditions`. It has a `type`, a `status` of `True`, `False`, or `Unknown`, a machine-readable `reason`, a human-readable `message`, a `lastTransitionTime`, and an optional `observedGeneration`. The list is treated as a map keyed by `type`, and a missing condition is equivalent to `Unknown`. Conditions complement the detailed status fields and do not replace them. Type names should be short PascalCase adjectives or past-tense verbs that describe observed state, not transitions, and controllers should report conditions on first visit, even as `Unknown`, to show they have started work. KEP-1623 produced the shared `metav1.Condition` type, made `lastTransitionTime` and `reason` required, and shipped helpers such as `SetStatusCondition` and `FindStatusCondition`, but adoption is voluntary, so older APIs keep their own shapes. [[sources/research-conditions]] See [[comparisons/condition-vocabularies-across-crossplane-ack-config-connector-flux-kro-and-cluster-api]].

## Why observedGeneration makes a condition trustworthy

`metadata.generation` increases when the spec changes, and a controller copies the generation it has processed into status, at the top level, on each condition, or both. If `generation` is greater than `observedGeneration`, the status describes an older spec. Under the abnormal-true pattern that kstatus describes, the absence of problem conditions looks healthy, so a stopped or lagging controller looks the same as a healthy one, and comparing generations breaks that ambiguity. The sources agree that omitting it is the most common mistake. [[sources/research-conditions]] See [[findings/abnormal-true-polarity-makes-a-stopped-controller-look-healthy]], [[findings/missing-observedgeneration-hides-stale-status]], and [[comparisons/observedgeneration-top-level-versus-per-condition]].

## Condition vocabularies differ by stack

`Ready` is the conventional top-level summary, but its meaning varies. Crossplane separates `Synced` (could the controller reconcile) from `Ready` (is the external resource usable). ACK adds `ACK.ResourceSynced`, `ACK.Terminal`, and `ACK.Recoverable` and keeps `Ready` as the roll-up. Config Connector uses a single `Ready` whose reasons are `Updating`, `UpToDate`, and `UpdateFailure`. Flux uses `Ready` plus `Reconciling` and `Stalled`. kro lets the RGD author define instance conditions with CEL. Cluster API moved to `metav1.Condition` and split `Available` from `Ready`. [[sources/research-conditions]] See [[examples/crossplane-synced-stays-true-through-a-sixty-minute-async-msk-update]], [[examples/ack-splits-terminal-and-recoverable-errors-into-separate-conditions]], [[examples/config-connector-ready-condition-moves-through-updating-uptodate-and-updatefailure]], [[examples/kro-rgd-authors-define-instance-conditions-with-cel-and-readywhen]], [[examples/cluster-api-adds-available-and-operation-conditions-beside-ready]], and [[comparisons/provider-fixed-versus-author-defined-condition-semantics-crossplane-versus-kro]].

## Who consumes conditions

Everyday consumers include `kubectl rollout status`, which reads the Deployment's `Progressing` condition and its `ProgressDeadlineExceeded` reason, and Helm's `--wait`. GitOps tools use conditions for ordering: Flux's kustomize-controller waits for health before marking a Kustomization `Ready` and unblocking those that `dependsOn` it, judging compatible custom resources with kstatus and others with CEL `healthCheckExprs`, while Argo CD aggregates the worst health of an application's immediate children and needs Lua checks for CRDs. [[sources/research-conditions]] See [[examples/deployment-progress-deadline-sets-progressing-false-for-a-stalled-rollout]], [[examples/flux-dependson-and-health-checks-gate-rollout]], and [[examples/argo-cd-rolls-up-child-health-with-lua-checks]].

## Pitfalls

The recurring failure modes are a missing or stale `observedGeneration`, premature readiness on new objects (kstatus treats a resource with no conditions as reconciled), abnormal-true polarity that hides a dead controller, summary conditions that mask in-flight work, an all-powerful `Ready`, and heartbeat writes to `lastTransitionTime`. Mitigations include defaulting `observedGeneration`, an initial `Unknown` condition, CEL or Lua health checks, and terminal versus recoverable error classes. See [[findings/premature-readiness-in-kstatus-based-tools]], [[findings/a-summary-condition-can-stay-true-while-a-long-async-operation-is-running]], [[findings/one-mandatory-ready-condition-that-summarizes-everything-is-too-rigid]], [[findings/updating-lasttransitiontime-on-every-reconcile-turns-a-condition-into-a-heartbeat]], and [[findings/condition-polarity-guidance-conflicts-between-kstatus-and-the-api-conventions]]. The open polarity question is framed in [[decisions/choose-abnormal-true-or-positive-polarity-for-new-condition-types]].

## Further reading

The clearest short explanation of `observedGeneration` is an operator best-practices post on Medium, the best entry point for `Synced` versus `Ready` is the Crossplane managed resources page, and the kstatus README explains how tools infer "done". The URLs are listed in [[sources/research-conditions]].

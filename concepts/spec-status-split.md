---
title: Spec vs Status Split
type: concept
status: active
created: 2026-11-25
updated: 2026-11-26
sources:
  - id: krm-platform-vocabulary
    hash: 731a6941f9db
    ingested: 2026-11-25
  - id: research-custom-resource-definition
    hash: 6c26f7f89147
    ingested: 2026-11-25
  - id: research-spec-status-split
    hash: 598e6132ea4f
    ingested: 2026-11-25
  - id: research-conditions
    hash: 97b224c63502
    ingested: 2026-11-25
  - id: research-gap-g3-kro
    hash: e8d7c5923d98
    ingested: 2026-11-26
  - id: research-gap-m3-status-conditions
    hash: 07099fedb0c8
    ingested: 2026-11-26
aliases: [Spec and status]
tags: [api-machinery]
---

# Spec vs Status Split

## Definition

The strict separation of ownership on a KRM object. Users and GitOps tools own `.spec`, which records intent. Controllers own `.status`, which records observed reality. The split is enforced through a `/status` subresource. [sources/krm-platform-vocabulary](../sources/krm-platform-vocabulary.md)

The Kubernetes API conventions describe spec as the complete description of desired state, including defaults and modifications by ecosystem components, and status as a summary of current state, usually written by automated processes. [sources/research-spec-status-split](../sources/research-spec-status-split.md)

## Why it matters

The split prevents a GitOps tool that re-applies manifests from overwriting what a controller observed, and it gives the reconcile loop a clean input (spec) and output (status). It is what makes Kubernetes declarative: a human or tool states intent once, and independent control loops converge reality toward it and report progress without overwriting that intent. See [concepts/reconciliation-loop](reconciliation-loop.md) and [concepts/conditions](conditions.md).

## Mechanics of the status subresource

For a CRD, setting `spec.subresources.status: {}` changes write semantics. A PUT or PATCH on the main resource ignores status changes, a PUT or PATCH on `/status` ignores everything except status, and only changes to the main resource bump `metadata.generation`. The subresource also has its own authorization scope, so users can hold write access to spec while controllers hold write access to status. [sources/research-spec-status-split](../sources/research-spec-status-split.md) See [concepts/custom-resource-definition](custom-resource-definition.md).

The generation counter gives a controller a cheap staleness check. The controller copies the generation it acted on into `status.observedGeneration` (and, under current conventions, into each condition), and consumers compare the two numbers to learn whether status describes the latest spec. Flux exposes this comparison directly: an `observedGeneration` below `metadata.generation` means a spec change is pending. `resourceVersion` conflicts on writes return HTTP 409. [sources/research-custom-resource-definition](../sources/research-custom-resource-definition.md) See [comparisons/observedgeneration-top-level-versus-per-condition](../comparisons/observedgeneration-top-level-versus-per-condition.md).

## Status as an integration surface

Status is more than a convenience. Conditions with `type`, `status`, `reason`, `message`, and `observedGeneration` are what Flux, Argo CD, kstatus, Cluster API, and Crossplane read to decide whether a resource is ready or healthy. Where conventions are followed, generic tooling works, and where they are not (ACK lacks `observedGeneration` on conditions, and many CRDs have no standard health shape), every consumer needs custom code. The conventions also require level-based thinking: status is a recent observation and not an event log, and controllers should be able to rebuild it. [sources/research-spec-status-split](../sources/research-spec-status-split.md) See [comparisons/health-and-readiness-models-across-tools](../comparisons/health-and-readiness-models-across-tools.md), [entities/kstatus](../entities/kstatus.md), and [concepts/level-triggered-vs-edge-triggered](level-triggered-vs-edge-triggered.md).

## The split at the platform layer

Crossplane composites and kro graphs repeat the split at a higher level. The platform author defines a spec schema for users and a status schema that surfaces rolled-up readiness or selected fields from the composed resources. A Crossplane XR also puts composition selection and pinning in its spec and reports `Synced` and `Ready` in its status, while kro uses CEL expressions that reference the status of underlying resources. See [examples/crossplane-xr-spec-pins-composition-and-status-reports-synced-and-ready](../examples/crossplane-xr-spec-pins-composition-and-status-reports-synced-and-ready.md), [entities/crossplane](../entities/crossplane.md), [entities/kro](../entities/kro.md), and [concepts/composite-resource](composite-resource.md).

## Pitfalls

The sourced failure modes are reconcile loops when status is written through the main resource ([findings/status-writes-through-the-main-resource-retrigger-reconcile-loops](../findings/status-writes-through-the-main-resource-retrigger-reconcile-loops.md)), stale status when `observedGeneration` is missing ([findings/missing-observedgeneration-hides-stale-status](../findings/missing-observedgeneration-hides-stale-status.md)), premature readiness in generic tools ([findings/premature-readiness-in-kstatus-based-tools](../findings/premature-readiness-in-kstatus-based-tools.md)), non-standard fields such as free text in `reason` ([findings/free-text-in-a-condition-reason-breaks-consumers](../findings/free-text-in-a-condition-reason-breaks-consumers.md)), operator implementation mistakes with RBAC and conflicts ([findings/status-client-rbac-and-conflict-mistakes](../findings/status-client-rbac-and-conflict-mistakes.md)), and several writers on one object ([findings/config-style-crds-with-several-reconcilers-get-no-status](../findings/config-style-crds-with-several-reconcilers-get-no-status.md)). The broader readiness problem is in [findings/misleading-readiness-and-stale-status](../findings/misleading-readiness-and-stale-status.md).

## Real-world uses

The Deployment `replicas` versus `readyReplicas` pair is the baseline ([examples/deployment-status-reports-ready-replicas-against-spec-replicas](../examples/deployment-status-reports-ready-replicas-against-spec-replicas.md)). Prometheus Operator retrofitted status onto its workload CRDs ([examples/prometheus-operator-retrofits-status-onto-workload-crds](../examples/prometheus-operator-retrofits-status-onto-workload-crds.md)). Flux records attempts and health in HelmRelease status ([examples/flux-helmrelease-status-records-attempts-and-health](../examples/flux-helmrelease-status-records-attempts-and-health.md)), Argo CD rolls up health from child status ([examples/argo-cd-rolls-up-child-health-with-lua-checks](../examples/argo-cd-rolls-up-child-health-with-lua-checks.md)), and Cluster API readiness gates Flux dependents ([examples/cluster-api-readiness-gates-flux-dependents](../examples/cluster-api-readiness-gates-flux-dependents.md)).

## Open questions

Whether `observedGeneration` belongs at the top level, on each condition, or both is not settled across sources. How generic tools should cope with Cluster API moving from `Ready` to `Available` is unresolved. The kro status schema, Crossplane v2 function-pipeline status propagation, and Config Connector status semantics were not read at primary-source depth. See [open-knowledge-gaps](../open-knowledge-gaps.md).

## Related

[concepts/declarative-vs-imperative](declarative-vs-imperative.md), [concepts/server-side-apply-and-field-ownership](server-side-apply-and-field-ownership.md), [concepts/custom-resource-definition](custom-resource-definition.md), [decisions/which-crds-get-a-status-subresource](../decisions/which-crds-get-a-status-subresource.md), [decisions/publish-synced-false-at-reconcile-start](../decisions/publish-synced-false-at-reconcile-start.md)

## Conditions in depth

The dossier on conditions adds the field-by-field anatomy, the per-tool vocabularies, and the failure modes of the status surface. [sources/research-conditions](../sources/research-conditions.md) See [concepts/conditions](conditions.md) and [comparisons/condition-vocabularies-across-crossplane-ack-config-connector-flux-kro-and-cluster-api](../comparisons/condition-vocabularies-across-crossplane-ack-config-connector-flux-kro-and-cluster-api.md).

## kro status schema at v0.10.0

kro's status half is author-defined. An RGD's `spec.schema.status` maps field names to CEL expressions over the managed resources, and the generated CRD gives each field a type inferred from the expression output, so status has strongly typed schemas and not arbitrary objects. kro adds `conditions` and `state` to every instance status, and `state` is reserved, so kro overrides any definition of it. The RGD object has its own status with five conditions (`Ready`, `GraphRevisionsResolved`, `GraphAccepted`, `KindReady`, `ControllerReady`) and a separate `state` of `Active` or `Inactive`. On the Crossplane side, the current docs say a composite resource has `Synced` and `Ready` conditions and that `Ready` is True when the function pipeline reports all composed resources ready, but how the function signal reaches that condition was not read in source. [sources/research-gap-g3-kro](../sources/research-gap-g3-kro.md) See [entities/kro](../entities/kro.md).

## Where observedGeneration lives, per the m3 dossier

The conventions describe a status-level `observedGeneration` and a per-condition one, and no source ranks them. kstatus and Argo CD read only the top-level field. [sources/research-gap-m3-status-conditions](../sources/research-gap-m3-status-conditions.md) See [decisions/place-observedgeneration-at-the-top-level-on-each-condition-or-both](../decisions/place-observedgeneration-at-the-top-level-on-each-condition-or-both.md), [comparisons/observedgeneration-top-level-versus-per-condition](../comparisons/observedgeneration-top-level-versus-per-condition.md), and [entities/kstatus](../entities/kstatus.md).

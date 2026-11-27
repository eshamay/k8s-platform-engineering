---
title: Health and readiness models across Flux, Argo CD, kstatus, Cluster API, and Crossplane
type: comparison
status: draft
created: 2026-11-25
updated: 2026-11-26
sources:
  - id: research-spec-status-split
    hash: 598e6132ea4f
    ingested: 2026-11-25
  - id: research-conditions
    hash: 97b224c63502
    ingested: 2026-11-25
  - id: research-gap-m3-status-conditions
    hash: 07099fedb0c8
    ingested: 2026-11-26
  - id: research-gap-o3-gitops-provider-managed
    hash: 55252dbb507a
    ingested: 2026-11-26
aliases: []
tags: [conditions, health, readiness, flux, argo-cd, kstatus, crossplane, cluster-api]
---

# Health and readiness models across Flux, Argo CD, kstatus, Cluster API, and Crossplane

## Question

Every tool that consumes `status` has to answer the same question: is this resource ready or healthy? The tools answer it with different vocabularies and different amounts of per-kind knowledge. [sources/research-spec-status-split](../sources/research-spec-status-split.md)

## Comparison

| Tool | Vocabulary | Source of truth | Per-kind code needed |
|---|---|---|---|
| kstatus | InProgress, Current, Failed, Terminating, NotFound, Unknown | `observedGeneration` plus `Ready`, `Reconciling`, `Stalled` conditions | None for kinds that follow the conventions |
| Flux | `Ready`, `Reconciling`, `Stalled` on its own objects; reads dependency readiness through kstatus | Its own conditions, plus `observedGeneration` against `metadata.generation` | CEL custom health checks for kinds such as Cluster API |
| Argo CD | Healthy, Progressing, Degraded, Suspended | Built-in checks for core types, Lua scripts over `obj.status` for CRDs | A Lua script per CRD without a standard status |
| Crossplane | `Synced` and `Ready` | Controller reconcilability and function-pipeline readiness of composed resources | None for consumers who read both conditions |
| Cluster API | `Ready`, moving to `Available` | Provider objects feeding Flux ordering | Needs custom checks once kstatus no longer fits |

## Analysis

The tools converge on conditions but disagree on the names, and the disagreement is where the cost lands. kstatus is the shared denominator and works only where the conventions are followed. Argo CD states the problem plainly: "CRDs do not follow a consistent or standardized status format." Argo CD also rolls health up as the worst of an application's immediate children, which differs from Crossplane's rule that a composite is ready only when every composed resource is ready, though both are worst-case aggregations. Flux handles the gap by adding CEL health checks rather than waiting for a convention. Crossplane's two-condition split is the clearest attempt to keep "the platform is broken" separate from "the cloud resource is still coming up". The dossier did not read kstatus's exact rules or Argo CD's status semantics beyond health, so this table summarizes documented vocabulary and not full behavior. See [examples/argo-cd-rolls-up-child-health-with-lua-checks](../examples/argo-cd-rolls-up-child-health-with-lua-checks.md), [examples/flux-helmrelease-status-records-attempts-and-health](../examples/flux-helmrelease-status-records-attempts-and-health.md), [findings/premature-readiness-in-kstatus-based-tools](../findings/premature-readiness-in-kstatus-based-tools.md), and [entities/kstatus](../entities/kstatus.md).

## Related

[concepts/conditions](../concepts/conditions.md), [concepts/spec-status-split](../concepts/spec-status-split.md), [findings/generic-gitops-agents-cannot-judge-custom-resource-health](../findings/generic-gitops-agents-cannot-judge-custom-resource-health.md)

## Condition vocabularies

A vocabulary-level companion to this page lists the condition types of Crossplane, ACK, Config Connector, Flux, kro, and Cluster API. [sources/research-conditions](../sources/research-conditions.md) See [comparisons/condition-vocabularies-across-crossplane-ack-config-connector-flux-kro-and-cluster-api](condition-vocabularies-across-crossplane-ack-config-connector-flux-kro-and-cluster-api.md).

## Evidence from the m3 dossier

kstatus decides in a fixed order (deletion, top-level generation, `Reconciling` and `Stalled`, built-in rules, `Ready`, then Current), and Argo CD ships a Lua health script for Config Connector that keys on `UpToDate`, `UpdateFailed`, `DependencyNotFound`, and `DependencyNotReady`. [sources/research-gap-m3-status-conditions](../sources/research-gap-m3-status-conditions.md) See [findings/kstatus-checks-deletion-then-generation-then-reconciling-and-stalled-then-ready-so-a-stale-top-level-observedgeneration-overrides-ready-true](../findings/kstatus-checks-deletion-then-generation-then-reconciling-and-stalled-then-ready-so-a-stale-top-level-observedgeneration-overrides-ready-true.md) and [examples/argo-cd-s-config-connector-health-script-maps-uptodate-to-healthy-updatefailed-to-degraded-and-gates-on-observedgeneration](../examples/argo-cd-s-config-connector-health-script-maps-uptodate-to-healthy-updatefailed-to-degraded-and-gates-on-observedgeneration.md).

## How the two GitOps agents read provider conditions (o3 dossier)

Argo CD maps provider conditions with shipped Lua scripts: for ACK, `ACK.Terminal=True` is Degraded and `Ready` True or False is Healthy or Progressing, and for Config Connector the `Ready` reason `UpToDate` is Healthy, `UpdateFailed` and `DependencyNotFound` are Degraded, and `DependencyNotReady` is Suspended. Flux has no per-provider logic and uses kstatus or CEL `healthCheckExprs`. See [findings/argo-cd-ships-built-in-lua-health-checks-for-config-connector-ack-crossplane-upbound-kro-and-cluster-api-kinds-and-an-unhealthy-provider-object-blocks-later-sync-waves](../findings/argo-cd-ships-built-in-lua-health-checks-for-config-connector-ack-crossplane-upbound-kro-and-cluster-api-kinds-and-an-unhealthy-provider-object-blocks-later-sync-waves.md) and [findings/flux-judges-provider-managed-resources-through-kstatus-or-cel-health-check-expressions-and-its-cel-cheatsheet-lists-crossplane-but-not-config-connector-or-ack](../findings/flux-judges-provider-managed-resources-through-kstatus-or-cel-health-check-expressions-and-its-cel-cheatsheet-lists-crossplane-but-not-config-connector-or-ack.md). Composition layers gate on the same condition: `function-auto-ready` wants `Ready=True` and kro `readyWhen` is author-written CEL. [sources/research-gap-o3-gitops-provider-managed](../sources/research-gap-o3-gitops-provider-managed.md)

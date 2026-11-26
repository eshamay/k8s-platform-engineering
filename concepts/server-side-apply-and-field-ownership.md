---
title: Server-Side Apply and Field Ownership
type: concept
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: krm-platform-vocabulary
    hash: 731a6941f9db
    ingested: 2026-11-25
  - id: research-declarative-vs-imperative
    hash: 570767ba4094
    ingested: 2026-11-25
  - id: research-self-healing-and-drift-detection
    hash: 98edc2019c6b
    ingested: 2026-11-25
aliases: [SSA, managedFields]
tags: [api-machinery]
---

# Server-Side Apply and Field Ownership

## Definition

A Kubernetes API mechanism that tracks which controller or user owns each field of a manifest, recorded in `managedFields`. It lets several actors, for example Flux and a horizontal autoscaler, co-manage different parts of the same object without overwriting each other. [[sources/krm-platform-vocabulary]]

## Why it matters

SSA is what lets GitOps tools coexist with in-cluster controllers. Conflicts arise when two managers claim the same field, and resolving them (force-apply, ownership transfer) is a common operational pitfall.

## Conflicts and migration from client-side apply

The API server records which manager owns each field and flags a conflict when another manager owns a differing field. Resolutions are to force, to give up the field, or to coordinate. This replaces the client-side `last-applied-configuration` annotation approach, and it is how humans, Flux, an autoscaler, and other controllers can share one object safely. Flux drift detection uses a server-side apply dry run. [[sources/research-declarative-vs-imperative]] See [[findings/multiple-writers-on-one-object]] and [[concepts/declarative-vs-imperative]].

## Related

[[concepts/spec-status-split]], [[concepts/gitops-pull-based-delivery]], [[entities/flux]]

## To research

Conflict behavior, `force` semantics, migration from client-side apply, and how Flux and Crossplane use SSA.

## Field ownership and drift correction

Flux and Argo CD rely on server-side apply to decide what is theirs, and the Kubernetes documentation says conflicting writes can be forced (ownership transfers), can drop the field, or can abort. In practice another manager's edit shows up as drift or as a conflict, and a leftover manager entry such as `kubectl-edit` can make Flux's dry-run fail so that no correction happens. Argo CD's `managedFieldsManagers` ignores chosen managers when diffing. [[sources/research-self-healing-and-drift-detection]] See [[findings/field-ownership-blocks-drift-correction]], [[examples/flux-helmrelease-drift-correction-blocked-by-edited-service-port]], and [[comparisons/exemption-and-ignore-controls-across-tools]].

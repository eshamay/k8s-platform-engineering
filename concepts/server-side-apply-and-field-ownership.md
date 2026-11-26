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
aliases: [SSA, managedFields]
tags: [api-machinery]
---

# Server-Side Apply and Field Ownership

## Definition

A Kubernetes API mechanism that tracks which controller or user owns each field of a manifest, recorded in `managedFields`. It lets several actors, for example Flux and a horizontal autoscaler, co-manage different parts of the same object without overwriting each other. [[sources/krm-platform-vocabulary]]

## Why it matters

SSA is what lets GitOps tools coexist with in-cluster controllers. Conflicts arise when two managers claim the same field, and resolving them (force-apply, ownership transfer) is a common operational pitfall.

## Related

[[concepts/spec-status-split]], [[concepts/gitops-pull-based-delivery]], [[entities/flux]]

## To research

Conflict behavior, `force` semantics, migration from client-side apply, and how Flux and Crossplane use SSA.

---
title: "Hand-written providers that treat not-found as an error break the create flow"
type: finding
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-provider
    hash: 7e43edcd71be
    ingested: 2026-11-25
aliases: []
tags: [crossplane, provider, external-client, idempotency, pitfall]
---

# Hand-written providers that treat not-found as an error break the create flow

## Observation

The Crossplane provider development guide warns that an `Observe` call must report a missing external resource as `ResourceExists: false` and not as an error. It also says to ignore expected already-exists and not-found errors, to keep parameter structs faithful to the external API, and to document fields because user documentation is generated from GoDoc. [[sources/research-provider]]

## Why it matters

The shared managed reconciler uses the result of `Observe` to decide whether to call `Create`. If a not-found response is returned as an error, the reconciler reports a failure and never creates the resource, so a brand-new managed resource would sit in a failing state. Tolerating already-exists and not-found keeps create and delete idempotent when a reconcile is retried, see [[concepts/idempotency]]. [[sources/research-provider]]

## Related

The author-facing flow is in [[examples/provider-authors-implement-an-external-client-behind-the-shared-managed-reconciler]]. The crash window between create and saving the external name is a related leak risk, see [[examples/provider-restart-blocks-a-crossplane-resource-on-external-create-pending]]. See [[concepts/provider]].

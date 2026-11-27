---
title: Provider authors implement an external client behind the shared managed reconciler
type: example
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-managed-resource
    hash: 09ca2f9dcdc6
    ingested: 2026-11-25
aliases: []
tags: [crossplane, provider, reconciler, external-client, idempotency]
---

# Provider authors implement an external client behind the shared managed reconciler

## Scenario

Someone wants to add a new kind of external resource to Crossplane, for example a SaaS object, without writing a whole controller. The provider-development guide shows that a managed resource is a controller pattern with a shared reconciler library, so the author supplies only the calls that touch the external API. [sources/research-managed-resource](../sources/research-managed-resource.md)

## How it works

The shared `managed.Reconciler` walks the phases Connect, Observe, Create, Update, and Delete. The author implements the five-method `managed.ExternalClient` interface that the reconciler calls at each phase. The guide stresses that create and delete must be idempotent, that output-only fields are late-initialized back into the object, and that connection details are published for consumers. Its sharpest rule is: "Delete implementations must not return an error when asked to delete a non-existent external resource." URL: https://github.com/crossplane/crossplane/blob/main/contributing/guide-provider-development.md. The dossier warns that the page lacks the Disconnect step and newer features of current crossplane-runtime, so exact method names need verification before quoting.

## Lesson

Because the loop is shared, every [concepts/provider](../concepts/provider.md) gets the same Synced and Ready semantics, the same finalizer behavior, and the same management policies, and the author owns only correctness of the external calls. The same idempotency rules apply as in any controller, see [concepts/idempotency](../concepts/idempotency.md) and [concepts/reconciliation-loop](../concepts/reconciliation-loop.md). The leak risk that follows from an interrupted create is covered by [findings/a-create-that-succeeds-while-the-status-write-fails-can-leak-an-external-resource](../findings/a-create-that-succeeds-while-the-status-write-fails-can-leak-an-external-resource.md).

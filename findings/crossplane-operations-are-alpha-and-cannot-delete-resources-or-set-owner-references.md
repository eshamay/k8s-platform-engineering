---
title: "Crossplane Operations are alpha and cannot delete resources or set owner references"
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-g3-crossplane-v2
    hash: 073a1fe74dec
    ingested: 2026-11-26
  - id: research-gap-b1-unverified-claims
    hash: d152f98abb04
    ingested: 2026-11-26
aliases: []
tags: [pitfall, crossplane, operations, alpha, maturity, v2]
---

# Crossplane Operations are alpha and cannot delete resources or set owner references

## Observation

Operations, the v2 mechanism for day-two work, are alpha in v2.5. Every Operations docs page carries `state: alpha` and `alphaVersion: 2.0`. They must be enabled with `--enable-operations`, the CRDs for Operation, CronOperation, and WatchOperation ship only `ops.crossplane.io/v1alpha1`, and `core.go` on `main` lists `EnableOperations` under "Alpha Features". The v2.5 feature-lifecycle page says "Alpha features are subject to removal or breaking changes without notice". They arrived in v2.0.0 (2025-08-14) and have changed incrementally since: alpha render subcommands in v2.1, `RequiredSchemas` in v2.2, and `status.appliedResources` in v2.5. The Day Two Operations design doc is Accepted. [sources/research-gap-g3-crossplane-v2](../sources/research-gap-g3-crossplane-v2.md) https://github.com/crossplane/docs/blob/master/content/v2.5/operations/operation.md

## How they differ from composition functions

Operations run function pipelines to completion, "like a Kubernetes Job", in three modes (Operation, CronOperation, WatchOperation). Composition functions create and maintain resources by reconciling observed XRs continuously and set owner references. Operation functions run once, take required resources as input, may output any resources, and apply with force and no owners ("Ownership: Force applies without owners"). The docs list "Delete resources (current limitation of alpha implementation)" among what an Operation cannot do. Operations also "force ownership when applying changes, which can cause conflicts" with other controllers.

## Why it matters

A runbook or tutorial that presents Operations as an ordinary stable feature overstates them: removal or breaking change is permitted, and an Operation cannot clean up what it created. The dossier searched for a tracking issue or schedule for beta graduation and found none. A later pass confirmed on main that `--enable-operations` is declared under "Alpha Features" in `cmd/crossplane/core/core.go`, and a search of issue titles for "operations beta" again found nothing, so no beta plan is known ([sources/research-gap-b1-unverified-claims](../sources/research-gap-b1-unverified-claims.md)).

## Mitigations

Label Operations alpha wherever they are described, avoid depending on them for production-critical cleanup, and plan for owner-less resources created by an Operation. See [findings/a-composition-function-that-omits-a-resource-from-its-desired-state-deletes-it](a-composition-function-that-omits-a-resource-from-its-desired-state-deletes-it.md), [concepts/composition](../concepts/composition.md), [entities/crossplane](../entities/crossplane.md), and [findings/immature-abstractions-in-the-control-plane-ecosystem](immature-abstractions-in-the-control-plane-ecosystem.md).

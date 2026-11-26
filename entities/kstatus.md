---
title: kstatus
type: entity
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-spec-status-split
    hash: 598e6132ea4f
    ingested: 2026-11-25
aliases: [cli-utils kstatus]
tags: [tool, status, readiness, cli-utils]
---

# kstatus

## What it is

kstatus is a Go package in `sigs.k8s.io/cli-utils` (Kubernetes SIGs) that computes a generic status for any Kubernetes resource that follows the status conventions. Its result values are InProgress, Current, Failed, Terminating, NotFound, and Unknown. The package describes itself as containing "functionality for computing the status of Kubernetes resources". [[sources/research-spec-status-split]] URL: https://pkg.go.dev/sigs.k8s.io/cli-utils/pkg/kstatus/status.

## How it reads status

It uses `observedGeneration`, the `Ready`, `Reconciling`, and `Stalled` conditions, and an abnormal-true idea. Flux and other tools use it to decide whether a dependency is ready without per-kind logic, which is why following the conventions matters. The dossier's summary of the package page was brief, so the exact combination rules are not recorded and are an open question.

## Limits

kstatus can report premature readiness for a resource that has `observedGeneration` but no conditions yet, and it cannot follow a provider that replaces `Ready` with `Available`, as Cluster API is doing. See [[findings/premature-readiness-in-kstatus-based-tools]] and [[comparisons/health-and-readiness-models-across-tools]].

## Related

[[concepts/conditions]], [[concepts/spec-status-split]], [[entities/flux]], [[entities/cluster-api]]

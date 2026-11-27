---
title: Publish Synced false at reconcile start or rely on observedGeneration
type: decision
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-spec-status-split
    hash: 598e6132ea4f
    ingested: 2026-11-25
aliases: []
tags: [ack, conditions, observedgeneration, stale-status]
---

# Publish Synced false at reconcile start or rely on observedGeneration

## Status

Open question framed by the sources, not an ADR authored by this wiki. ACK issue 1583 proposes one option and was open with a frozen label when the dossier fetched it. [sources/research-spec-status-split](../sources/research-spec-status-split.md)

## Context

ACK conditions have no `observedGeneration`, so consumers cannot tell a stale `ResourceSynced=True` from a current one. Argo CD maintainers described working around this by comparing managed-field timestamps, which they called fragile. URL: https://github.com/aws-controllers-k8s/community/issues/1583.

## Options

The controller can add `observedGeneration` to each condition, so consumers compare it with `metadata.generation`. Or the controller can publish `ResourceSynced=False` at the start of reconciling a new generation, so consumers "require both `ResourceSynced=True` and matching generation". The thread argues that conditions with `observedGeneration` remain compatible with Server-Side Apply, which answers the multi-writer concern maintainers raised.

## Consequences

Publishing `False` at the start costs an extra status write per reconcile and makes the condition flap during normal operation, which consumers must not read as failure (compare Flux's `Reconciling=True`, which is normal progress). Adding `observedGeneration` is the convention-aligned fix and does not flap. The dossier does not say which option ACK chose. See [findings/missing-observedgeneration-hides-stale-status](../findings/missing-observedgeneration-hides-stale-status.md) and [comparisons/observedgeneration-top-level-versus-per-condition](../comparisons/observedgeneration-top-level-versus-per-condition.md).

## Related

[entities/ack](../entities/ack.md), [concepts/conditions](../concepts/conditions.md), [concepts/spec-status-split](../concepts/spec-status-split.md)

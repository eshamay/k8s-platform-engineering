---
title: Missing observedGeneration hides stale status
type: finding
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-spec-status-split
    hash: 598e6132ea4f
    ingested: 2026-11-25
aliases: []
tags: [pitfall, observedgeneration, conditions, ack, argo-cd]
---

# Missing observedGeneration hides stale status

## Observation

If a controller does not record the generation it acted on, consumers cannot tell a fresh condition from a stale one. ACK issue 1583 is the clearest example: without `observedGeneration` on its conditions, a stale `ResourceSynced=True` looks the same as a current one. Argo CD maintainers described working around the gap by comparing managed-field timestamps, which they called fragile. The proposed mitigation is to publish `ResourceSynced=False` at the start of each reconcile so consumers can require both `ResourceSynced=True` and a matching generation. At fetch time the issue was open with a frozen label. [[sources/research-spec-status-split]] URL: https://github.com/aws-controllers-k8s/community/issues/1583.

## Why it matters

Flux exposes the comparison directly: if `observedGeneration` is below `metadata.generation`, a spec change is still pending. A controller that omits the field removes that check from every consumer. The thread also argues that conditions carrying `observedGeneration` remain compatible with Server-Side Apply, which answers a multi-writer objection raised by maintainers. A related OneUptime tutorial lists not setting `ObservedGeneration` among the common operator mistakes.

## Mitigations

Set `observedGeneration` on every condition and on the top level where tools expect it. Where a controller cannot, consumers fall back on timestamp heuristics. See [[decisions/publish-synced-false-at-reconcile-start]], [[comparisons/observedgeneration-top-level-versus-per-condition]], [[findings/misleading-readiness-and-stale-status]], and [[entities/ack]].

## Related

[[concepts/conditions]], [[concepts/spec-status-split]], [[concepts/server-side-apply-and-field-ownership]]

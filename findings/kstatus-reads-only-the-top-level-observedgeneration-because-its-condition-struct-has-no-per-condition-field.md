---
title: kstatus reads only the top-level observedGeneration because its condition struct has no per-condition field
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-m3-status-conditions
    hash: 07099fedb0c8
    ingested: 2026-11-26
aliases: [kstatus ignores per-condition observedGeneration]
tags: [kstatus, observedgeneration, conditions, consumers, verified]
---

# kstatus reads only the top-level observedGeneration because its condition struct has no per-condition field

## Observation

The condition struct that kstatus parses, `BasicCondition`, carries only a type, a status, a reason, and a message. It has no `observedGeneration`, so a per-condition value written under the Kubernetes API conventions and `metav1.Condition` is never consulted by kstatus. The only generation comparison kstatus performs is between `metadata.generation` and the top-level `status.observedGeneration`. [sources/research-gap-m3-status-conditions](../sources/research-gap-m3-status-conditions.md) URL: https://github.com/kubernetes-sigs/cli-utils/blob/master/pkg/kstatus/status/util.go

Other consumers behave the same way. Argo CD's health documentation tells authors of CRD health checks to use `status.observedGeneration`, and its Config Connector script gates on that field. See [examples/argo-cd-s-config-connector-health-script-maps-uptodate-to-healthy-updatefailed-to-degraded-and-gates-on-observedgeneration](../examples/argo-cd-s-config-connector-health-script-maps-uptodate-to-healthy-updatefailed-to-degraded-and-gates-on-observedgeneration.md).

## Why it matters

A controller that follows the conventions and writes only per-condition values gives kstatus and Argo CD nothing to compare, so the generation check is skipped. See [findings/a-kstatus-resource-whose-controller-never-writes-status-observedgeneration-skips-the-generation-check-and-can-read-current-early](a-kstatus-resource-whose-controller-never-writes-status-observedgeneration-skips-the-generation-check-and-can-read-current-early.md). Conversely, a controller that writes only the top-level field gives up the per-condition precision that the conventions describe, where each condition can be stale independently. Flux writes both for this reason. See [examples/flux-stamps-the-current-generation-on-every-condition-and-also-keeps-a-top-level-observedgeneration](../examples/flux-stamps-the-current-generation-on-every-condition-and-also-keeps-a-top-level-observedgeneration.md).

## Mitigations

Publish both placements when generic consumers matter, which is the practice recorded in [decisions/place-observedgeneration-at-the-top-level-on-each-condition-or-both](../decisions/place-observedgeneration-at-the-top-level-on-each-condition-or-both.md). See also [comparisons/observedgeneration-top-level-versus-per-condition](../comparisons/observedgeneration-top-level-versus-per-condition.md) and [entities/kstatus](../entities/kstatus.md).

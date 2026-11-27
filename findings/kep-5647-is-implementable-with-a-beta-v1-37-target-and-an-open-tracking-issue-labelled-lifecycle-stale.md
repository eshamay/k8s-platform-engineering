---
title: "KEP 5647 is implementable with a beta v1.37 target and an open tracking issue labelled lifecycle/stale"
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-o9-cadence-and-staleness
    hash: eb353fed45cd
    ingested: 2026-11-26
aliases: [KEP 5647 status, Stale Controller Mitigation]
tags: [kubernetes, kep-5647, staleness, enhancements, status, v1-37]
---

# KEP 5647 is implementable with a beta v1.37 target and an open tracking issue labelled lifecycle/stale

## Observation

The `kep.yaml` for KEP 5647 (blob sha b0ba8b0c, last committed 2026-05-27) reads `status: implementable`, `stage: beta`, `latest-milestone: "v1.37"` and `milestone: beta: "v1.37"`, and it lists four gates: `StaleControllerConsistency`, `MonitorInformerStaleness`, `AtomicFIFO` and `UnlockWhileProcessingFIFO`. [sources/research-gap-o9-cadence-and-staleness](../sources/research-gap-o9-cadence-and-staleness.md) https://github.com/kubernetes/enhancements/blob/master/keps/sig-api-machinery/5647-stale-controller-handling/kep.yaml

The tracking issue kubernetes/enhancements#5647, titled "Stale Controller Mitigation", is open when read on 2026-11-26 (last updated 2026-11-16). It is labelled sig/api-machinery, stage/beta and lifecycle/stale, and it has no milestone set. https://github.com/kubernetes/enhancements/issues/5647

## What the README does and does not say

The README says of `MonitorInformerStaleness`: "Components depending on the feature gate: None, but requires a direct get to the apiserver to determine staleness every 5 seconds." Its metrics section says "We are planning on adding staleness metrics which can help inform on", so the KEP names no metric, and the metric names come from source, see [findings/the-kubernetes-v1-36-staleness-blog-names-metrics-differently-from-the-changelog-and-source](the-kubernetes-v1-36-staleness-blog-names-metrics-differently-from-the-changelog-and-source.md).

## Reading it

The dossier records the `lifecycle/stale` label as a fact about the tracking issue and draws no conclusion from it about the code, because the controller gates shipped as Beta in 1.36. The code shows per-controller gates at Beta from 1.36 and 1.37 ([findings/kubernetes-v1-37-0-already-carries-the-horizontal-pod-autoscaler-staleness-gate-and-every-per-controller-gate-depends-on-atomicfifo](kubernetes-v1-37-0-already-carries-the-horizontal-pod-autoscaler-staleness-gate-and-every-per-controller-gate-depends-on-atomicfifo.md)), while the KEP file still says beta lands in v1.37, so the KEP file lags the code. Cite the KEP for design intent only.

## Related

[findings/monitorinformerstaleness-and-the-handler-bookmarkfunc-are-absent-from-kubernetes-v1-36-0-v1-37-0-and-master-source](monitorinformerstaleness-and-the-handler-bookmarkfunc-are-absent-from-kubernetes-v1-36-0-v1-37-0-and-master-source.md), [findings/kep-5647-lists-a-different-gate-shape-from-the-shipped-code-and-monitorinformerstaleness-is-not-found-in-kubernetes-source](kep-5647-lists-a-different-gate-shape-from-the-shipped-code-and-monitorinformerstaleness-is-not-found-in-kubernetes-source.md), [findings/stale-cache-and-double-action](stale-cache-and-double-action.md)

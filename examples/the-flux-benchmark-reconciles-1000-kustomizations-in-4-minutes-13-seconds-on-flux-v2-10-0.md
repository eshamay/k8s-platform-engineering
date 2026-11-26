---
title: The Flux benchmark reconciles 1000 Kustomizations in 4 minutes 13 seconds on Flux v2.10.0
type: example
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-g1-named-adopters
    hash: 9f6a50098233
    ingested: 2026-11-26
aliases: [flux-benchmark RESULTS]
tags: [flux, benchmark, kustomize-controller, scale, project-run]
---

# The Flux benchmark reconciles 1000 Kustomizations in 4 minutes 13 seconds on Flux v2.10.0

## Scenario

The fluxcd/flux-benchmark repository publishes results per Flux release. The v2.10.0 section gives a scale reference for a single unsharded controller. [[sources/research-gap-g1-named-adopters]] URL: https://github.com/fluxcd/flux-benchmark/blob/main/RESULTS.md.

## The numbers

With a kustomize-controller of 2 CPU and 1Gi at concurrency 20, on a 3-node Kind cluster in a GitHub runner, 1000 Kustomizations reconcile in 4m13s and use 297Mi at most. The table row reads "1000 | Kustomization | kustomize-controller | 4m13s | 297Mi". The Flux v2.9.0 table also shows 4m13s at 1000 objects but with 223Mi, so the elapsed time did not change between the two releases while memory did.

## How to read it

This is a project-run benchmark and not a production report, and the environment is a single small Kind cluster. A maintainer cited about three minutes per thousand Kustomizations in a user thread, which is in the same range. The Flux sharding page advises sharding only at "tens of thousands of applications". See [[examples/an-unnamed-user-with-300-namespaces-saw-5-minute-delays-and-a-flux-maintainer-cited-1k-kustomizations-in-about-3-minutes]].

## Related

[[comparisons/flux-scaling-options-intervals-concurrency-sharding-and-source-choice]], [[entities/flux]], [[concepts/scale-and-sharding]]

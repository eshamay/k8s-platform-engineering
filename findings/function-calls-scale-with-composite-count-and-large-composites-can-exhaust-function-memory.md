---
title: Function calls scale with composite count and large composites can exhaust function memory
type: finding
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-composition
    hash: f57d89652816
    ingested: 2026-11-25
aliases: []
tags: [pitfall, crossplane, composition-functions, scale]
---

# Function calls scale with composite count and large composites can exhaust function memory

## The load arithmetic

Composites are polled every 60 seconds by default and each function step is a gRPC call, so 100 XRs with one function step produce 100 calls per minute. The design doc lists the scaling levers as the poll interval, function replicas, and response caching by TTL. [[sources/research-composition]] The design doc is at https://github.com/crossplane/crossplane/blob/main/design/design-doc-composition-functions.md.

## Memory

A third-party article argues that functions run as OCI containers that receive the full resource context, so large composites, large EnvironmentConfigs, or heavy logic can exceed memory limits and produce OOMKilled pods and failed XR updates. It proposes realistic requests and limits, trimming data handling, monitoring, retries, and splitting logic across pipeline steps. Its log excerpts are labelled "Simulated," so this is plausible guidance and not an incident report (https://www.devopsroles.com/crossplane-composition-function-oomkilled/). That is why this page stays at draft.

## Design trade-off

Imagine Learning chose one monolithic function to reduce idle pods, which trades isolation for fewer processes, see [[examples/imagine-learning-replaces-thousand-line-patch-and-transform-files-with-a-looping-composition-function]]. The same load question for a Crossplane pipeline versus kro's dynamic controllers is still open in [[open-knowledge-gaps]].

## Related

[[findings/composition-functions-add-moving-parts-that-must-be-healthy]], [[concepts/composition]], [[entities/crossplane]], [[comparisons/load-and-fairness-controls-across-controller-runtime-flux-argo-cd-and-kro]], [[examples/crossplane-max-reconcile-rate-turns-reconcile-rate-into-an-api-call-budget]]

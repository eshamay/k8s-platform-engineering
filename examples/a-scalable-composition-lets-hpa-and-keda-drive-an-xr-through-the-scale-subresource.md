---
title: A scalable composition lets HPA and KEDA drive an XR through the scale subresource
type: example
status: active
created: 2026-11-25
updated: 2026-11-26
sources:
  - id: research-gap-b1-recheck-kro-crossplane
    hash: ccee0efa5bdd
    ingested: 2026-11-26
  - id: research-composition
    hash: f57d89652816
    ingested: 2026-11-25
aliases: []
tags: [use-case, crossplane, composition, autoscaling]
---

# A scalable composition lets HPA and KEDA drive an XR through the scale subresource

## Scenario

The Crossplane Scalable Composition guide builds a `MyApp` composite resource that wraps a Deployment. The XRD exposes the Kubernetes `scale` subresource, so `kubectl scale`, the Horizontal Pod Autoscaler, and KEDA can scale the XR without knowing its schema. [sources/research-composition](../sources/research-composition.md)

## How it works

The composition combines function-patch-and-transform with function-auto-ready. The author must wire the scaling by patching the XR's `spec.replicas` down into the Deployment and writing the observed replica count back up to the XR's status. The guide states "The composition author must implement the scaling logic." The guide is at https://docs.crossplane.io/latest/guides/scalable-composition/.

## Why it matters

A composite resource can behave like a first-class Kubernetes workload API, which is the same pattern that [examples/hpa-scales-any-workload-through-the-scale-subresource](hpa-scales-any-workload-through-the-scale-subresource.md) shows for built-in and custom workloads. The guide is about scaling the composed workload, not about scaling Crossplane itself, which is covered in [findings/function-calls-scale-with-composite-count-and-large-composites-can-exhaust-function-memory](../findings/function-calls-scale-with-composite-count-and-large-composites-can-exhaust-function-memory.md).

## Related

[concepts/composition](../concepts/composition.md), [concepts/composite-resource](../concepts/composite-resource.md), [entities/crossplane](../entities/crossplane.md)

## Scope note (2026-11-26)

The v2.5 Scalable Composition guide, added to the docs in 2026-04, is about exposing the Kubernetes `scale` subresource on an XR. It gives no controller capacity numbers, so it does not answer how many XRs one Crossplane control plane can serve. [sources/research-gap-b1-recheck-kro-crossplane](../sources/research-gap-b1-recheck-kro-crossplane.md)

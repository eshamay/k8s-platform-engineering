---
title: A scalable composition lets HPA and KEDA drive an XR through the scale subresource
type: example
status: active
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-composition
    hash: f57d89652816
    ingested: 2026-11-25
aliases: []
tags: [use-case, crossplane, composition, autoscaling]
---

# A scalable composition lets HPA and KEDA drive an XR through the scale subresource

## Scenario

The Crossplane Scalable Composition guide builds a `MyApp` composite resource that wraps a Deployment. The XRD exposes the Kubernetes `scale` subresource, so `kubectl scale`, the Horizontal Pod Autoscaler, and KEDA can scale the XR without knowing its schema. [[sources/research-composition]]

## How it works

The composition combines function-patch-and-transform with function-auto-ready. The author must wire the scaling by patching the XR's `spec.replicas` down into the Deployment and writing the observed replica count back up to the XR's status. The guide states "The composition author must implement the scaling logic." The guide is at https://docs.crossplane.io/latest/guides/scalable-composition/.

## Why it matters

A composite resource can behave like a first-class Kubernetes workload API, which is the same pattern that [[examples/hpa-scales-any-workload-through-the-scale-subresource]] shows for built-in and custom workloads. The guide is about scaling the composed workload, not about scaling Crossplane itself, which is covered in [[findings/function-calls-scale-with-composite-count-and-large-composites-can-exhaust-function-memory]].

## Related

[[concepts/composition]], [[concepts/composite-resource]], [[entities/crossplane]]

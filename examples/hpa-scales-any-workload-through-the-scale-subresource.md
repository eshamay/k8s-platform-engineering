---
title: The HPA scales any workload through the Scale subresource
type: example
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-gvk-and-gvr
    hash: 5c56bb1e05a8
    ingested: 2026-11-25
aliases: []
tags: [gvk, gvr, subresource, hpa]
---

# The HPA scales any workload through the Scale subresource

## Scenario

A HorizontalPodAutoscaler needs to change the replica count of Deployments, ReplicaSets, and other scalable workloads without knowing each one's schema. [sources/research-gvk-and-gvr](../sources/research-gvk-and-gvr.md)

## How it works

Many resources expose a subresource that returns the same `Scale` Kind, for example `deployments/scale` and `replicasets/scale`. The autoscaler reads and writes that one Kind, so it works uniformly across workload types. This is the standard exception to the usual one-to-one relationship between a Kind and a resource: one Kind (a single GVK) is served at many resource endpoints (many GVRs). A CRD, by contrast, gives each Kind exactly one resource. URL: https://book.kubebuilder.io/cronjob-tutorial/gvks.html.

## Lesson

The Kind describes the shape of the payload, and the resource describes where the payload lives. Treating the two as interchangeable would make the Scale pattern impossible to explain. See [concepts/gvk-and-gvr](../concepts/gvk-and-gvr.md) and [comparisons/gvk-versus-gvr](../comparisons/gvk-versus-gvr.md).

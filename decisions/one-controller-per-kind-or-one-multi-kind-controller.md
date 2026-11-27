---
title: One controller per Kind or one multi-Kind controller
type: decision
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-operator-pattern
    hash: eab72eca2e1b
    ingested: 2026-11-25
aliases: []
tags: [decision, controllers, design, single-responsibility]
---

# One controller per Kind or one multi-Kind controller

## Status

Draft. This records a decision point described in documentation, not a choice made by this wiki.

## Context

An operator that manages several related Kinds can implement them in one controller or give each Kind its own. The choice affects encapsulation, debugging, and scale. [sources/research-operator-pattern](../sources/research-operator-pattern.md)

## Options

A single multi-Kind controller keeps related logic in one place. A controller per Kind keeps each reconcile loop small and independently testable and tunable.

## Decision guidance

Kubebuilder recommends one controller per Kind and says multi-Kind controllers break encapsulation and scale poorly. The Kubernetes controller documentation and the Google Cloud blog also prefer several small controllers, and the CNCF white paper advises one operator per application type. Flux, ACK, and Cluster API are shown following the split. URL: https://book.kubebuilder.io/reference/good-practices.

## Consequences

Per-Kind controllers need a convention for coordinating shared state, usually through status and owner references. See [findings/multi-kind-controllers-break-encapsulation-and-scale-poorly](../findings/multi-kind-controllers-break-encapsulation-and-scale-poorly.md) and [comparisons/how-flux-ack-and-cluster-api-split-controllers](../comparisons/how-flux-ack-and-cluster-api-split-controllers.md).

## Related

[concepts/operator-pattern](../concepts/operator-pattern.md), [concepts/owner-references-and-garbage-collection](../concepts/owner-references-and-garbage-collection.md)

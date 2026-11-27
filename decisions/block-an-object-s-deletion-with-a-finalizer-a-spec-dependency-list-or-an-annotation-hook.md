---
title: "Block an object's deletion with a finalizer, a spec dependency list, or an annotation hook"
type: decision
status: draft
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-m1-finalizers
    hash: 014549e333b6
    ingested: 2026-11-26
aliases: []
tags: [decision, finalizers, cluster-api, hooks, deletion]
---

# Block an object's deletion with a finalizer, a spec dependency list, or an annotation hook

## Status

Open for any new platform. Cluster API decided its own case in 2020, and this page records the options with the evidence and makes no recommendation. [sources/research-gap-m1-finalizers](../sources/research-gap-m1-finalizers.md)

## Context

An external controller needs to hold an object's deletion until it has finished its own work. In Cluster API, issue 1514 asked for this on Machines. The thread weighed several mechanisms before it was closed in favor of a CAEP. See [examples/cluster-api-issue-1514-was-closed-in-april-2020-in-favor-of-a-proposal-that-chose-annotation-hooks](../examples/cluster-api-issue-1514-was-closed-in-april-2020-in-favor-of-a-proposal-that-chose-annotation-hooks.md).

## Options

- **A finalizer with a known name.** The original proposal. The author argued that a finalizer working before drain covers most needs. Finalizers are the standard Kubernetes gate, and the API server refuses new ones once deletion has started. The implemented proposal lists a drawback: "A misbehaving controller that accidentally removes finalizers could have undesirable effects."
- **A `Dependencies` list of object references in the spec.** Suggested by a maintainer instead of adding more finalizers to the Machine. The thread does not record a design for it beyond the suggestion.
- **A hook-registration CRD.** Suggested by another maintainer. No further detail is recorded.
- **Annotation hooks named by the registering controller.** Proposed from 2020-04-17 and implemented. Each controller adds its own annotation under a documented prefix, one of which pauses removal of the instance from the infrastructure provider. One argument in the thread was that status or CR-based hooks would require write permission on the Machine anyway.

## Evidence

Cluster API implemented the annotation option, with the prefixes `pre-drain.delete.hook.machine.cluster.x-k8s.io` and `pre-terminate.delete.hook.machine.cluster.x-k8s.io`, and the control plane provider uses a pre-terminate hook of its own. The evidence for the other options is the thread's discussion only, and no implementation was read. The Cluster API book page on the hooks could not be read. See [findings/cluster-api-chose-annotation-hooks-over-finalizers-for-machine-deletion-because-a-misbehaving-controller-could-remove-finalizers](../findings/cluster-api-chose-annotation-hooks-over-finalizers-for-machine-deletion-because-a-misbehaving-controller-could-remove-finalizers.md). [sources/research-gap-m1-finalizers](../sources/research-gap-m1-finalizers.md)

## Related

[concepts/finalizers](../concepts/finalizers.md), [entities/cluster-api](../entities/cluster-api.md), [decisions/remove-a-stuck-finalizer-by-force-or-repair-the-owning-controller](remove-a-stuck-finalizer-by-force-or-repair-the-owning-controller.md)

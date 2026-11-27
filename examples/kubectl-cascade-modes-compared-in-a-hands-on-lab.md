---
title: "kubectl cascade modes compared in a hands-on lab"
type: example
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-owner-references-and-garbage-collection
    hash: bd4cc1219f2d
    ingested: 2026-11-25
aliases: []
tags: [kubectl, cascade, propagation-policy, tutorial, finalizers]
---

# kubectl cascade modes compared in a hands-on lab

## Scenario

A learner wants to see the three deletion modes on a live cluster instead of reading about them. The KKloud Tarus "Kubernetes From Scratch" part 30 lab, published on 24 May 2026, walks through the experiment step by step. [sources/research-owner-references-and-garbage-collection](../sources/research-owner-references-and-garbage-collection.md)

## How it works

The lab first inspects a Pod's `ownerReferences`, showing `controller=true` and `blockOwnerDeletion=true`. It then deletes a ReplicaSet three ways. In background mode the ReplicaSet vanishes first and its Pods go Terminating afterward. With `--cascade=orphan` the Pods keep running and their `ownerReferences` becomes empty, so they must be deleted by hand. With foreground the parent is held with a `foregroundDeletion` finalizer until the children are gone. The lab ends with a ConfigMap that carries an invented finalizer, which stays in Terminating until the finalizer is patched away, and it names built-in finalizers such as `kubernetes.io/pv-protection`.

## Why the example matters

The lab produces all three outcomes with one flag, which makes it the quickest reproducible demo for a tutorial. The dossier recommends it as ramp-up reading. See [comparisons/background-foreground-and-orphan-propagation-modes](../comparisons/background-foreground-and-orphan-propagation-modes.md) for the side-by-side summary and [findings/orphaned-dependents-keep-running-with-empty-owner-references-until-someone-deletes-them](../findings/orphaned-dependents-keep-running-with-empty-owner-references-until-someone-deletes-them.md) for the hazard of the orphan result.

## Related

[concepts/owner-references-and-garbage-collection](../concepts/owner-references-and-garbage-collection.md), [concepts/finalizers](../concepts/finalizers.md), [examples/diagnosing-a-pod-stuck-terminating-from-finalizer-to-force-delete](diagnosing-a-pod-stuck-terminating-from-finalizer-to-force-delete.md), [entities/kubectl](../entities/kubectl.md)

---
title: A ConfigMap with a finalizer no controller handles stays in deletion until kubectl patch removes the finalizer list
type: example
status: draft
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: kubernetes-finalizers-blog
    hash: 31da0061e2fb
    ingested: 2026-11-26
aliases: []
tags: [finalizers, deletion, configmap, kubectl-patch, owner-references, kubernetes-blog]
---

# A ConfigMap with a finalizer no controller handles stays in deletion until kubectl patch removes the finalizer list

> [!NOTE]
> **Source:** the official Kubernetes blog post "Using Finalizers to Control Deletion" by Aaron Alpar of Kasten, 2021-05-14, https://kubernetes.io/blog/2021/05/14/using-finalizers-to-control-deletion/. The walkthrough is the author's demonstration on a test cluster, written in 2021.

## Scenario

The author creates an empty ConfigMap named `mymap` whose `metadata.finalizers` holds the single key `kubernetes`. No controller acts on that key for a ConfigMap, because it is normally used on namespaces, so the author calls it a dead finalizer. He runs `kubectl delete configmap/mymap` in the background. [sources/kubernetes-finalizers-blog](../sources/kubernetes-finalizers-blog.md)

## What happens

Kubernetes reports `configmap "mymap" deleted`, yet the shell job keeps running. A `kubectl get` with `-o yaml` shows the same object with a `deletionTimestamp` and `deletionGracePeriodSeconds: 0` added and the finalizer still present. The author explains that the object was updated and not removed, because the API server saw a finalizer and kept the object in etcd. [sources/kubernetes-finalizers-blog](../sources/kubernetes-finalizers-blog.md)

The author then removes the finalizers with a JSON patch whose operation is `remove` at the path `/metadata/finalizers`. The patch succeeds, the waiting delete finishes, and the next `get` returns NotFound. This is the same two-phase delete described in [concepts/finalizers](../concepts/finalizers.md), with a person standing in for the controller that would normally clear the key. [sources/kubernetes-finalizers-blog](../sources/kubernetes-finalizers-blog.md)

## Same lesson with owner references

The post repeats the experiment with a parent and child ConfigMap linked by an owner reference. Deleting the child leaves the parent, and deleting the parent removes the child by cascade, while `--cascade=orphan` removes only the parent. It adds that finalizers are still honored during a cascade, so a tree can be left partly deleted. See [concepts/owner-references-and-garbage-collection](../concepts/owner-references-and-garbage-collection.md) and [comparisons/background-foreground-and-orphan-propagation-modes](../comparisons/background-foreground-and-orphan-propagation-modes.md). [sources/kubernetes-finalizers-blog](../sources/kubernetes-finalizers-blog.md)

## Why the example matters

It is the smallest reproducible demonstration of a stuck delete that needs no cloud and no operator. It also shows the risk the author names: removing a finalizer by hand skips whatever cleanup it stood for, so he says to investigate first. For the cost of that choice see [decisions/remove-a-stuck-finalizer-by-force-or-repair-the-owning-controller](../decisions/remove-a-stuck-finalizer-by-force-or-repair-the-owning-controller.md) and [findings/forcing-a-finalizer-off-skips-cleanup-and-can-leak-billing-resources-or-corrupt-data](../findings/forcing-a-finalizer-off-skips-cleanup-and-can-leak-billing-resources-or-corrupt-data.md).

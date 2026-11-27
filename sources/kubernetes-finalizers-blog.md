---
title: "Kubernetes blog: Using Finalizers to Control Deletion (Aaron Alpar, Kasten, 2021)"
type: source
status: draft
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: kubernetes-finalizers-blog
    hash: 31da0061e2fb
    ingested: 2026-11-26
aliases: []
tags: [finalizers, deletion, owner-references, propagation-policy, kubernetes-blog, namespace-finalize, targeted-pass]
---

# Kubernetes blog: Using Finalizers to Control Deletion (Aaron Alpar, Kasten, 2021)

> [!NOTE]
> **Raw file:** `raw/kubernetes-finalizers-blog` (sha256 prefix 31da0061e2fb)<br>
> **URL:** https://kubernetes.io/blog/2021/05/14/using-finalizers-to-control-deletion/<br>
> **Author and date:** Aaron Alpar of Kasten, 2021-05-14<br>
> **Kind:** Post on the official Kubernetes blog, written by a vendor engineer from a working-lab perspective. It is a 2021 post with one dated update about kubectl v1.20, and it is not the current reference documentation.<br>
> **Ingested:** 2026-11-26 as a targeted pass over the finalizer, owner-reference, and propagation-mode pages

## Summary

The post explains why an object can seem deleted and still persist. Every example is a ConfigMap and a few kubectl commands. It first shows a plain delete, then shows that an object carrying a finalizer is not removed from etcd but gets a `deletionTimestamp` and stays until the finalizer list is empty. It then shows owner references and cascading deletion, the three propagation policies, and the last-resort way to force a namespace out of finalization.

The wiki had cited this post only through summaries that were not checked against the full text. Two source pages describe it with details the full text does not support, for example a Job example and kubectl selecting a propagation mode. Corrections are recorded on [sources/research-finalizers](research-finalizers.md) and [sources/research-owner-references-and-garbage-collection](research-owner-references-and-garbage-collection.md).

## Key claims

- Finalizers are keys on a resource that signal pre-delete operations and tell controllers which cleanup to perform. The post says they "don't necessarily name code that should be executed" and are basically lists of keys much like annotations, which can be manipulated.
- Common built-in finalizers named are `kubernetes.io/pv-protection` and `kubernetes.io/pvc-protection`, which stop accidental deletion of volumes. Some finalizers can also block deletion of any resource while no controller manages them.
- In the post's demonstration, a ConfigMap with the finalizer `kubernetes`, normally used on namespaces, has no controller to act on it. The author calls these "dead" finalizers. A delete reports the object as deleted, but it is only updated with a `deletionTimestamp` and stays.
- The object stays until a controller removes the finalizer keys or a user removes them, and once the list is empty the object is reclaimed and queued for deletion from the registry. The post shows `kubectl patch` with a JSON patch that removes `/metadata/finalizers`, after which the waiting delete completes.
- An owner reference consists of a name and a UID and links resources in the same namespace. Deleting a parent deletes children that point to it by cascade, and deleting a child leaves the parent. Pods typically have an owner reference to their ReplicaSet.
- The post says the cascade default was true, and adds an update that from kubectl v1.20 the default is background. `--cascade=orphan` deletes the parent and leaves the child.
- The post says the `--cascade` option links to the API propagation policy, and also says the propagation policy "cannot be specified on the command line using kubectl", so it shows a custom API call through `kubectl proxy` and `curl` with `propagationPolicy` set to Background.
- The three policies are described as Foreground, children deleted before the parent (post-order), Background, parent deleted before the children (pre-order), and Orphan, owner references ignored.
- Finalizers are honored during cascading deletion, so trees of objects can persist and leave a partial deletion. The author says to look at owner references and finalizers to understand it.
- A namespace that remains after its objects are cleaned out can be forced by updating the namespace `finalize` subresource with `spec.finalizers` set to null. The post warns this may delete the namespace only and leave orphan objects in a namespace that no longer exists, and says re-creating the namespace manually can make orphaned objects reappear so they can be cleaned up.
- The takeaway is to investigate before removing a finalizer by hand, because there is often a reason it was added.

## Entities and concepts

- Concepts: [concepts/finalizers](../concepts/finalizers.md), [concepts/owner-references-and-garbage-collection](../concepts/owner-references-and-garbage-collection.md).
- Entities: [entities/kubectl](../entities/kubectl.md).

## Limits

The post is from 2021 and its code examples use `selfLink`, which later Kubernetes versions removed, and its statement that kubectl cannot set the propagation policy is dated, see [findings/the-2021-kubernetes-finalizers-blog-says-kubectl-cannot-set-the-propagation-policy-while-its-own-example-uses-cascade-orphan](../findings/the-2021-kubernetes-finalizers-blog-says-kubectl-cannot-set-the-propagation-policy-while-its-own-example-uses-cascade-orphan.md). The saved text drops the two state diagrams. It names no controller and covers no platform tool, so it says nothing about how Crossplane, ACK, Config Connector, or kro name or remove their finalizers. The orphan-object warning is an observation by the author with no measured frequency.

## Pages touched

[concepts/finalizers](../concepts/finalizers.md), [concepts/owner-references-and-garbage-collection](../concepts/owner-references-and-garbage-collection.md), [comparisons/background-foreground-and-orphan-propagation-modes](../comparisons/background-foreground-and-orphan-propagation-modes.md), [decisions/remove-a-stuck-finalizer-by-force-or-repair-the-owning-controller](../decisions/remove-a-stuck-finalizer-by-force-or-repair-the-owning-controller.md), [examples/stuck-terminating-namespace-fixed-through-the-finalize-subresource](../examples/stuck-terminating-namespace-fixed-through-the-finalize-subresource.md), [findings/forcing-a-finalizer-off-skips-cleanup-and-can-leak-billing-resources-or-corrupt-data](../findings/forcing-a-finalizer-off-skips-cleanup-and-can-leak-billing-resources-or-corrupt-data.md), [sources/research-finalizers](research-finalizers.md), [sources/research-owner-references-and-garbage-collection](research-owner-references-and-garbage-collection.md), and the new [examples/a-configmap-with-a-finalizer-no-controller-handles-stays-in-deletion-until-kubectl-patch-removes-the-finalizer-list](../examples/a-configmap-with-a-finalizer-no-controller-handles-stays-in-deletion-until-kubectl-patch-removes-the-finalizer-list.md), [findings/the-2021-kubernetes-finalizers-blog-says-kubectl-cannot-set-the-propagation-policy-while-its-own-example-uses-cascade-orphan](../findings/the-2021-kubernetes-finalizers-blog-says-kubectl-cannot-set-the-propagation-policy-while-its-own-example-uses-cascade-orphan.md), and [findings/forcing-namespace-finalization-can-leave-orphan-objects-in-a-namespace-that-no-longer-exists-and-recreating-the-namespace-may-bring-them-back](../findings/forcing-namespace-finalization-can-leave-orphan-objects-in-a-namespace-that-no-longer-exists-and-recreating-the-namespace-may-bring-them-back.md).

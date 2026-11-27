---
title: "A stuck Terminating namespace is fixed through the finalize subresource"
type: example
status: draft
created: 2026-11-25
updated: 2026-11-26
sources:
  - id: kubernetes-finalizers-blog
    hash: 31da0061e2fb
    ingested: 2026-11-26
  - id: research-finalizers
    hash: ca11dffc241b
    ingested: 2026-11-25
  - id: research-pitfalls-and-case-studies
    hash: 9407913c2448
    ingested: 2026-11-25
aliases: []
tags: [finalizers, namespaces, troubleshooting, openshift]
---

# A stuck Terminating namespace is fixed through the finalize subresource

## Scenario

An administrator deletes a namespace and it never leaves the Terminating state. Red Hat's troubleshooting guide walks through the diagnosis and the last-resort fix. [[sources/research-finalizers]]

## How it works

The diagnosis starts by reading `spec.finalizers` on the namespace and the status conditions, such as `SomeFinalizersRemain`. If the cause cannot be fixed at its source, the last-resort procedure is to dump the namespace JSON, delete the `kubernetes` entry from `spec.finalizers`, and send the result to the `/finalize` subresource, through `kubectl proxy` or `oc proxy`. The guide notes that editing in a web UI does not work, because the change must go through the subresource. It also says that forced removal bypasses protective cleanup.

## Why the example matters

The namespace finalizer is a field in `spec` and has its own subresource, which makes it different from the metadata finalizers on most objects. The case shows both the escape hatch and its cost. See [[decisions/remove-a-stuck-finalizer-by-force-or-repair-the-owning-controller]] and [[findings/forcing-a-finalizer-off-skips-cleanup-and-can-leak-billing-resources-or-corrupt-data]].

## Related

[[concepts/finalizers]], [[examples/diagnosing-a-pod-stuck-terminating-from-finalizer-to-force-delete]], [[findings/finalizers-strand-objects-in-terminating-when-the-controller-is-missing-or-failing]]

## Addition from the pitfalls dossier

The pitfalls dossier summarizes this same Red Hat guide. The namespace status condition `NamespaceFinalizersRemaining` names the culprit, here a custom resource finalizer (`tackles.tackle.io/finalizer`) whose controller was not removing it. The author's CI created and deleted namespaces, and operator finalizers left them Terminating. The dossier also notes that the guide treats force removal as the fix without warning that it can orphan guarded resources. See [[findings/forcing-a-finalizer-off-skips-cleanup-and-can-leak-billing-resources-or-corrupt-data]] and [[sources/research-pitfalls-and-case-studies]].

## The Kubernetes blog's caution and recovery step

The official Kubernetes blog post of 2021 describes the same last-resort update to the namespace `finalize` subresource and warns that it may delete the namespace only and leave orphan objects in a namespace that no longer exists. It says re-creating the namespace manually can sometimes make the orphans reappear so they can be cleaned up. See [[findings/forcing-namespace-finalization-can-leave-orphan-objects-in-a-namespace-that-no-longer-exists-and-recreating-the-namespace-may-bring-them-back]]. [[sources/kubernetes-finalizers-blog]]

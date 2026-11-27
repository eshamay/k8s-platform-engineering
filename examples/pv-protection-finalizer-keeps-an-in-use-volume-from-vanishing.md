---
title: "The PV protection finalizer keeps an in-use volume from vanishing"
type: example
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-finalizers
    hash: ca11dffc241b
    ingested: 2026-11-25
aliases: []
tags: [finalizers, storage, kubernetes-core]
---

# The PV protection finalizer keeps an in-use volume from vanishing

## Scenario

A PersistentVolume is bound to a claim that a running pod uses. Someone runs a delete against the volume. Without a guard, the API object would disappear while the pod still reads and writes the underlying disk. Kubernetes itself ships a finalizer for this case, `kubernetes.io/pv-protection`, and the Kubernetes finalizers page uses it as the standard worked example. [sources/research-finalizers](../sources/research-finalizers.md)

## How it works

The delete request does not remove the object. The API server sets `metadata.deletionTimestamp`, returns HTTP 202, and leaves the volume visible in a Terminating state while the finalizer is still listed. A controller watches for the timestamp, confirms that no pod is using the volume any more, and then removes its own entry from `metadata.finalizers`. When the list is empty the API server deletes the object. The finalizer therefore turns a one-step delete into a mark followed by a removal. See [concepts/finalizers](../concepts/finalizers.md) for the general sequence.

## Why the example matters

This is the simplest case of a finalizer that protects a thing outside the object. The object is only a record, and the real asset is the disk that the pod is using. Martin Heinz warns that force-deleting a PersistentVolume can leave cloud disks that keep billing, which shows what the protection prevents. See [findings/forcing-a-finalizer-off-skips-cleanup-and-can-leak-billing-resources-or-corrupt-data](../findings/forcing-a-finalizer-off-skips-cleanup-and-can-leak-billing-resources-or-corrupt-data.md).

## Related

[concepts/finalizers](../concepts/finalizers.md), [concepts/owner-references-and-garbage-collection](../concepts/owner-references-and-garbage-collection.md), [examples/diagnosing-a-pod-stuck-terminating-from-finalizer-to-force-delete](diagnosing-a-pod-stuck-terminating-from-finalizer-to-force-delete.md)

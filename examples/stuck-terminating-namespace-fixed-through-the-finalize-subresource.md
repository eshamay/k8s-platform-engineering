---
title: "A stuck Terminating namespace is fixed through the finalize subresource"
type: example
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-finalizers
    hash: ca11dffc241b
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

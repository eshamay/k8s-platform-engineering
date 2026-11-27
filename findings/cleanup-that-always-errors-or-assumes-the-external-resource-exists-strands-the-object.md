---
title: "Cleanup that always errors or assumes the external resource exists strands the object"
type: finding
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-finalizers
    hash: ca11dffc241b
    ingested: 2026-11-25
aliases: []
tags: [pitfall, finalizers, operators, idempotency]
---

# Cleanup that always errors or assumes the external resource exists strands the object

## Observation

A finalizer is removed only when cleanup succeeds, so a cleanup that never succeeds keeps the object in Terminating indefinitely. The Kubernetes blog lists finalizers with no controller to clear them, and cleanup that fails or loops, as the pitfalls. The farishuskovic.dev tutorial adds that cleanup must tolerate an external resource that has already been deleted, for example by an earlier attempt, a person, or another process. If the cleanup treats "not found" as an error, the second attempt fails forever. [sources/research-finalizers](../sources/research-finalizers.md)

## Mitigations

Write cleanup as an idempotent step that treats an absent resource as success, add timeouts, and watch for objects that stay Terminating. The OneUptime runbook gives the same advice for operators. See [concepts/idempotency](../concepts/idempotency.md) and [findings/failure-retry-loops-and-backoff](failure-retry-loops-and-backoff.md).

## Related

[concepts/finalizers](../concepts/finalizers.md), [findings/finalizers-strand-objects-in-terminating-when-the-controller-is-missing-or-failing](finalizers-strand-objects-in-terminating-when-the-controller-is-missing-or-failing.md), [examples/kubebuilder-reconcile-adds-a-finalizer-before-external-work-and-removes-it-after-cleanup](../examples/kubebuilder-reconcile-adds-a-finalizer-before-external-work-and-removes-it-after-cleanup.md)

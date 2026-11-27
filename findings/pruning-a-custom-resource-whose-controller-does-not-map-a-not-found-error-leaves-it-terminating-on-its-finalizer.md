---
title: Pruning a custom resource whose controller does not map a not-found error leaves it terminating on its finalizer
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-g1-gitops-drift-incidents
    hash: 0a1a75f3cab5
    ingested: 2026-11-26
aliases: []
tags: [pitfall, prune, finalizers, ack, argo-cd, deletion]
---

# Pruning a custom resource whose controller does not map a not-found error leaves it terminating on its finalizer

## Observation

ACK issue 2911 (2026-06-04) shows a prune that completes the cloud deletion but not the Kubernetes one. Argo CD pruned a WAFv2 WebACL custom resource, AWS WAF was removed, and the CR stayed in `Terminating` because the controller did not map the AWS not-found error that followed. The reporter says it stays that way "until the finalizer is patched off manually". A maintainer confirmed the cause and said the fix is an exception-code mapping in the generator configuration. [sources/research-gap-g1-gitops-drift-incidents](../sources/research-gap-g1-gitops-drift-incidents.md) See [examples/an-argo-cd-prune-left-an-ack-wafv2-webacl-terminating-on-its-finalizer-after-the-aws-resource-was-already-gone](../examples/an-argo-cd-prune-left-an-ack-wafv2-webacl-terminating-on-its-finalizer-after-the-aws-resource-was-already-gone.md).

## Why it matters for forced removal

This is the setup in which a manual finalizer patch is the documented way out, and in this case it is safe because the guarded AWS resource was already gone. That safety depends on checking first. The same patch on a CR whose cloud resource still exists would skip cleanup, see [findings/forcing-a-finalizer-off-skips-cleanup-and-can-leak-billing-resources-or-corrupt-data](forcing-a-finalizer-off-skips-cleanup-and-can-leak-billing-resources-or-corrupt-data.md). It is one reporter's account, on a single controller version, and not a rate.

## Related

[findings/finalizers-strand-objects-in-terminating-when-the-controller-is-missing-or-failing](finalizers-strand-objects-in-terminating-when-the-controller-is-missing-or-failing.md), [decisions/remove-a-stuck-finalizer-by-force-or-repair-the-owning-controller](../decisions/remove-a-stuck-finalizer-by-force-or-repair-the-owning-controller.md), [entities/ack](../entities/ack.md)

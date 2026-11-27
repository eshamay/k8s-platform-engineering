---
title: The ACK runtime sends merge patches and sets no server-side apply field manager
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-m4-ssa-conflict-policy
    hash: 28e595eae3e0
    ingested: 2026-11-26
aliases: [ACK server-side apply behavior]
tags: [ack, server-side-apply, merge-patch, field-manager, verified]
---

# The ACK runtime sends merge patches and sets no server-side apply field manager

## Observation

The AWS Controllers for Kubernetes runtime reconciler writes with controller-runtime merge patches, for example `client.MergeFrom(desiredCleaned.RuntimeObject())`, and uses `StrategicMergeFrom` for Secrets and ConfigMaps. A search of the non-test, non-mock Go files for `ForceOwnership`, `FieldOwner`, and `client.Apply` found nothing outside a mock. [sources/research-gap-m4-ssa-conflict-policy](../sources/research-gap-m4-ssa-conflict-policy.md) URL: https://github.com/aws-controllers-k8s/runtime/blob/main/pkg/runtime/reconciler.go (commit b1f8861, 2026-11-26).

## Limits of the evidence

The conclusion rests on absence in the runtime repository, and the individual per-service controllers were not read. The wiki can therefore say that the shared ACK runtime sets no server-side apply manager, and cannot say that no ACK controller ever does. The latest runtime release read was v0.68.0, published 2026-11-09.

## Why it matters

A merge patch from a controller is an Update-type write, so the API server records the manager from the User-Agent and never raises a conflict for it. ACK therefore cannot lose a field-ownership dispute in the server-side apply sense, and a GitOps tool that applies the same resource with server-side apply and force can take fields from it silently. The wiki's ACK adoption findings show the practical result: see [examples/ack-issue-3152-adoption-under-argo-cd-or-flux-overwrites-the-adopted-aws-resource-with-the-git-spec](../examples/ack-issue-3152-adoption-under-argo-cd-or-flux-overwrites-the-adopted-aws-resource-with-the-git-spec.md) and [concepts/server-side-apply-and-field-ownership](../concepts/server-side-apply-and-field-ownership.md).

## Related

[entities/ack](../entities/ack.md), [comparisons/ssa-conflict-policy-across-tools](../comparisons/ssa-conflict-policy-across-tools.md), [findings/multiple-writers-on-one-object](multiple-writers-on-one-object.md)

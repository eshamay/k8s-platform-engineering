---
title: No source quantifies how often forced finalizer removal orphans guarded resources
type: finding
status: draft
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-g1-gitops-drift-incidents
    hash: 0a1a75f3cab5
    ingested: 2026-11-26
aliases: []
tags: [evidence-gap, finalizers, orphans, force-removal]
---

# No source quantifies how often forced finalizer removal orphans guarded resources

## Observation

The Kubernetes finalizers page warns that "forcefully removing them can lead to issues in your cluster" and names the safe condition, which is that the finalizer's purpose is accomplished another way. It gives no frequency. The dossier searched the page text and the issues of kubernetes, cluster-api, crossplane, and ACK and found no survey, incident count, or rate. A rate of orphaning after forced removal is therefore UNVERIFIED, and the wiki should not state one. [sources/research-gap-g1-gitops-drift-incidents](../sources/research-gap-g1-gitops-drift-incidents.md) URL: https://kubernetes.io/docs/concepts/overview/working-with-objects/finalizers/

## Caveats

The absence claim rests on a text search of one page, a weak search tool, and anonymous issue reporters, so it is weak evidence that no rate exists. The orphaning mechanisms are documented without a rate, see [findings/resources-are-orphaned-when-a-controller-misses-the-delete-or-the-finalizer-is-added-too-late](resources-are-orphaned-when-a-controller-misses-the-delete-or-the-finalizer-is-added-too-late.md) and [examples/an-argo-cd-prune-left-an-ack-wafv2-webacl-terminating-on-its-finalizer-after-the-aws-resource-was-already-gone](../examples/an-argo-cd-prune-left-an-ack-wafv2-webacl-terminating-on-its-finalizer-after-the-aws-resource-was-already-gone.md), where the manual patch was safe because the AWS resource was already gone.

## Related

[findings/forcing-a-finalizer-off-skips-cleanup-and-can-leak-billing-resources-or-corrupt-data](forcing-a-finalizer-off-skips-cleanup-and-can-leak-billing-resources-or-corrupt-data.md), [decisions/remove-a-stuck-finalizer-by-force-or-repair-the-owning-controller](../decisions/remove-a-stuck-finalizer-by-force-or-repair-the-owning-controller.md), [concepts/finalizers](../concepts/finalizers.md)

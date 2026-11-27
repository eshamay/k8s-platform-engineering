---
title: "Argo CD Applications use three cascade finalizer names and a non-cascading delete removes the finalizer"
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-m1-finalizers
    hash: 014549e333b6
    ingested: 2026-11-26
aliases: []
tags: [argo-cd, finalizers, deletion, gitops, propagation]
---

# Argo CD Applications use three cascade finalizer names and a non-cascading delete removes the finalizer

## Observation

Argo CD defines three finalizer spellings that all mean "cascade this Application delete to its resources": the bare `resources-finalizer.argocd.argoproj.io`, the explicit `resources-finalizer.argocd.argoproj.io/foreground`, and `resources-finalizer.argocd.argoproj.io/background`. The documentation says the default cascading delete is foreground. The controller picks background propagation only when the finalizer is exactly the `/background` one and otherwise falls through to foreground, so the bare name and the `/foreground` name behave the same in the code that was read. [sources/research-gap-m1-finalizers](../sources/research-gap-m1-finalizers.md)

Two other finalizers are unrelated to cascading. `pre-delete-finalizer.argocd.argoproj.io` and `post-delete-finalizer.argocd.argoproj.io` track PreDelete and PostDelete hook execution, with an optional `/stage` suffix. During a cascade the delete loop waits while any live object it lists still has a deletionTimestamp, and the code comment ties this to proceeding with the next sync wave. The dossier did not find reverse-order wave processing in the source. [sources/research-gap-m1-finalizers](../sources/research-gap-m1-finalizers.md)

## How to delete an Application without deleting its workloads

A non-cascading delete removes the finalizer or never adds it. The documented routes are `argocd app delete APPNAME --cascade=false`, patching `finalizers` to null before a `kubectl delete`, and the UI choice Non-Cascading (Orphan), which deletes only the Application resource. For ApplicationSet-generated Applications, `syncPolicy.preserveResourcesOnDeletion` stops the finalizer being added. [sources/research-gap-m1-finalizers](../sources/research-gap-m1-finalizers.md)

The `PrunePropagationPolicy` sync option accepts background, foreground, and orphan. It governs pruning during a sync and does not change how an Application delete is propagated, so the two controls are easy to confuse. See [findings/argo-cd-foreground-deletion-makes-crossplane-ignore-the-composite-deletion-policy](argo-cd-foreground-deletion-makes-crossplane-ignore-the-composite-deletion-policy.md) for the case where the sync option and a background finalizer are used together.

## Evidence limits

All reads came from the master branch on 2026-11-26, and Argo CD v3.6.3 was the newest release. Whether the `/foreground` spelling differs from the bare name in any other code path is not settled. The dossier searched `appcontroller.go` and `types.go` and found no distinct branch. [sources/research-gap-m1-finalizers](../sources/research-gap-m1-finalizers.md)

## Related

[entities/argo-cd](../entities/argo-cd.md), [examples/argo-cd-resources-finalizer-cascades-an-application-delete-to-its-workloads](../examples/argo-cd-resources-finalizer-cascades-an-application-delete-to-its-workloads.md), [comparisons/finalizer-gated-teardown-across-argo-cd-flux-kro-and-cluster-api](../comparisons/finalizer-gated-teardown-across-argo-cd-flux-kro-and-cluster-api.md), [concepts/finalizers](../concepts/finalizers.md)

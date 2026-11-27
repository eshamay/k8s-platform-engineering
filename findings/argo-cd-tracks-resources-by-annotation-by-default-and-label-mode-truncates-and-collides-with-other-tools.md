---
title: "Argo CD tracks resources by annotation by default and label mode truncates and collides with other tools"
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-m2-ownership-gc
    hash: 62aafaded9c0
    ingested: 2026-11-26
aliases: []
tags: [pitfall, argo-cd, resource-tracking, labels, annotations, prune]
---

# Argo CD tracks resources by annotation by default and label mode truncates and collides with other tools

## Observation

Argo CD has three tracking methods, chosen by `application.resourceTrackingMethod` in `argocd-cm`. `annotation` is the default and uses `argocd.argoproj.io/tracking-id`. `annotation+label` also writes the `app.kubernetes.io/instance` label, but "The label is not used for tracking purposes, and the value is still truncated if longer than 63 characters." `label` uses the instance label as the tracking key. Changing the method requires a re-sync. [sources/research-gap-m2-ownership-gc](../sources/research-gap-m2-ownership-gc.md) URL: https://github.com/argoproj/argo-cd/blob/master/docs/user-guide/resource_tracking.md

The docs list label-mode limits: values are truncated to 63 characters, other tools can write the same label, and several Argo CD instances on one cluster interfere. Setting `installationID` adds an `argocd.argoproj.io/installation-id` annotation to separate instances. In `util/argo/resource_tracking.go`, label-only mode keeps the value untruncated, "to avoid breaking resource-to-app matching", and lets Kubernetes report a validation error for an over-long value. [sources/research-gap-m2-ownership-gc](../sources/research-gap-m2-ownership-gc.md)

## Pitfall: a tracking annotation that points elsewhere

With the annotation methods, a tracking annotation that does not reference the resource it sits on (name, namespace, group, kind) means the resource "will neither affect the application's sync status nor be marked for pruning." The docs cite resources copied by the Hierarchical Namespace Controller as the case. A copied manifest therefore becomes invisible to Argo CD instead of being reported as drift. [sources/research-gap-m2-ownership-gc](../sources/research-gap-m2-ownership-gc.md)

## Prune propagation

Pruned resources use the foreground deletion policy by default. The `PrunePropagationPolicy` sync option accepts `background`, `foreground`, and `orphan`, and the controller falls back to foreground when the value is missing or unknown. gitops-engine passes the value as `DeleteOptions.PropagationPolicy`. Application deletion is separate: it defaults to foreground cascading through `resources-finalizer.argocd.argoproj.io`, and the `/background` finalizer selects background. [sources/research-gap-m2-ownership-gc](../sources/research-gap-m2-ownership-gc.md) See [findings/argo-cd-applications-use-three-cascade-finalizer-names-and-a-non-cascading-delete-removes-the-finalizer](argo-cd-applications-use-three-cascade-finalizer-names-and-a-non-cascading-delete-removes-the-finalizer.md) and [findings/argo-cd-foreground-deletion-makes-crossplane-ignore-the-composite-deletion-policy](argo-cd-foreground-deletion-makes-crossplane-ignore-the-composite-deletion-policy.md).

## Caveat

The docs were read from the `master` branch, not a stated release; the latest release at read time was v3.6.3. No statement was found on how the three methods interact with owner-reference-based discovery of child resources. See [decisions/choose-an-argo-cd-resource-tracking-method-annotation-annotation-plus-label-or-label](../decisions/choose-an-argo-cd-resource-tracking-method-annotation-annotation-plus-label-or-label.md).

## Related

[entities/argo-cd](../entities/argo-cd.md), [concepts/owner-references-and-garbage-collection](../concepts/owner-references-and-garbage-collection.md), [comparisons/how-tools-garbage-collect-owner-references-inventory-and-finalizers](../comparisons/how-tools-garbage-collect-owner-references-inventory-and-finalizers.md)

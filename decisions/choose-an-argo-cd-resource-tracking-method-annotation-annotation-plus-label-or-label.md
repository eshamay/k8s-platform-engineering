---
title: "Choose an Argo CD resource tracking method: annotation, annotation plus label, or label"
type: decision
status: draft
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-m2-ownership-gc
    hash: 62aafaded9c0
    ingested: 2026-11-26
aliases: []
tags: [decision, argo-cd, resource-tracking, labels, annotations, evidence-only]
---

# Choose an Argo CD resource tracking method: annotation, annotation plus label, or label

## Status

Open and evidence-only. The docs describe the three methods and their limits. The dossier found no incident report or measurement comparing them, so this page recommends nothing. [sources/research-gap-m2-ownership-gc](../sources/research-gap-m2-ownership-gc.md)

## Context

`application.resourceTrackingMethod` in `argocd-cm` decides how Argo CD marks the resources an Application owns. The choice affects collisions with other tools, behavior with several Argo CD instances, and what is pruned. Changing it requires a re-sync. See [findings/argo-cd-tracks-resources-by-annotation-by-default-and-label-mode-truncates-and-collides-with-other-tools](../findings/argo-cd-tracks-resources-by-annotation-by-default-and-label-mode-truncates-and-collides-with-other-tools.md).

## Options

- **annotation (default).** Uses `argocd.argoproj.io/tracking-id`. A tracking annotation that does not reference the resource it is on makes the resource neither affect sync status nor get pruned. The Crossplane integration guide asks for annotation tracking because label tracking collides with Crossplane's own labels, see [entities/argo-cd](../entities/argo-cd.md).
- **annotation+label.** Adds `app.kubernetes.io/instance` for information only. The label is truncated at 63 characters and plays no part in tracking.
- **label.** Uses `app.kubernetes.io/instance` as the key. Values are truncated to 63 characters in the docs, other tools can write the same label, and multiple Argo CD instances are awkward. `installationID` adds an installation annotation to separate instances.

## Evidence

All three claims are documentation statements from the `master` branch. In source, label-only mode does not truncate the value and lets Kubernetes report a validation error. Nothing was found on interaction with owner-reference-based child discovery. [sources/research-gap-m2-ownership-gc](../sources/research-gap-m2-ownership-gc.md)

## Related

[decisions/give-kro-children-manual-owner-references-or-leave-them-to-applyset-labels](give-kro-children-manual-owner-references-or-leave-them-to-applyset-labels.md), [concepts/owner-references-and-garbage-collection](../concepts/owner-references-and-garbage-collection.md)

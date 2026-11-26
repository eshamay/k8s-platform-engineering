---
title: "Flux Kustomization deletion policy chooses between MirrorPrune, Delete, WaitForTermination, and Orphan"
type: example
status: active
created: 2026-11-25
updated: 2026-11-26
sources:
  - id: research-gap-m1-finalizers
    hash: 014549e333b6
    ingested: 2026-11-26
  - id: research-finalizers
    hash: ca11dffc241b
    ingested: 2026-11-25
aliases: []
tags: [finalizers, flux, gitops, deletion, prune]
---

# Flux Kustomization deletion policy chooses between MirrorPrune, Delete, WaitForTermination, and Orphan

## Scenario

A team removes a Flux Kustomization, either on purpose or by deleting the file that defines it. They want to know whether the objects that it deployed disappear with it. [[sources/research-finalizers]]

## How it works

The Kustomization reference says garbage collection also runs when a Kustomization object is deleted. `spec.prune` governs garbage collection while the object exists, and an object can opt out with the annotation `kustomize.toolkit.fluxcd.io/prune: disabled`. `spec.deletionPolicy` governs what happens to deployed objects at deletion. The options are MirrorPrune (the default, which follows the `prune` setting), Delete, WaitForTermination, and Orphan. WaitForTermination waits for the children to leave etcd, bounded by the Kustomization timeout, and the Kustomization finalizer is removed even if that wait fails (correction recorded 2026-11-26, see [[findings/flux-kustomization-uses-finalizers-fluxcd-io-and-removes-it-even-when-waitfortermination-times-out]]).

## Caveats

A later dossier read the kustomize-controller source and confirmed the finalizer name `finalizers.fluxcd.io`, which the reconciler adds first. A suspended Kustomization or one with an empty inventory deletes nothing. Only the v1 type and the main branch were read, not older API versions. See [[findings/flux-kustomization-uses-finalizers-fluxcd-io-and-removes-it-even-when-waitfortermination-times-out]]. [[sources/research-gap-m1-finalizers]]

## Related

[[entities/flux]], [[comparisons/deletion-policies-across-gitops-and-provider-tools]], [[findings/unintended-deletion-through-prune]], [[concepts/finalizers]]
